import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { safeFetch } from '../../utils/safeFetch';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';
interface PollOption {
  id: string;
  option_text: string;
  vote_count: number;
}
interface PollVotingProps {
  postId: string;
  pollDuration?: number;
}
export function PollVoting({
  postId,
  pollDuration = 7
}: PollVotingProps) {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchPollOptions();
  }, [postId]);
  const fetchPollOptions = async () => {
    setLoading(true);
    const [data, error] = await safeFetch(supabase.from('poll_options').select('*').eq('post_id', postId).order('created_at', {
      ascending: true
    }));
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load poll options',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }
    setOptions(data || []);
    setLoading(false);
  };
  const handleVote = async (optionId: string) => {
    if (selectedOption || voting) return;
    setVoting(true);

    // Update vote count
    const option = options.find(o => o.id === optionId);
    if (!option) return;
    const [_, updateError] = await safeFetch(supabase.from('poll_options').update({
      vote_count: option.vote_count + 1
    }).eq('id', optionId));
    if (updateError) {
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
      setVoting(false);
      return;
    }
    setSelectedOption(optionId);
    setVoting(false);

    // Refresh options to show updated counts
    fetchPollOptions();
    toast({
      title: 'Vote recorded',
      description: 'Your vote has been counted'
    });
  };
  const totalVotes = options.reduce((sum, opt) => sum + opt.vote_count, 0);
  if (loading) {
    return <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />)}
      </div>;
  }
  if (options.length === 0) {
    return <div className="text-sm text-muted-foreground italic">
        No poll options available
      </div>;
  }
  return <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Cast your vote</h3>
        {selectedOption && <span className="text-xs text-muted-foreground">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>}
      </div>

      {options.map(option => {
      const percentage = totalVotes > 0 ? option.vote_count / totalVotes * 100 : 0;
      const isSelected = selectedOption === option.id;
      const hasVoted = selectedOption !== null;
      return <button key={option.id} onClick={() => handleVote(option.id)} disabled={hasVoted || voting} className={`
              w-full relative overflow-hidden rounded-lg border transition-all text-left
              ${hasVoted ? 'cursor-default' : 'cursor-pointer hover:border-primary'}
              ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'}
              ${!hasVoted && !voting ? 'hover:shadow-sm' : ''}
            `}>
            {/* Progress bar background */}
            {hasVoted && <div className="absolute inset-0 bg-primary/10 transition-all duration-500" style={{
          width: `${percentage}%`
        }} />}

            {/* Content */}
            <div className="relative flex items-center justify-between p-4">
              <div className="flex items-center gap-3 flex-1">
                {isSelected && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />}
                <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {option.option_text}
                </span>
              </div>

              {hasVoted && <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({option.vote_count})
                  </span>
                </div>}
            </div>
          </button>;
    })}

      {!selectedOption && <p className="text-xs text-muted-foreground mt-3">
          Poll closes in {pollDuration} days
        </p>}
    </div>;
}