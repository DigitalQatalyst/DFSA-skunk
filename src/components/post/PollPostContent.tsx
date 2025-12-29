import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { BarChart3, Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { usePollVoting } from "../../hooks/usePollVoting";

interface PollPostContentProps {
  postId: string;
  metadata?: {
    poll_duration_days?: number;
    end_date?: string;
  };
  content?: string;
  content_html?: string;
}

export function PollPostContent({
  postId,
  metadata,
  content,
  content_html,
}: PollPostContentProps) {
  const [createdAt, setCreatedAt] = useState<string>("");

  useEffect(() => {
    // Fetch post creation date for poll end date calculation
    const fetchPostDate = async () => {
      const { data } = await supabase
        .from("posts")
        .select("created_at")
        .eq("id", postId)
        .single();

      if (data?.created_at) {
        setCreatedAt(data.created_at);
      }
    };

    fetchPostDate();
  }, [postId]);

  const {
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
  } = usePollVoting({
    postId,
    createdAt: createdAt || new Date().toISOString(), // Fallback to current date if not loaded yet
    metadata,
  });
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 animate-pulse h-32 rounded-lg"></div>
        <div className="bg-gray-50 animate-pulse h-8 w-3/4 rounded-lg"></div>
      </div>
    );
  }
  if (error && options.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Poll Question/Context */}
      {(content || content_html) && (
        <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
          {content_html ? (
            <div
              dangerouslySetInnerHTML={{
                __html: content_html,
              }}
            />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          )}
        </div>
      )}

      {/* Poll Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Poll Results</h3>
          </div>
          {endDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {pollEnded ? (
                <span>Ended on {format(new Date(endDate), "MMM d, yyyy")}</span>
              ) : (
                <span>Ends on {format(new Date(endDate), "MMM d, yyyy")}</span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {options.map((option) => {
            const percentage = getVotePercentage(option.vote_count || 0);
            const isSelected = userVote === option.id;
            return (
              <div
                key={option.id}
                className={`rounded-lg border ${
                  isSelected
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                } p-3 transition-colors`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "font-medium text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.option_text}
                    </span>
                  </div>
                  {(userVote || pollEnded) && (
                    <span className="text-sm font-medium text-gray-700">
                      {percentage}%
                    </span>
                  )}
                </div>
                {pollEnded ? (
                  // Poll ended - show results only
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${
                      isSelected ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`h-full transition-all ${
                        isSelected ? "bg-blue-600" : "bg-gray-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                ) : userVote ? (
                  // User has voted but poll is still active - show results with change option
                  <div className="space-y-2">
                    <div
                      className={`h-2 w-full overflow-hidden rounded-full ${
                        isSelected ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <div
                        className={`h-full transition-all ${
                          isSelected ? "bg-blue-600" : "bg-gray-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {!isSelected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleVote(option.id)}
                        disabled={voting}
                      >
                        Change to this option
                      </Button>
                    )}
                  </div>
                ) : (
                  // User hasn't voted yet
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-1 text-sm"
                    onClick={() => handleVote(option.id)}
                    disabled={voting}
                  >
                    Vote
                  </Button>
                )}
                {(userVote || pollEnded) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {option.vote_count || 0}{" "}
                    {option.vote_count === 1 ? "vote" : "votes"}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Poll Status Messages */}
      {pollEnded ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            This poll has ended. No new votes can be submitted.
          </p>
        </div>
      ) : userVote ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-blue-800">
            You've voted! You can change your vote anytime before the poll ends.
          </p>
        </div>
      ) : null}
    </div>
  );
}
