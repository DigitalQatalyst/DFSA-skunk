import { FormSchema } from "../FormPreview";

export const TrainingInEntrepreneurshipSchema: FormSchema = {
    formId: "training-in-entrepreneurship",
    formTitle: "Training in Entrepreneurship",
    formDescription: "Please complete the form below to proceed with your application.",
    multiStep: true,
    allowSaveAndContinue: true,
    autoSaveInterval: 20000, // Auto-save every 20 seconds
    submitEndpoint: "https://kfrealexpressserver.vercel.app/api/v1/training/entrepreneurshiptraining",

    steps: [
        {
            stepTitle: "Company & Requestor Information",
            stepDescription: "Please provide your company and personal details.",
            groups: [
                {
                    groupTitle: "Company Information",
                    fields: [
                        {
                            id: "companyName",
                            label: "Company name",
                            type: "text",
                            required: true,
                            validation: {
                                pattern: "^[\\w\\s.,'!?-]+$",
                                minLength: 2,
                                maxLength: 255,
                                message: "Company name contains invalid characters",
                            },
                        },
                        {
                            id: "companyNumber",
                            label: "Company number",
                            type: "text",
                            required: true,
                            validation: {
                                pattern: "^[A-Za-z0-9]+$",
                                minLength: 1,
                                maxLength: 50,
                                message: "Company number must be alphanumeric",
                            },
                        },
                    ],
                },
                {
                    groupTitle: "Requestor Information",
                    fields: [
                        {
                            id: "requestorName",
                            label: "Name of person making the submission",
                            type: "text",
                            required: true,
                            validation: {
                                pattern: "^[a-zA-ZÀ-ÿ' -]+$",
                                minLength: 1,
                                maxLength: 255,
                                message: "Name can only contain letters, spaces, hyphens, and apostrophes",
                            },
                        },
                        {
                            id: "requestorPosition",
                            label: "Position",
                            type: "text",
                            required: true,
                            validation: {
                                pattern: "^[\\w\\s.,'!?-]+$",
                                minLength: 1,
                                maxLength: 255,
                                message: "Position contains invalid characters",
                            },
                        },
                        {
                            id: "requestorEmail",
                            label: "Email Address",
                            type: "email",
                            required: true,
                            validation: {
                                pattern: "^[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,}$",
                                minLength: 5,
                                maxLength: 254,
                                message: "Please enter a valid email address",
                            },
                        },
                        {
                            id: "requestorPhone",
                            label: "Contact telephone number",
                            type: "tel",
                            required: true,
                            validation: {
                                pattern: "^\\+?[0-9\\s\\-\\(\\)]+$",
                                minLength: 7,
                                maxLength: 15,
                                message: "Please enter a valid phone number",
                            },
                        },
                    ],
                },
            ],
        },
        {
            stepTitle: "Add Course",
            stepDescription: "Please use the options below to find the training course that fits your needs and availability.",
            groups: [
                {
                    groupTitle: "Course Selection",
                    groupDescription: "Select and configure your training courses",
                    fields: [
                        {
                            id: "courseTable",
                            label: "Training Courses",
                            type: "course-table", // Custom type for the course table
                            required: false,
                            helperText: "Use the table below to add and configure your training courses",
                        },
                    ],
                },
            ],
        },
        {
            stepTitle: "Review & Summary",
            stepDescription: "Please review all the information you've entered before submitting your application.",
            groups: [
                {
                    groupTitle: "Review Your Information",
                    groupDescription: "Review all entered details to ensure accuracy before proceeding to consent.",
                    fields: [],
                },
            ],
        },
        {
            stepTitle: "Data Sharing Consent",
            stepDescription: "Provide your consent for data sharing.",
            groups: [
                {
                    groupTitle: "Data Sharing Consent",
                    groupDescription: "Kindly Accept Data Sharing",
                    fields: [
                        {
                            id: "dataSharingConsent",
                            label: "I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.",
                            type: "consent",
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
};