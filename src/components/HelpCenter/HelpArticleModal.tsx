import React, { useState, useEffect } from 'react'
import { XIcon, BookOpenIcon, ClockIcon, TagIcon, ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react'
import type { HelpCenterArticle } from '../../types/helpCenter'
interface HelpArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: HelpCenterArticle | null
  onHelpful?: (articleId: string, delta: 1 | -1) => void
  helpfulLoading?: boolean
}
export const HelpArticleModal: React.FC<HelpArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  onHelpful,
  helpfulLoading = false,
}) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)

  // Reset feedback when modal opens/closes or article changes
  useEffect(() => {
    // Always reset when modal state changes or article changes
    console.log('Resetting feedback - isOpen:', isOpen, 'articleId:', article?.id)
    setFeedback(null)
    setShowThankYou(false)
  }, [isOpen, article?.id])

  const handleFeedback = (value: 'yes' | 'no') => {
    if (!article || helpfulLoading) return
    console.log('Feedback submitted:', value)
    setFeedback(value)
    setShowThankYou(true)
    onHelpful?.(article.id, value === 'yes' ? 1 : -1)
    setTimeout(() => {
      setShowThankYou(false)
      setFeedback(null)
    }, 3000)
  }

  if (!isOpen || !article) return null
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500">{article.category || 'General'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-1.5" />
                  {article.readTime || 'N/A'} read
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpenIcon className="h-4 w-4 mr-1.5" />
                  {article.views} views
                </div>
                <div className="text-sm text-gray-500">
                  Updated: {new Date(article.lastUpdated).toLocaleDateString()}
                </div>
              </div>

              {/* Article Description */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* Article Content */}
            <div className="prose prose-blue max-w-none mb-6">
              <div
                className="text-gray-800 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: article.content || article.description || '<p>No content provided.</p>',
                }}
              />
            </div>

              {/* Tags */}
              {article.tags?.length ? (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center flex-wrap gap-2">
                    <TagIcon className="h-4 w-4 text-gray-400" />
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
              ) : null}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              {showThankYou ? (
                <div className="flex items-center justify-center text-green-600 font-medium">
                  <ThumbsUpIcon className="h-5 w-5 mr-2" />
                  Thank you for your feedback!
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Was this article helpful?
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleFeedback('no')}
                      disabled={feedback !== null || helpfulLoading}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center ${
                        feedback === 'no'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ThumbsDownIcon className="h-4 w-4 mr-1.5" />
                      No
                    </button>
                    <button 
                      onClick={() => handleFeedback('yes')}
                      disabled={feedback !== null || helpfulLoading}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center ${
                        feedback === 'yes'
                          ? 'bg-green-600 text-white'
                          : 'text-white bg-blue-600 hover:bg-blue-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ThumbsUpIcon className="h-4 w-4 mr-1.5" />
                      Yes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
