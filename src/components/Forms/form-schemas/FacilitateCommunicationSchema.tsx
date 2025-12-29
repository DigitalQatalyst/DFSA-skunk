import { FormSchema } from '../FormPreview'

export const facilitateCommunicationSchema: FormSchema = {
    formId: 'facilitate-communication',
    formTitle: 'Facilitate Communication With Strategic Stakeholders',
    formDescription: 'Please complete the form below to proceed with your application.',
    multiStep: true,
    allowSaveAndContinue: true,
    autoSaveInterval: 15000,
    submitEndpoint: 'https://kfrealexpressserver.vercel.app/api/v1/contact/facilitate-communication',
    steps: [
        {
            stepTitle: 'Company Information',
            stepDescription: 'Provide your company and contact information.',
            groups: [
                {
                    groupTitle: 'COMPANY INFORMATION',
                    fields: [
                        {
                            id: 'companyName',
                            label: 'Company name',
                            type: 'text',
                            placeholder: 'Enter your company name',
                            required: true,
                            validation: {
                                pattern: '^[\\w\\s.,\'!?-]+$',
                                minLength: 2,
                                maxLength: 255,
                                message: 'Company name contains invalid characters',
                            },
                        },
                        {
                            id: 'companyNumber',
                            label: 'Company number',
                            type: 'text',
                            placeholder: 'Enter your company number',
                            required: true,
                            validation: {
                                pattern: '^[A-Za-z0-9]+$',
                                minLength: 1,
                                maxLength: 50,
                                message: 'Company number must be alphanumeric',
                            },
                        },
                    ],
                },
                {
                    groupTitle: 'REQUESTER INFORMATION',
                    fields: [
                        {
                            id: 'name',
                            label: 'Name of person making the submission',
                            type: 'text',
                            placeholder: 'Enter your full name',
                            required: true,
                            validation: {
                                pattern: '^[a-zA-ZÀ-ÿ\' -]+$',
                                minLength: 1,
                                maxLength: 255,
                                message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
                            },
                        },
                        {
                            id: 'submittedBy',
                            label: 'Submitted By',
                            type: 'text',
                            placeholder: 'Enter the name of the person submitting',
                            required: true,
                            validation: {
                                pattern: '^[a-zA-ZÀ-ÿ\' -]+$',
                                minLength: 1,
                                maxLength: 255,
                                message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
                            },
                        },
                        {
                            id: 'position',
                            label: 'Position',
                            type: 'text',
                            placeholder: 'Enter your position',
                            validation: {
                                pattern: '^[\\w\\s.,\'!?-]+$',
                                minLength: 1,
                                maxLength: 255,
                                message: 'Position contains invalid characters',
                            },
                        },
                        {
                            id: 'emailAddress',
                            label: 'Email Address',
                            type: 'email',
                            placeholder: 'Enter your email address',
                            required: true,
                            validation: {
                                pattern: '^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$',
                                minLength: 5,
                                maxLength: 254,
                                message: 'Please enter a valid email address',
                            },
                        },
                        {
                            id: 'telephoneNumber',
                            label: 'Contact telephone number',
                            type: 'tel',
                            placeholder: 'Enter your contact number',
                            required: true,
                            validation: {
                                pattern: '^\\+?[0-9\\s\\-\\(\\)]+$',
                                minLength: 7,
                                maxLength: 15,
                                message: 'Please enter a valid phone number',
                            },
                        },
                    ],
                },
            ],
        },
        {
            stepTitle: 'Support Details',
            stepDescription: 'Provide details about the support you require.',
            groups: [
                {
                    groupTitle: 'ADD SUPPORT DETAILS',
                    fields: [
                        {
                            id: 'supportType',
                            label: 'Support Type',
                            type: 'select',
                            placeholder: 'Select',
                            required: true,
                            options: [
                                { value: 'tender', label: 'Tender' },
                                { value: 'engage-with-stakeholder', label: 'Engage with stakeholder' },
                                { value: 'waiver', label: 'Waiver' },
                                { value: 'marketing-support', label: 'Marketing Support' },
                                { value: 'sales-support', label: 'Sales Support' },
                                { value: 'participate-in-event', label: 'Participate in Event' },
                                { value: 'overcome-obstacle', label: 'Overcome Obstacle' },
                                { value: 'regulation-related', label: 'Regulation Related' },
                                { value: 'local-sme-priority', label: 'Local SME Priority' },
                                { value: 'other', label: 'Other' },
                            ],
                        },
                        {
                            id: 'entityType',
                            label: 'Entity Type',
                            type: 'select',
                            placeholder: 'Select',
                            required: true,
                            options: [
                                { value: 'federal-authority-nuclear', label: 'Federal Authority for Nuclear Regulation' },
                                { value: 'ministry-climate-environment', label: 'Ministry of Climate Change and Environment' },
                                { value: 'union-coop', label: 'Union Co-op' },
                                { value: 'economic-dev-khorfakkan', label: 'Economic Development Department-Khorfakkan' },
                                { value: 'sharjah-chamber-khorfakkan', label: 'Sharjah Chamber of commerce & Industry- Khorfakkan' },
                                { value: 'executive-council', label: 'General Secretarian of the Executive Council' },
                                { value: 'environment-rak', label: 'Environment Protection & Development of Ras Al Khaimah' },
                            ],
                        },
                        {
                            id: 'supportSubject',
                            label: 'Support Subject',
                            type: 'textarea',
                            placeholder: 'Describe the subject of support needed',
                            required: true,
                            validation: {
                                pattern: '^[\\w\\s.,\'!?-]+$',
                                minLength: 10,
                                maxLength: 500,
                                message: 'Support subject contains invalid characters',
                            },
                        },
                        {
                            id: 'financialImpact',
                            label: 'Financial Impact',
                            type: 'textarea',
                            placeholder: 'Describe the expected financial impact',
                            validation: {
                                pattern: '^[\\w\\s.,\'!?-]+$',
                                minLength: 1,
                                maxLength: 500,
                                message: 'Financial impact description contains invalid characters',
                            },
                        },
                        {
                            id: 'supportDescription',
                            label: 'Support Description',
                            type: 'textarea',
                            placeholder: 'Provide detailed description of the support required',
                            required: true,
                            validation: {
                                pattern: '^[\\w\\s.,\'!?-]+$',
                                minLength: 50,
                                maxLength: 2000,
                                message: 'Support description contains invalid characters',
                            },
                        },
                    ],
                },
            ],
        },
        {
            stepTitle: 'Review & Summary',
            stepDescription: 'Please review all the information you\'ve entered before submitting your request.',
            groups: [
                {
                    groupTitle: 'Review Your Information',
                    groupDescription: 'Review all entered details to ensure accuracy before proceeding to consent.',
                    fields: [],
                },
            ],
        },
        {
            stepTitle: 'Data Sharing Consent',
            stepDescription: 'Provide your consent for data sharing.',
            groups: [
                {
                    groupTitle: 'DATA SHARING CONSENT',
                    groupDescription: 'Kindly Accept Data Sharing',
                    fields: [
                        {
                            id: 'dataSharingConsent',
                            label: 'I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.',
                            type: 'consent',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
}