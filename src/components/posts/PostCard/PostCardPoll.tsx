import React, { useState } from "react";
import { BasePost } from "../types";
import { BarChart3, Clock, Check } from "lucide-react";
import { Button } from "../../ui/button";
import { format } from "date-fns";
import { usePollVoting } from "../../../hooks/usePollVoting";

interface PostCardPollProps {
  post: BasePost;
  onVoteChange?: () => void;
}

export const PostCardPoll: React.FC<PostCardPollProps> = ({
  post,
  onVoteChange,
}) => {
  const [showAllOptions, setShowAllOptions] = useState(false);

  const {
    options: pollOptions,
    loading,
    userVote,
    pollEnded,
    endDate,
    voting,
    totalVotes,
    handleVote: hookHandleVote,
    getVotePercentage,
  } = usePollVoting({
    postId: post.id,
    createdAt: post.created_at,
    metadata: post.metadata,
    onVoteChange,
  });

  const handleVote = (optionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hookHandleVote(optionId);
  };

  const displayOptions = showAllOptions ? pollOptions : pollOptions.slice(0, 2);
  const remainingOptions = pollOptions.length > 2 ? pollOptions.length - 2 : 0;

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>

      {loading ? (
        <div className="space-y-2">
          <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {displayOptions.map((option) => {
              const percentage = getVotePercentage(option.vote_count);
              const isSelected = userVote === option.id;
              const hasVoted = userVote !== null;

              return (
                <div
                  key={option.id}
                  className={`p-3 border rounded-md transition-all ${
                    isSelected
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  } ${voting ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {option.option_text}
                      </span>
                    </div>
                    {(hasVoted || pollEnded) && (
                      <span className="text-xs font-medium text-gray-700 ml-2">
                        {percentage}%
                      </span>
                    )}
                  </div>

                  {pollEnded || hasVoted ? (
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 w-full overflow-hidden rounded-full ${
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
                      <p className="text-xs text-gray-500">
                        {option.vote_count}{" "}
                        {option.vote_count === 1 ? "vote" : "votes"}
                      </p>
                      {!pollEnded && hasVoted && !isSelected && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-1"
                          onClick={(e) => handleVote(option.id, e)}
                          disabled={voting}
                        >
                          Change to this option
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={(e) => handleVote(option.id, e)}
                      disabled={voting}
                    >
                      Vote
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>
                {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>
            {endDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {pollEnded
                    ? `Ended ${format(endDate, "MMM d")}`
                    : `Ends ${format(endDate, "MMM d")}`}
                </span>
              </div>
            )}
            {!showAllOptions && remainingOptions > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAllOptions(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                +{remainingOptions} more option
                {remainingOptions > 1 ? "s" : ""}
              </button>
            )}
            {showAllOptions && pollOptions.length > 2 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAllOptions(false);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Show less
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
