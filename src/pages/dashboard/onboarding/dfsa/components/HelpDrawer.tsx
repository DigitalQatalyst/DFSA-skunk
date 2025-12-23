/**
 * HelpDrawer Component
 * Reusable drawer for displaying help content in DFSA onboarding forms
 *
 * Features:
 * - Section-based content organization (definition, guidance, documents, information)
 * - Responsive: full width on mobile, 400-540px on desktop
 * - Color-coded sections matching original inline boxes
 * - WCAG 2.1 AA accessibility compliance
 *
 * Used by: BeneficialOwnershipStep, RegulatoryComplianceStep, EntityStructureStep
 */

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../../../../components/ui/sheet'
import { Button } from '../../../../../components/ui/button'
import { Separator } from '../../../../../components/ui/separator'
import { HelpCircle, Info, FileText, AlertTriangle } from 'lucide-react'

/**
 * HelpSection Type
 * Defines the type of help section for styling
 */
export type HelpSectionType = 'definition' | 'guidance' | 'documents' | 'information'

/**
 * HelpSection Interface
 * Represents a section of help content with type, title, and content
 */
export interface HelpSection {
  id: string
  type: HelpSectionType
  title: string
  content: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * HelpDrawerProps Interface
 */
export interface HelpDrawerProps {
  /**
   * Form title to display in drawer header
   */
  formTitle: string

  /**
   * Array of help sections to display
   */
  sections: HelpSection[]

  /**
   * Whether the drawer is open (controlled)
   */
  isOpen: boolean

  /**
   * Callback when drawer should open/close
   */
  onOpenChange: (open: boolean) => void

  /**
   * Optional custom trigger button
   * If not provided, uses default "Help & Requirements" button
   */
  triggerButton?: React.ReactNode

  /**
   * Optional DFSA rule reference to display in drawer header
   */
  ruleReference?: string
}

/**
 * Section styling configuration by type
 * Maps section types to their visual styling (colors, icons)
 */
const sectionConfig: Record<
  HelpSectionType,
  {
    containerClass: string
    iconClass: string
    titleClass: string
    contentClass: string
    Icon: React.ComponentType<{ className?: string }>
  }
> = {
  definition: {
    containerClass: 'bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg',
    iconClass: 'h-5 w-5 text-amber-600 flex-shrink-0',
    titleClass: 'text-sm font-medium text-amber-800',
    contentClass: 'mt-2 text-sm text-amber-800',
    Icon: AlertTriangle,
  },
  guidance: {
    containerClass: 'bg-gray-50 border border-gray-200 rounded-lg p-4',
    iconClass: 'h-5 w-5 text-gray-600 flex-shrink-0',
    titleClass: 'text-sm font-semibold text-gray-900',
    contentClass: 'mt-2 text-sm text-gray-600',
    Icon: Info,
  },
  documents: {
    containerClass: 'bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg',
    iconClass: 'h-5 w-5 text-blue-600 flex-shrink-0',
    titleClass: 'text-sm font-medium text-blue-800',
    contentClass: 'mt-2 text-sm text-blue-800',
    Icon: FileText,
  },
  information: {
    containerClass: 'bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg',
    iconClass: 'h-5 w-5 text-blue-600 flex-shrink-0',
    titleClass: 'text-sm font-medium text-blue-800',
    contentClass: 'mt-2 text-sm text-blue-800',
    Icon: Info,
  },
}

/**
 * HelpDrawer Component
 * Displays help content in a side drawer with color-coded sections
 */
export const HelpDrawer: React.FC<HelpDrawerProps> = ({
  formTitle,
  sections,
  isOpen,
  onOpenChange,
  triggerButton,
  ruleReference,
}) => {
  /**
   * Default trigger button
   */
  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onOpenChange(true)}
      className="gap-2"
      aria-label={`Open help and requirements for ${formTitle}`}
    >
      <HelpCircle className="h-4 w-4" />
      Help & Requirements
    </Button>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton || defaultTrigger}

      <SheetContent
        className="w-full sm:max-w-md md:max-w-lg overflow-y-auto"
        aria-describedby="help-drawer-description"
      >
        <SheetHeader>
          <SheetTitle>{formTitle} Guide</SheetTitle>
          {ruleReference && (
            <SheetDescription id="help-drawer-description" className="text-xs text-muted-foreground">
              (Ref: {ruleReference})
            </SheetDescription>
          )}
          {!ruleReference && (
            <SheetDescription id="help-drawer-description" className="sr-only">
              Help and requirements for {formTitle}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {sections.map((section, index) => {
            const config = sectionConfig[section.type]
            const IconComponent = section.icon || config.Icon

            return (
              <React.Fragment key={section.id}>
                {index > 0 && <Separator className="my-4" />}

                <div className={config.containerClass}>
                  <div className="flex gap-3">
                    <IconComponent className={config.iconClass} />
                    <div className="flex-1">
                      <h4 className={config.titleClass}>{section.title}</h4>
                      <div className={config.contentClass}>{section.content}</div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
