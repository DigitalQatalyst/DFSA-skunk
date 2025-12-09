/**
 * BeneficialOwnershipStep Component
 * Fifth step of the DFSA onboarding form
 *
 * Features:
 * - Beneficial ownership table with dynamic rows
 * - 100% total control validation
 * - Max 15 beneficial owners
 * - Control type selection (direct, indirect, voting rights)
 *
 * Only visible for Pathways A (Financial Services) and C (Crypto Token)
 */

import React, { useState } from 'react'
import { BeneficialOwnerTable } from '../components/BeneficialOwnerTable'
import { FormFieldGroup } from '../components/FormFieldGroup'
import { HelpDrawer, HelpSection } from '../components/HelpDrawer'

/**
 * Help sections for the beneficial ownership form
 */
const beneficialOwnershipHelpSections: HelpSection[] = [
  {
    id: 'definition',
    type: 'definition',
    title: 'Beneficial Ownership Definition',
    content: (
      <div>
        <p className="mb-2">
          A beneficial owner is an individual who ultimately owns or controls the entity, either:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Direct ownership:</strong> Holds 25% or more of the shares or voting rights
          </li>
          <li>
            <strong>Indirect ownership:</strong> Controls 25% or more through other entities or
            arrangements
          </li>
          <li>
            <strong>Other control:</strong> Exercises control through other means (e.g., veto
            rights, board appointments)
          </li>
        </ul>
        <p className="mt-2">
          <strong>Note:</strong> If no individual meets these thresholds, identify the senior
          managing officials.
        </p>
      </div>
    ),
  },
  {
    id: 'guidance',
    type: 'guidance',
    title: 'Guidance Notes',
    content: (
      <dl className="space-y-3">
        <div>
          <dt className="font-medium text-gray-700">Who qualifies as a beneficial owner?</dt>
          <dd className="text-gray-600 mt-0.5">
            Only natural persons (individuals) can be beneficial owners. If the immediate
            shareholder is a corporate entity, you must identify the natural persons who ultimately
            control that entity.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Control Type - Direct</dt>
          <dd className="text-gray-600 mt-0.5">
            The individual directly holds shares or voting rights in the applicant entity.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Control Type - Indirect</dt>
          <dd className="text-gray-600 mt-0.5">
            The individual holds control through one or more intermediate entities. For example,
            Person A owns 100% of Company B, which owns 50% of the applicant entity. Person A has
            50% indirect control.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Control Type - Voting Rights</dt>
          <dd className="text-gray-600 mt-0.5">
            The individual controls voting rights through special arrangements, such as voting
            agreements, proxies, or nominee arrangements, even if they do not directly hold shares.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Percentage of Control</dt>
          <dd className="text-gray-600 mt-0.5">
            Express as a percentage of total control (0-100%). For complex ownership structures,
            calculate the ultimate effective control percentage. The total across all beneficial
            owners must equal 100%.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Date of Birth</dt>
          <dd className="text-gray-600 mt-0.5">
            Required for identity verification purposes. Must match official identification
            documents.
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: 'documents',
    type: 'documents',
    title: 'Document Requirements',
    content: (
      <p>
        You will be required to provide identification documents (passport or national ID) for all
        beneficial owners in the documents section. If beneficial ownership is exercised through
        complex structures, a beneficial ownership diagram may be requested.
      </p>
    ),
  },
]

export const BeneficialOwnershipStep: React.FC = () => {
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header with Help Button */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Beneficial Ownership</h2>
          <p className="text-sm text-gray-600 mt-2">
            Identify all beneficial owners with 25% or more control. Total control must equal 100%.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (Ref: DFSA Rulebook GEN Module Rule 2.2.3)
          </p>
        </div>
        <HelpDrawer
          formTitle="Beneficial Ownership"
          sections={beneficialOwnershipHelpSections}
          isOpen={isHelpDrawerOpen}
          onOpenChange={setIsHelpDrawerOpen}
          ruleReference="DFSA Rulebook GEN Module Rule 2.2.3 - Beneficial Ownership Disclosure Requirements"
        />
      </div>

      {/* Beneficial Owner Information Group */}
      <FormFieldGroup
        title="Beneficial Owner Information"
        groupId="beneficial-owner-information"
        fieldNames={['beneficialOwners']}
        isRequired={true}
        helpText="Identify all natural persons who ultimately own or control 25% or more of the entity. (Ref: DFSA Rulebook GEN Module Rule 2.2.3)"
        defaultExpanded={true}
        fields={<BeneficialOwnerTable />}
      />

      {/* Regulatory Note */}
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
        <p>
          <strong>Note:</strong> Beneficial ownership information is subject to verification and may
          be shared with relevant authorities in accordance with anti-money laundering regulations.
          Providing false or misleading information is a serious offense.
        </p>
      </div>
    </div>
  )
}
