import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { upsertFormSchema } from '../services/formSchemaService';

interface DFSAService {
  id: number;
  serviceName: string;
  serviceStage: string;
  serviceSegment: string;
  subSegment: string;
  longDescription: string;
  shortDescription: string;
  prerequisites: string;
  process: string;
  requiredDocuments: string;
  serviceFees: string;
  serviceTime: string;
  feesAmount: string;
  paymentOptions: string;
}

function parseRequiredDocuments(documentsText: string): string[] {
  if (!documentsText) return [];
  
  // Split by >> and clean up
  const docs = documentsText
    .split('>>')
    .map(doc => doc.trim())
    .filter(doc => doc && !doc.startsWith('The following') && !doc.startsWith('>'));
  
  return docs;
}

function generateServiceId(serviceName: string): string {
  // Check for known service mappings first
  const knownMappings: Record<string, string> = {
    'Request for New Registation (Registered Auditors)': 'registered-auditors',
    'Request for New Registration (Collective Investment Funds)': 'collective-investment-funds',
    'Request for New Authorisation (Authorised Individual)': 'authorised-individual',
    'Request for New Authorisation (Principal Representative)': 'principal-representative',
    'Request for New Authorisation (Representative Office)': 'representative-office',
    'Request for New Authorisation (Financial Services)': 'financial-services-authorisation',
    'Request for Innovation Testing Licence': 'innovation-testing-licence',
    'Request for New Authorisation (Credit Rating Agency)': 'credit-rating-agency-authorisation',
  };
  
  // Check if we have a known mapping
  if (knownMappings[serviceName]) {
    return knownMappings[serviceName];
  }
  
  // Otherwise generate from name
  return serviceName
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

function createFormSchema(service: DFSAService) {
  const documents = parseRequiredDocuments(service.requiredDocuments);
  
  const properties: any = {
    applicantType: {
      type: 'string',
      title: 'Applicant Type',
      enum: ['Individual', 'Company'],
      default: 'Company'
    },
    companyName: {
      type: 'string',
      title: 'Company Name'
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
    licenseNumber: {
      type: 'string',
      title: 'License Number (if applicable)'
    }
  };

  // Add document upload fields
  if (documents.length > 0) {
    properties.documents = {
      type: 'object',
      title: 'Required Documents',
      properties: {}
    };

    documents.forEach((doc, index) => {
      const fieldName = `document_${index + 1}`;
      properties.documents.properties[fieldName] = {
        type: 'string',
        title: doc
      };
    });
  }

  properties.additionalInfo = {
    type: 'string',
    title: 'Additional Information'
  };

  properties.agreeToTerms = {
    type: 'boolean',
    title: 'I agree to the terms and conditions and confirm that all information provided is accurate',
    default: false
  };

  const schema = {
    title: service.serviceName,
    description: service.shortDescription,
    type: 'object',
    required: ['companyName', 'contactPerson', 'email', 'phone', 'agreeToTerms'],
    properties
  };

  const uiSchema: any = {
    additionalInfo: {
      'ui:widget': 'textarea',
      'ui:options': { rows: 5 }
    },
    agreeToTerms: {
      'ui:widget': 'checkbox'
    }
  };

  // Add UI schema for document uploads
  if (documents.length > 0) {
    uiSchema.documents = {
      'ui:description': 'Please upload the following required documents:'
    };
    documents.forEach((_, index) => {
      const fieldName = `document_${index + 1}`;
      uiSchema.documents[fieldName] = {
        'ui:widget': 'FileWidget'
      };
    });
  }

  return {
    service_id: generateServiceId(service.serviceName),
    service_name: service.serviceName,
    json_schema: schema,
    ui_schema: uiSchema,
    metadata: {
      service_stage: service.serviceStage,
      service_segment: service.serviceSegment,
      sub_segment: service.subSegment,
      fees: service.feesAmount,
      processing_time: service.serviceTime,
      required_documents: documents
    }
  };
}

async function parseDFSARequirements() {
  const csvPath = path.join(process.cwd(), '2310_DFSA_Requirements Tracker_v1.02(DFSA.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: false,
    skip_empty_lines: true,
    from_line: 30 // Start from the header row
  });

  const services: DFSAService[] = [];
  
  // Parse each service row
  for (let i = 1; i < records.length; i++) {
    const row = records[i];
    
    if (!row[1] || row[1].trim() === '') continue; // Skip empty service names
    
    const service: DFSAService = {
      id: parseInt(row[0]) || i,
      serviceName: row[1]?.trim() || '',
      serviceStage: row[2]?.trim() || '',
      serviceSegment: row[3]?.trim() || '',
      subSegment: row[4]?.trim() || '',
      longDescription: row[5]?.trim() || '',
      shortDescription: row[6]?.trim() || '',
      prerequisites: row[7]?.trim() || '',
      process: row[8]?.trim() || '',
      requiredDocuments: row[9]?.trim() || '',
      serviceFees: row[10]?.trim() || '',
      serviceTime: row[11]?.trim() || '',
      feesAmount: row[12]?.trim() || '',
      paymentOptions: row[13]?.trim() || ''
    };
    
    if (service.serviceName) {
      services.push(service);
    }
  }

  console.log(`Found ${services.length} services`);
  
  return services;
}

export async function seedDFSASchemas() {
  console.log('Parsing DFSA Requirements CSV...');
  
  const services = await parseDFSARequirements();
  
  console.log(`\nGenerating and seeding schemas for ${services.length} services...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const service of services) {
    try {
      const formSchema = createFormSchema(service);
      console.log(`Seeding: ${service.serviceName}`);
      
      const result = await upsertFormSchema(formSchema);
      
      if (result) {
        console.log(`✓ Success: ${service.serviceName}`);
        successCount++;
      } else {
        console.log(`✗ Failed: ${service.serviceName}`);
        failCount++;
      }
    } catch (error) {
      console.error(`✗ Error seeding ${service.serviceName}:`, error);
      failCount++;
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total: ${services.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}
