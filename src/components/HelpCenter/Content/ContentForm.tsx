import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Types for content
type ContentType = 'article' | 'guide' | 'faq' | 'announcement' | 'policy'
type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled'
type ContentFormProps = {
  contentId?: string // Optional for editing existing content
}
export const ContentForm: React.FC<ContentFormProps> = ({ contentId }) => {
  const navigate = useNavigate()
  // Mock content data (in a real app, this would come from your API)
  const mockContent = contentId
    ? {
        id: contentId,
        title: 'Guide to Business Registration in Abu Dhabi',
        type: 'guide' as ContentType,
        status: 'published' as ContentStatus,
        summary:
          'Learn about the process of registering a business in Abu Dhabi.',
        content:
          'This comprehensive guide covers all the steps needed to register a business in Abu Dhabi, including required documents, fees, and timelines.\n\nStep 1: Choose your business activity\nStep 2: Select a legal form\nStep 3: Apply for initial approval\nStep 4: Choose and reserve a trade name\nStep 5: Prepare and submit documents\nStep 6: Pay fees and receive license',
        author: 'Mohammed Al Hashimi',
        department: 'Business Registration',
        tags: ['business', 'registration', 'license'],
        publishDate: '2023-06-15',
        lastUpdated: '2023-07-20',
        featuredImage: 'https://example.com/images/business-registration.jpg',
        attachments: [
          {
            name: 'Registration Form',
            url: 'https://example.com/docs/registration-form.pdf',
          },
        ],
        relatedContent: ['2', '3'],
      }
    : null
  // Form state
  const [formData, setFormData] = useState({
    title: mockContent?.title || '',
    type: mockContent?.type || 'article',
    status: mockContent?.status || 'draft',
    summary: mockContent?.summary || '',
    content: mockContent?.content || '',
    author: mockContent?.author || '',
    department: mockContent?.department || '',
    tags: mockContent?.tags?.join(', ') || '',
    publishDate: mockContent?.publishDate || '',
    featuredImage: mockContent?.featuredImage || '',
    attachments: mockContent?.attachments?.map((a) => a.name).join(', ') || '',
  })
  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process form data
    const processedData = {
      id: mockContent?.id || String(Date.now()),
      title: formData.title,
      type: formData.type as ContentType,
      status: formData.status as ContentStatus,
      summary: formData.summary,
      content: formData.content,
      author: formData.author,
      department: formData.department,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      publishDate:
        formData.publishDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      featuredImage: formData.featuredImage,
      attachments: formData.attachments
        ? formData.attachments.split(',').map((name) => ({
            name: name.trim(),
            url: `https://example.com/docs/${name.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`,
          }))
        : [],
      relatedContent: mockContent?.relatedContent || [],
    }
    // In a real application, you would save this data to your backend
    console.log('Submitting content data:', processedData)
    // Add success message (in a real app, this would be a toast notification)
    alert(`Content ${mockContent ? 'updated' : 'created'} successfully!`)
    // Navigate back to help center
    navigate('/dashboard/help-center')
  }
  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {mockContent ? 'Edit Content' : 'Create New Content'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {mockContent
              ? 'Update existing content'
              : 'Create new content for the platform'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Essential details about the content.
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="article">Article</option>
                  <option value="guide">Guide</option>
                  <option value="faq">FAQ</option>
                  <option value="announcement">Announcement</option>
                  <option value="policy">Policy</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Summary *
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={2}
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={12}
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use plain text format. For a new paragraph, add an empty line.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Additional Details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                More information about the content.
              </p>
            </div>
            <div className="p-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. business, license, registration"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="publishDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Publish Date
                </label>
                <input
                  type="date"
                  id="publishDate"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="featuredImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="featuredImage"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  placeholder="https://example.com/images/image.jpg"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="attachments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Attachments (comma-separated names)
                </label>
                <input
                  type="text"
                  id="attachments"
                  name="attachments"
                  value={formData.attachments}
                  onChange={handleChange}
                  placeholder="e.g. Registration Form, Guidelines Document"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-2 text-sm text-gray-500">
                  In a real application, this would be a file upload field.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/help-center')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mockContent ? 'Update Content' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
