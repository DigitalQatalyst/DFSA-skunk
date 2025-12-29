import React, { useState, useEffect } from 'react'
import {
  XIcon,
  BookOpenIcon,
  VideoIcon,
  HelpCircleIcon,
  MapIcon,
  ClockIcon,
  EyeIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
} from 'lucide-react'
import type { HelpCenterArticle } from '../../types/helpCenter'

interface HelpArticleDrawerProps {
  isOpen: boolean
  onClose: () => void
  article: HelpCenterArticle | null
  onHelpful?: (articleId: string, delta: 1 | -1) => void
  helpfulLoading?: boolean
  onOpenFullArticle?: () => void
}
export const HelpArticleDrawer: React.FC<HelpArticleDrawerProps> = ({
  isOpen,
  onClose,
  article,
  onHelpful,
  helpfulLoading = false,
  onOpenFullArticle,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  
  // Reset feedback when drawer opens/closes or article changes
  useEffect(() => {
    console.log('Drawer - Resetting feedback - isOpen:', isOpen, 'articleId:', article?.id)
    setFeedbackSubmitted(false)
    setExpandedSteps([])
  }, [isOpen, article?.id])
  
  if (!isOpen || !article) return null
  
  const toggleStep = (index: number) => {
    setExpandedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }
  const handleFeedback = (helpful: boolean) => {
    console.log('Drawer - Feedback submitted:', helpful)
    setFeedbackSubmitted(true)
    onHelpful?.(article.id, helpful ? 1 : -1)
  }
  const getTypeIcon = () => {
    switch (article.type) {
      case 'Guide':
        return <BookOpenIcon className="h-5 w-5" />
      case 'Video':
        return <VideoIcon className="h-5 w-5" />
      case 'FAQ':
        return <HelpCircleIcon className="h-5 w-5" />
      case 'Walkthrough':
        return <MapIcon className="h-5 w-5" />
      default:
        return <BookOpenIcon className="h-5 w-5" />
    }
  }
  const getTypeColor = () => {
    switch (article.type) {
      case 'Guide':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Video':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'FAQ':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Walkthrough':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  const getDifficultyColor = () => {
    switch (article.difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-xl md:max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div
                  className={`p-1.5 rounded-md flex-shrink-0 ${getTypeColor().split(' ')[0]}`}
                >
                  {getTypeIcon()}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor()}`}
                >
                  {article.type}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor()}`}
                >
                  {article.difficulty}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {article.category || 'General'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2 flex-shrink-0"
              aria-label="Close drawer"
            >
              <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
              <span className="whitespace-nowrap">{article.readTime || 'N/A'}</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
              <span className="whitespace-nowrap">{article.views} views</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <ThumbsUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {article.helpful} helpful
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 ml-auto whitespace-nowrap">
              Updated: {new Date(article.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Summary
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {article.description}
                </p>
              </div>
              {onOpenFullArticle && (
                <button
                  onClick={onOpenFullArticle}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View Full Article
                </button>
              )}
            </div>
          </div>

          {/* Video Player for Video type */}
          {article.type === 'Video' && article.videoUrl && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <VideoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-500">Video Player</span>
                </div>
              </div>
            </div>
          )}

          {/* Steps/Instructions for Guide and Walkthrough */}
          {(article.type === 'Guide' || article.type === 'Walkthrough') &&
            article.steps && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {article.type === 'Walkthrough' ? 'Steps' : 'Instructions'}
                </h3>
                <div className="space-y-2">
                  {article.steps.map((step, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleStep(index)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0 mr-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold mr-3 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 text-left break-words">
                            {step.title}
                          </span>
                        </div>
                        {expandedSteps.includes(index) ? (
                          <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedSteps.includes(index) && (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 bg-gray-50">
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                            {step.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* FAQ Accordion */}
          {article.type === 'FAQ' && article.steps && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2">
                {article.steps.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleStep(index)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-900 pr-4 break-words flex-1">
                        {faq.title}
                      </span>
                      {expandedSteps.includes(index) ? (
                        <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSteps.includes(index) && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 bg-gray-50">
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                          {faq.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources/Links */}
          {article.resources && article.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Related Resources
              </h3>
              <div className="space-y-2">
                {article.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
                  >
                    <span className="text-xs sm:text-sm text-gray-900 group-hover:text-blue-600 break-words pr-2 flex-1">
                      {resource.title}
                    </span>
                    <ExternalLinkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-6 pt-4 border-t border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Was this article helpful?
            </h3>
            {feedbackSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-green-800">
                  Thank you for your feedback! We appreciate your input.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => handleFeedback(true)}
                  disabled={helpfulLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors text-xs sm:text-sm font-medium text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ThumbsUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Yes
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  disabled={helpfulLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors text-xs sm:text-sm font-medium text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ThumbsDownIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
