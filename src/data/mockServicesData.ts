export const mockServicesData = [
    {
        id: "mock-1",
        name: "Request for New Authorisation Services",
        slug: "new-authorisation-services",
        description: "Request authorisation to carry Financial Services in or from the DIFC",
        customFields: {
            serviceType: "New Application",
            serviceCategory: "Licensing",
            entityType: "Authorised Firms",
            processingTime: "15 Days",
            tags: ["Licensing", "New Application", "Financial Services"]
        },
        details: {
            longDescription: "Obtaining authorisation is a pivotal step for any financial firm wishing to operate within the DIFC. This service guides you through the comprehensive application process to ensure your firm meets all regulatory standards required for financial services. Whether you are a bank, asset manager, or insurer, this pathway is your gateway to the region's leading financial hub.",
            benefits: [
                "Access to a world-class financial ecosystem connecting East and West",
                "Regulatory certainty and transparency with a common law framework",
                "100% foreign ownership and zero tax on income and profits",
                "State-of-the-art infrastructure and connectivity"
            ],
            requirements: [
                "Detailed Regulatory Business Plan outlining your proposed activities",
                "Financial projections for the next 3 years",
                "Evidence of capital adequacy and source of funds",
                "Fit and Proper returns for all key individuals and controllers"
            ],
            processSteps: [
                { title: "Submission", description: "Submit your comprehensive application via the DFSA portal." },
                { title: "Initial Review", description: "A case officer is assigned to review your application for completeness." },
                { title: "Assessment", description: "Detailed assessment of your business model, risks, and resources." },
                { title: "Interviews", description: "Key individuals (SEO, FO, CO) may be interviewed by the DFSA." },
                { title: "Authorisation", description: "Upon successful review, an In-Principle Approval is issued, followed by the final license." }
            ]
        }
    },
    {
        id: "mock-2",
        name: "Request for New Authorisation: AMI",
        slug: "new-authorisation-ami",
        description: "Apply for Authorised Market Institution status in the DIFC",
        customFields: {
            serviceType: "New Application",
            serviceCategory: "Licensing",
            entityType: "Authorised Market Institutions",
            processingTime: "30 Days",
            tags: ["Licensing", "AMI", "Market Institution"]
        },
        details: {
            longDescription: "Establish a trading platform or clearing house in the DIFC by applying for Authorised Market Institution (AMI) status. This license is designed for exchanges, multilateral trading facilities, and clearing houses that wish to offer market infrastructure services in a regulated environment.",
            benefits: [
                "Operate in a globally recognised regulatory environment",
                "Attract international liquidity and participants",
                "Flexible regulatory framework supporting innovation",
                "Strategic time zone location bridging global markets"
            ],
            requirements: [
                "Comprehensive market rules and trading procedures",
                "Robust technology and cyber resilience framework",
                "Adequate financial resources and clearing arrangements",
                "Governance structure with independent oversight"
            ],
            processSteps: [
                { title: "Pre-Application", description: "Engage with DFSA Markets team to discuss your proposed business model." },
                { title: "Formal Application", description: "Submit detailed application including rulebooks and tech specs." },
                { title: "Technology Audit", description: "Third-party audit of your trading and settlement systems." },
                { title: "Regulatory Review", description: "In-depth review of market rules, surveillance, and risk management." },
                { title: "Go-Live", description: "Final approval and commencement of market operations." }
            ]
        }
    },
    {
        id: "mock-3",
        name: "Amendment of Supervision Schedule",
        slug: "amendment-supervision-schedule",
        description: "Request amendments to your current supervision schedule",
        customFields: {
            serviceType: "Amendment",
            serviceCategory: "Compliance",
            entityType: "Authorised Firms",
            processingTime: "7 Days",
            tags: ["Amendment", "Supervision", "Compliance"]
        },
        details: {
            longDescription: "As your business evolves, your supervision requirements may change. This service allows Authorised Firms to request amendments to their supervision schedule, such as changing reporting dates, modifying the scope of permissions, or updating key control functions.",
            benefits: [
                "Ensure continued compliance with evolving business needs",
                "Avoid regulatory breaches due to outdated schedules",
                "Streamlined process for minor amendments",
                "Direct communication with your relationship manager"
            ],
            requirements: [
                "Justification for the requested amendment",
                "Impact assessment on current compliance framework",
                "Updated internal policies or procedures if applicable",
                "Board resolution approving the change"
            ],
            processSteps: [
                { title: "Request Initiation", description: "Log in to the portal and select the specific amendment type." },
                { title: "Documentation", description: "Upload supporting documents and justification." },
                { title: "Review", description: "DFSA supervision team reviews the request." },
                { title: "Approval", description: "Receive confirmation of the amended supervision schedule." }
            ]
        }
    },
    {
        id: "mock-4",
        name: "Investment Fund Registration",
        slug: "investment-fund-registration",
        description: "Register your investment fund with DFSA",
        customFields: {
            serviceType: "New Application",
            serviceCategory: "Licensing",
            entityType: "Investment Funds",
            processingTime: "45 Days",
            tags: ["Investment", "Fund", "Registration"]
        },
        details: {
            longDescription: "Launch your investment fund in the DIFC. Whether it's a Public Fund, Exempt Fund, or Qualified Investor Fund, this service handles the registration and notification process, allowing you to market and manage collective investment schemes.",
            benefits: [
                "Access to a wide network of regional and international investors",
                "Flexible fund structures (GP-LP, PCC, ICC)",
                "Speed to market for Qualified Investor Funds",
                "Passporting opportunities within the region"
            ],
            requirements: [
                "Fund Constitution and Prospectus",
                "Appointment of Fund Manager and Administrator",
                "Custodian arrangements (if applicable)",
                "KYC/AML procedures for investor onboarding"
            ],
            processSteps: [
                { title: "Structure Selection", description: "Choose the appropriate fund structure and regime." },
                { title: "Submission", description: "Submit the fund registration form and offering documents." },
                { title: "Review", description: "DFSA reviews the fund's compliance with collective investment rules." },
                { title: "Registration", description: "Fund is entered into the public register and can commence subscriptions." }
            ]
        }
    },
    {
        id: "mock-5",
        name: "Licence Renewal Application",
        slug: "licence-renewal",
        description: "Renew your existing DFSA licence",
        customFields: {
            serviceType: "Renewal",
            serviceCategory: "Licensing",
            entityType: "Authorised Firms",
            processingTime: "20 Days",
            tags: ["Renewal", "Licence", "Annual"]
        },
        details: {
            longDescription: "Maintain your authorisation to operate in the DIFC by renewing your licence annually. This process ensures that your firm continues to meet the necessary regulatory requirements and has paid the annual supervision fees.",
            benefits: [
                "Uninterrupted business operations",
                "Continued access to DIFC benefits",
                "Compliance with annual regulatory obligations",
                "Opportunity to update firm details"
            ],
            requirements: [
                "Confirmation of no material changes to business activities",
                "Payment of annual licensing fees",
                "Submission of latest audited financial statements",
                "Updated professional indemnity insurance certificate"
            ],
            processSteps: [
                { title: "Notification", description: "Receive renewal notice 60 days prior to expiry." },
                { title: "Verification", description: "Verify current firm details and declarations." },
                { title: "Payment", description: "Pay the annual renewal fee via the portal." },
                { title: "Issuance", description: "Receive your renewed licence certificate." }
            ]
        }
    },
    {
        id: "mock-6",
        name: "Crypto Asset Service Enquiry",
        slug: "crypto-asset-enquiry",
        description: "Enquire about crypto asset service requirements",
        customFields: {
            serviceType: "Enquiries",
            serviceCategory: "Market",
            entityType: "Securities & Crypto",
            processingTime: "5 Days",
            tags: ["Crypto", "Digital Assets", "Enquiry"]
        },
        details: {
            longDescription: "Explore the possibilities of offering crypto asset services in the DIFC. This enquiry service allows you to engage with the DFSA Innovation Team to understand the regulatory framework for digital assets, tokens, and crypto exchanges before submitting a formal application.",
            benefits: [
                "Clarification on regulatory perimeter for your business model",
                "Guidance on the Crypto Asset Regime",
                "Early feedback on potential risks and requirements",
                "Direct engagement with subject matter experts"
            ],
            requirements: [
                "High-level business plan or whitepaper",
                "Description of the crypto assets or tokens involved",
                "Target market and jurisdiction analysis",
                "Overview of technology stack and custody arrangements"
            ],
            processSteps: [
                { title: "Enquiry Submission", description: "Submit a detailed enquiry form with your concept." },
                { title: "Initial Assessment", description: "DFSA Innovation Team reviews your proposal." },
                { title: "Meeting", description: "Invitation to a meeting or call to discuss specifics." },
                { title: "Guidance", description: "Receive informal guidance on the next steps for authorisation." }
            ]
        }
    },
    {
        id: "mock-7",
        name: "Fintech Innovation Hub Application",
        slug: "fintech-innovation-hub",
        description: "Apply to join the DFSA Fintech Innovation Hub",
        customFields: {
            serviceType: "New Application",
            serviceCategory: "Market",
            entityType: "Fintech & Innovation",
            processingTime: "25 Days",
            tags: ["Fintech", "Innovation", "Hub"]
        },
        details: {
            longDescription: "Join the DFSA's Innovation Testing Licence (ITL) programme. This sandbox environment allows fintech firms to test innovative products and services with real clients in a controlled regulatory environment, fostering growth and innovation.",
            benefits: [
                "Test your innovation with real customers",
                "Reduced regulatory burden during testing phase",
                "Mentorship and guidance from the DFSA",
                "Path to full authorisation upon successful testing"
            ],
            requirements: [
                "Innovative use of technology in financial services",
                "Benefit to consumers or the market",
                "Readiness to test (MVP stage)",
                "Intention to roll out in the DIFC"
            ],
            processSteps: [
                { title: "Application", description: "Apply for the ITL cohort via the innovation portal." },
                { title: "Pitch", description: "Present your solution to the Innovation Team." },
                { title: "Testing Plan", description: "Develop a testing plan with safeguards and metrics." },
                { title: "Testing Phase", description: "Operate under the ITL for 6-12 months." },
                { title: "Graduation", description: "Apply for full licensure or exit the sandbox." }
            ]
        }
    },
    {
        id: "mock-8",
        name: "DNFBP Registration",
        slug: "dnfbp-registration",
        description: "Register as a Designated Non-Financial Business or Profession",
        customFields: {
            serviceType: "New Application",
            serviceCategory: "Licensing",
            entityType: "DNFBPs",
            processingTime: "35 Days",
            tags: ["DNFBP", "Registration", "Non-Financial"]
        },
        details: {
            longDescription: "Designated Non-Financial Businesses and Professions (DNFBPs) such as law firms, accounting firms, and real estate agents must register with the DFSA for AML/CFT supervision. This service facilitates your registration and compliance setup.",
            benefits: [
                "Compliance with UAE Federal AML laws",
                "Credibility associated with DFSA supervision",
                "Access to AML/CFT training and resources",
                "Ability to operate within the DIFC free zone"
            ],
            requirements: [
                "Appointment of a Money Laundering Reporting Officer (MLRO)",
                "AML/CFT policies and procedures manual",
                "Risk assessment of business activities",
                "Details of beneficial owners and senior management"
            ],
            processSteps: [
                { title: "Registration", description: "Complete the DNFBP registration form." },
                { title: "MLRO Interview", description: "Proposed MLRO may be interviewed for competency." },
                { title: "Policy Review", description: "Review of your AML policies against DFSA rules." },
                { title: "Confirmation", description: "Receive confirmation of registration and supervision details." }
            ]
        }
    },
    {
        id: "mock-9",
        name: "Professional Advisor Certification",
        slug: "professional-advisor-cert",
        description: "Get certified as a professional advisor in the DIFC",
        customFields: {
            serviceType: "New Application",
            serviceCategory: "Licensing",
            entityType: "Professional Advisors",
            processingTime: "12 Days",
            tags: ["Professional", "Advisor", "Certification"]
        },
        details: {
            longDescription: "Enhance your professional standing by becoming a certified advisor in the DIFC. This certification is for individuals providing advice on financial products, legal matters, or consultancy services, ensuring high standards of practice.",
            benefits: [
                "Recognition as a qualified professional in the DIFC",
                "Listing in the public register of advisors",
                "Access to continuous professional development (CPD)",
                "Networking opportunities within the financial community"
            ],
            requirements: [
                "Relevant academic and professional qualifications",
                "Minimum years of experience in the field",
                "Good standing certificate from previous regulator/body",
                "Completion of DIFC laws and regulations module"
            ],
            processSteps: [
                { title: "Application", description: "Submit personal details and qualification proofs." },
                { title: "Verification", description: "Background checks and verification of credentials." },
                { title: "Exam", description: "Pass the mandatory DIFC regulations exam (if applicable)." },
                { title: "Certification", description: "Receive your Professional Advisor Certificate." }
            ]
        }
    }
];
