import { upsertFormSchema } from '../services/formSchemaService';

// Example schemas for different services
const formSchemas = [
  {
    service_id: 'dnfbp-registration',
    service_name: 'DNFBP Registration',
    json_schema: {
      title: 'DNFBP Registration Application',
      type: 'object',
      required: ['companyName', 'licenseType', 'contactPerson', 'email', 'phone'],
      properties: {
        companyName: {
          type: 'string',
          title: 'Company Name'
        },
        licenseType: {
          type: 'string',
          title: 'License Type',
          enum: ['Law Firm', 'Accounting Firm', 'Real Estate Agent', 'Other']
        },
        contactPerson: {
          type: 'string',
          title: 'Contact Person Name'
        },
        email: {
          type: 'string',
          title: 'Email Address',
          format: 'email'
        },
        phone: {
          type: 'string',
          title: 'Phone Number'
        },
        businessAddress: {
          type: 'string',
          title: 'Business Address'
        },
        yearsInOperation: {
          type: 'number',
          title: 'Years in Operation',
          minimum: 0
        },
        additionalInfo: {
          type: 'string',
          title: 'Additional Information'
        }
      }
    },
    ui_schema: {
      businessAddress: {
        'ui:widget': 'textarea',
        'ui:options': { rows: 3 }
      },
      additionalInfo: {
        'ui:widget': 'textarea',
        'ui:options': { rows: 5 }
      }
    }
  },
  {
    service_id: 'business-setup-consultancy',
    service_name: 'Business Setup Consultancy',
    json_schema: {
      title: 'Business Setup Consultancy Request',
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'businessType', 'stage'],
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name'
        },
        lastName: {
          type: 'string',
          title: 'Last Name'
        },
        email: {
          type: 'string',
          title: 'Email Address',
          format: 'email'
        },
        phone: {
          type: 'string',
          title: 'Phone Number'
        },
        businessType: {
          type: 'string',
          title: 'Type of Business',
          enum: ['Sole Proprietorship', 'LLC', 'Partnership', 'Free Zone', 'Other']
        },
        stage: {
          type: 'string',
          title: 'Business Stage',
          enum: ['Idea Stage', 'Planning', 'Ready to Launch', 'Already Operating']
        },
        preferredLocation: {
          type: 'string',
          title: 'Preferred Business Location'
        },
        description: {
          type: 'string',
          title: 'Brief Description of Your Business Idea'
        },
        consultationPreference: {
          type: 'string',
          title: 'Consultation Preference',
          enum: ['Online', 'In-Person', 'Hybrid']
        }
      }
    },
    ui_schema: {
      description: {
        'ui:widget': 'textarea',
        'ui:options': { rows: 5 }
      }
    }
  },
  {
    service_id: 'general',
    service_name: 'General Service Request',
    json_schema: {
      title: 'General Service Request',
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'companyName'],
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name'
        },
        lastName: {
          type: 'string',
          title: 'Last Name'
        },
        email: {
          type: 'string',
          title: 'Email Address',
          format: 'email'
        },
        phone: {
          type: 'string',
          title: 'Phone Number'
        },
        companyName: {
          type: 'string',
          title: 'Company Name'
        },
        licenseNumber: {
          type: 'string',
          title: 'License Number (if applicable)'
        },
        message: {
          type: 'string',
          title: 'Additional Information'
        },
        agreeToTerms: {
          type: 'boolean',
          title: 'I agree to the terms and conditions',
          default: false
        }
      }
    },
    ui_schema: {
      message: {
        'ui:widget': 'textarea',
        'ui:options': { rows: 5 }
      },
      agreeToTerms: {
        'ui:widget': 'checkbox'
      }
    }
  }
];

export async function seedFormSchemas() {
  console.log('Starting to seed form schemas...');
  
  for (const schema of formSchemas) {
    console.log(`Seeding schema for: ${schema.service_name}`);
    const result = await upsertFormSchema(schema);
    
    if (result) {
      console.log(`✓ Successfully seeded: ${schema.service_name}`);
    } else {
      console.error(`✗ Failed to seed: ${schema.service_name}`);
    }
  }
  
  console.log('Seeding complete!');
}
