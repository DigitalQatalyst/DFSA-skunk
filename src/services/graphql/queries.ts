// GraphQL queries used in the application
// Generic query structure for all marketplace types
export const MARKETPLACE_QUERIES = {
  // Courses marketplace queries
  courses: {
    getItems: `
      query getCourseItems($category: String, $deliveryMode: String, $businessStage: String, $provider: String, $search: String) {
        items: courses(category: $category, deliveryMode: $deliveryMode, businessStage: $businessStage, provider: $provider, search: $search) {
          id
          title
          description
          category
          deliveryMode
          duration
          durationType
          businessStage
          provider {
            name
            logoUrl
            description
          }
          learningOutcomes
          startDate
          price
          location
          tags
        }
      }
    `,
    getItemDetails: `
      query getCourseDetails($id: String!) {
        item: course(id: $id) {
          id
          title
          description
          category
          deliveryMode
          duration
          durationType
          businessStage
          provider {
            name
            logoUrl
            description
          }
          learningOutcomes
          startDate
          price
          location
          tags
          highlights
          schedule
          prerequisites
          curriculum
        }
      }
    `,
    getRelatedItems: `
      query getRelatedCourses($id: String!, $category: String, $provider: String) {
        relatedItems: relatedCourses(id: $id, category: $category, provider: $provider) {
          id
          title
          description
          category
          deliveryMode
          duration
          durationType
          businessStage
          provider {
            name
            logoUrl
            description
          }
          learningOutcomes
          startDate
          price
          location
          tags
        }
      }
    `,
    getFilterOptions: `
      query getCourseFilterOptions {
        filterOptions {
          categories {
            id
            name
          }
          deliveryModes {
            id
            name
          }
          businessStages {
            id
            name
          }
        }
      }
    `,
    getProviders: `
      query getCourseProviders {
        providers {
          id
          name
          logoUrl
          description
        }
      }
    `
  },
  // Financial services marketplace queries
  financial: {
    getItems: `
      query getFinancialItems($category: String, $serviceType: String, $provider: String, $search: String) {
        items: financialServices(category: $category, serviceType: $serviceType, provider: $provider, search: $search) {
          id
          title
          description
          category
          serviceType
          provider {
            name
            logoUrl
            description
          }
          amount
          duration
          eligibility
          interestRate
          tags
          details
        }
      }
    `,
    getItemDetails: `
      query getFinancialItemDetails($id: String!) {
        item: financialService(id: $id) {
          id
          title
          description
          category
          serviceType
          provider {
            name
            logoUrl
            description
          }
          amount
          duration
          eligibility
          interestRate
          tags
          details
          highlights
          requiredDocuments
          applicationProcess
          terms
        }
      }
    `,
    getRelatedItems: `
      query getRelatedFinancialItems($id: String!, $category: String, $provider: String) {
        relatedItems: relatedFinancialServices(id: $id, category: $category, provider: $provider) {
          id
          title
          description
          category
          serviceType
          provider {
            name
            logoUrl
            description
          }
          amount
          duration
          eligibility
          interestRate
          tags
        }
      }
    `,
    getFilterOptions: `
      query getFinancialFilterOptions {
        filterOptions {
          categories {
            id
            name
          }
          serviceTypes {
            id
            name
          }
        }
      }
    `,
    getProviders: `
      query getFinancialProviders {
        providers {
          id
          name
          logoUrl
          description
        }
      }
    `
  },
  // Non-financial services marketplace queries
  'non-financial': {
    getItems: `
      query getNonFinancialItems($category: String, $serviceType: String, $deliveryMode: String, $provider: String, $search: String) {
        items: nonFinancialServices(category: $category, serviceType: $serviceType, deliveryMode: $deliveryMode, provider: $provider, search: $search) {
          id
          title
          description
          category
          serviceType
          deliveryMode
          provider {
            name
            logoUrl
            description
          }
          duration
          price
          tags
          details
        }
      }
    `,
    getItemDetails: `
      query getNonFinancialItemDetails($id: String!) {
        item: nonFinancialService(id: $id) {
          id
          title
          description
          category
          serviceType
          deliveryMode
          provider {
            name
            logoUrl
            description
          }
          duration
          price
          tags
          details
          highlights
          requiredDocuments
          applicationProcess
          eligibility
          deliveryDetails
        }
      }
    `,
    getRelatedItems: `
      query getRelatedNonFinancialItems($id: String!, $category: String, $provider: String) {
        relatedItems: relatedNonFinancialServices(id: $id, category: $category, provider: $provider) {
          id
          title
          description
          category
          serviceType
          deliveryMode
          provider {
            name
            logoUrl
            description
          }
          duration
          price
          tags
        }
      }
    `,
    getFilterOptions: `
      query getNonFinancialFilterOptions {
        filterOptions {
          categories {
            id
            name
          }
          serviceTypes {
            id
            name
          }
          deliveryModes {
            id
            name
          }
        }
      }
    `,
    getProviders: `
      query getNonFinancialProviders {
        providers {
          id
          name
          logoUrl
          description
        }
      }
    `
  }
};
// Legacy queries for backward compatibility
export const GET_COURSE_DETAILS = MARKETPLACE_QUERIES.courses.getItemDetails;
export const GET_RELATED_COURSES = MARKETPLACE_QUERIES.courses.getRelatedItems;
export const GET_COURSES = MARKETPLACE_QUERIES.courses.getItems;
export const GET_CATEGORIES = `
  query getCategories {
    categories {
      id
      name
    }
  }
`;
export const GET_DELIVERY_MODES = `
  query getDeliveryModes {
    deliveryModes {
      id
      name
    }
  }
`;
export const GET_BUSINESS_STAGES = `
  query getBusinessStages {
    businessStages {
      id
      name
    }
  }
`;
export const GET_PROVIDERS = `
  query getProviders {
    providers {
      id
      name
      logoUrl
      description
    }
  }
`;