/**
 * DocumentUploadsStep Component
 * Eighth step of the DFSA onboarding form
 *
 * Features:
 * - Base documents for all pathways
 * - Pathway-specific additional documents
 * - Document upload with validation
 *
 * All pathways see this step with different required documents
 */

import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { DFSAOnboardingFormData } from '../types'
import { usePathwayConfig } from '../hooks/usePathwayConfig'
import { getRequiredDocuments } from '../validation'

interface DocumentFieldProps {
  name: string
  label: string
  required: boolean
  helpText?: string
}

const DocumentField: React.FC<DocumentFieldProps> = ({ name, label, required, helpText }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<DFSAOnboardingFormData>()

  // Get nested error
  const error = name.split('.').reduce((acc: any, part: string) => acc?.[part], errors)

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <div>
            <input
              type="file"
              id={name}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // In a real implementation, this would upload to Azure Blob Storage
                  // and return a URL. For now, we'll use a valid URL placeholder
                  field.onChange(`https://placeholder.local/uploads/${file.name}`)
                }
              }}
              className={`
                w-full px-3 py-2 border rounded-md text-sm
                focus:ring-2 focus:ring-primary focus:border-transparent
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-dfsa-teal-50 file:text-dfsa-teal-800
                hover:file:bg-dfsa-teal-100
                ${error ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {field.value && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                File uploaded
              </p>
            )}
          </div>
        )}
      />

      {error && <p className="text-xs text-red-500">{error.message}</p>}
      {helpText && !error && <p className="text-xs text-gray-500">{helpText}</p>}
    </div>
  )
}

export const DocumentUploadsStep: React.FC = () => {
  const { watch } = useFormContext<DFSAOnboardingFormData>()
  const activityType = watch('activityType')

  const { config } = usePathwayConfig(activityType)
  const requiredDocs = getRequiredDocuments(activityType)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Uploads</h2>
        <p className="text-sm text-gray-600 mt-2">
          Upload all required documentation. Documents must be clear, legible, and in English or
          accompanied by certified translations.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Ref: DFSA Rulebook GEN Module Rule 2.2.8 - Documentation Requirements)
        </p>
      </div>

      {/* File Requirements */}
      <div className="bg-dfsa-teal-50 border-l-4 border-dfsa-teal-600 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-dfsa-teal-600" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-dfsa-teal-800">File Upload Requirements</h3>
            <ul className="mt-2 text-sm text-dfsa-teal-800 list-disc pl-5 space-y-1">
              <li>Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
              <li>Maximum file size: 10MB per document</li>
              <li>Documents must be current and not expired</li>
              <li>Scanned copies must be clear and fully legible</li>
              <li>Documents not in English must include certified translations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Base Documents (All Pathways) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Documents</h3>
        <p className="text-sm text-gray-600 mb-6">
          The following documents are required for all licence applications.
        </p>

        <div className="space-y-6">
          <DocumentField
            name="documents.certificateOfIncorporation"
            label="Certificate of Incorporation"
            required={true}
            helpText="Official document evidencing legal incorporation, issued by the incorporating authority."
          />

          <DocumentField
            name="documents.articlesOfAssociation"
            label="Articles of Association (or equivalent constitutional documents)"
            required={true}
            helpText="The governing documents that set out the entity's structure and rules."
          />

          <DocumentField
            name="documents.businessPlan"
            label="Business Plan"
            required={true}
            helpText="Comprehensive business plan detailing proposed activities, target markets, revenue model, and growth strategy (minimum 3-year projection)."
          />
        </div>
      </div>

      {/* Pathway A - Financial Services */}
      {config.pathway === 'A' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Financial Services - Additional Documents
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Additional documents required for Financial Services licence applications.
          </p>

          <div className="space-y-6">
            <DocumentField
              name="documents.complianceManual"
              label="Compliance Manual"
              required={true}
              helpText="Comprehensive compliance policies and procedures manual covering all regulatory obligations."
            />

            <DocumentField
              name="documents.amlPolicy"
              label="AML/CFT Policy & Procedures"
              required={true}
              helpText="Anti-Money Laundering and Combating Financing of Terrorism policies, including customer due diligence, transaction monitoring, and suspicious activity reporting."
            />

            <DocumentField
              name="documents.shareholderRegistry"
              label="Shareholder Registry"
              required={true}
              helpText="Official register of all shareholders with ownership percentages and identification details."
            />

            <DocumentField
              name="documents.keyPersonnelCVs"
              label="CVs of Key Personnel (Compliance Officer, MLRO, Senior Management)"
              required={true}
              helpText="Detailed CVs demonstrating qualifications and experience of all key personnel."
            />
          </div>
        </div>
      )}

      {/* Pathway C - Crypto Token */}
      {config.pathway === 'C' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Crypto Token - Additional Documents
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Additional documents required for Crypto Token licence applications.
          </p>

          <div className="space-y-6">
            <DocumentField
              name="documents.whitePaper"
              label="White Paper"
              required={true}
              helpText="Comprehensive white paper detailing the token project, technology, use cases, and tokenomics."
            />

            <DocumentField
              name="documents.tokenEconomicsModel"
              label="Token Economics Model"
              required={true}
              helpText="Detailed token economics including supply, distribution, vesting schedules, and utility."
            />

            <DocumentField
              name="documents.cryptoShareholderRegistry"
              label="Shareholder Registry"
              required={true}
              helpText="Official register of all shareholders with ownership percentages and identification details."
            />

            <DocumentField
              name="documents.technicalArchitecture"
              label="Technical Architecture Document"
              required={true}
              helpText="Technical documentation describing blockchain architecture, smart contracts, and security measures."
            />

            <DocumentField
              name="documents.securityAudit"
              label="Security Audit Report"
              required={false}
              helpText="Independent security audit of smart contracts and platform infrastructure (highly recommended)."
            />
          </div>
        </div>
      )}

      {/* Optional Supporting Documents */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Optional Supporting Documents
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Additional documents that may support your application (not required but recommended).
        </p>

        <div className="space-y-6">
          <DocumentField
            name="documents.auditedFinancials"
            label="Audited Financial Statements"
            required={false}
            helpText="Most recent audited financial statements (if available)."
          />

          <DocumentField
            name="documents.bankReferences"
            label="Bank References"
            required={false}
            helpText="Reference letters from banking institutions."
          />

          <DocumentField
            name="documents.professionalIndemnity"
            label="Professional Indemnity Insurance"
            required={false}
            helpText="Proof of professional indemnity insurance coverage (if applicable)."
          />

          <DocumentField
            name="documents.groupStructureDiagram"
            label="Group Structure Diagram"
            required={false}
            helpText="Visual diagram showing corporate group structure (if part of a group)."
          />
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              The DFSA may request additional documentation during the review process. Incomplete or
              unclear documentation may result in processing delays. All documents uploaded are
              subject to verification and authentication checks.
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Note */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>
          <strong>Note:</strong> Document retention requirements apply. Copies of all submitted
          documents should be retained for a minimum of 7 years.
        </p>
      </div>
    </div>
  )
}
