import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { addDays, isPast } from 'date-fns';
import { useAuth } from '../context/UnifiedAuthProvider';
import { useToast } from './use-toast';

interface PollOption {
  id: string;
  option_text: string;
  vote_count: number;
}

interface PollMetadata {
  poll_duration_days?: number;
  end_date?: string;
}

interface UsePollVotingProps {
  postId: string;
  createdAt: string;
  metadata?: PollMetadata;
  onVoteChange?: () => void;
}

export function usePollVoting({
  postId,
  createdAt,
  metadata,
  onVoteChange,
}: UsePollVotingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [options, setOptions] = useState<PollOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [pollEnded, setPollEnded] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPollOptions();
    checkUserVote();
    calculatePollEndDate();
  }, [postId, user?.id]);

  const calculatePollEndDate = () => {
    if (metadata?.end_date) {
      const date = new Date(metadata.end_date);
      if (!isNaN(date.getTime())) {
        setEndDate(date);
        setPollEnded(isPast(date));
      }
      return;
    }

    if (!createdAt) return; // Don't calculate if createdAt is not available

    const pollDurationDays = metadata?.poll_duration_days || 7;
    const createdAtDate = new Date(createdAt);
    
    if (!isNaN(createdAtDate.getTime())) {
      const calculatedEndDate = addDays(createdAtDate, pollDurationDays);
      setEndDate(calculatedEndDate);
      setPollEnded(isPast(calculatedEndDate));
    }
  };

  const fetchPollOptions = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('poll_options')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError('Failed to load poll options');
      console.error('Poll options fetch error:', fetchError);
    } else if (data && data.length > 0) {
      setOptions(data);
    } else {
      setError('No poll options found');
    }

    setLoading(false);
  };

  const checkUserVote = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('poll_votes')
      .select('option_id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (data) {
      setUserVote(data.option_id);
    }
  };

  const handleVote = async (optionId: string) => {
    setError(null);

    if (!user) {
      setError('Please sign in to vote');
      toast({
        title: 'Sign in required',
        description: 'Please sign in to vote in polls',
        variant: 'destructive',
      });
      return;
    }

    if (pollEnded) {
      setError('This poll has ended');
      toast({
        title: 'Poll ended',
        description: 'This poll has ended',
        variant: 'destructive',
      });
      return;
    }

    if (userVote === optionId) {
      return; // Already voted for this option
    }

    setVoting(true);
    const isChangingVote = userVote && userVote !== optionId;

    try {
      if (isChangingVote) {
        // User is changing their vote
        const oldOption = options.find((opt) => opt.id === userVote);
        const newOption = options.find((opt) => opt.id === optionId);

        if (!oldOption || !newOption) {
          setError('Invalid option selected');
          return;
        }

        // Delete old vote and insert new
        const { error: deleteError } = await supabase
          .from('poll_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (deleteError) {
          setError('Failed to change your vote. Please try again');
          console.error('Vote deletion error:', deleteError);
          return;
        }

        const { error: insertError } = await supabase
          .from('poll_votes')
          .insert({
            post_id: postId,
            user_id: user.id,
            option_id: optionId,
          });

        if (insertError) {
          setError('Failed to submit your new vote. Please try again');
          console.error('New vote submission error:', insertError);
          return;
        }

        // Update vote counts
        await supabase
          .from('poll_options')
          .update({ vote_count: Math.max(0, oldOption.vote_count - 1) })
          .eq('id', userVote);

        await supabase
          .from('poll_options')
          .update({ vote_count: newOption.vote_count + 1 })
          .eq('id', optionId);

        // Update local state
        setUserVote(optionId);
        setOptions(
          options.map((option) => {
            if (option.id === userVote) {
              return { ...option, vote_count: Math.max(0, option.vote_count - 1) };
            }
            if (option.id === optionId) {
              return { ...option, vote_count: option.vote_count + 1 };
            }
            return option;
          })
        );

        toast({
          title: 'Vote changed',
          description: 'Your vote has been updated',
          variant: 'success',
        });
      } else {
        // First time voting
        const { error: voteError } = await supabase.from('poll_votes').insert({
          post_id: postId,
          user_id: user.id,
          option_id: optionId,
        });

        if (voteError) {
          if (voteError.code === '23505') {
            setError('You have already voted in this poll');
            await checkUserVote();
            await fetchPollOptions();
            return;
          }

          setError('Failed to submit your vote. Please try again');
          console.error('Vote submission error:', voteError);
          return;
        }

        // Update vote count
        const currentOption = options.find((opt) => opt.id === optionId);
        if (currentOption) {
          await supabase
            .from('poll_options')
            .update({ vote_count: currentOption.vote_count + 1 })
            .eq('id', optionId);
        }

        // Update local state
        setUserVote(optionId);
        setOptions(
          options.map((option) =>
            option.id === optionId
              ? { ...option, vote_count: option.vote_count + 1 }
              : option
          )
        );

        toast({
          title: 'Vote recorded',
          description: 'Your vote has been submitted',
          variant: 'success',
        });
      }

      onVoteChange?.();
    } catch (err) {
      setError('Network error. Please check your connection and try again');
      console.error('Unexpected error during vote submission:', err);
      toast({
        title: 'Error',
        description: 'Failed to submit vote',
        variant: 'destructive',
      });
    } finally {
      setVoting(false);
    }
  };

  const getVotePercentage = (count: number) => {
    const totalVotes = options.reduce((sum, opt) => sum + opt.vote_count, 0);
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  const totalVotes = options.reduce((sum, opt) => sum + opt.vote_count, 0);

  return {
    options,
    loading,
    userVote,
    pollEnded,
    endDate,
    voting,
    error,
    totalVotes,
    handleVote,
    getVotePercentage,
    refetch: () => {
      fetchPollOptions();
      checkUserVote();
    },
  };
}
