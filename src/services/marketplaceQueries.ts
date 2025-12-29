import { gql } from "@apollo/client";

// GraphQL Query for Products
const GET_PRODUCTS = gql`
  query {
      products(options:{sort:{id:DESC}}) {
        totalItems
        items {
          id
          name
          slug
          description
          facetValues {
            facet {
              id
              name
              code
            }
            id
            name
            code
          }
          customFields {
            formUrl 
            EmpowermentandLeadership
            Industry
            BusinessStage
            ProcessingTime
            RegistrationValidity
            Cost
            Steps
            KeyTermsOfService
            RequiredDocuments
            RelatedServices {
              id
              name
              slug
            }
          }
        }
      }
    }
`;

// GraphQL Query for Facets
const GET_FACETS = gql`
  query GetFacets {
    facets {
      items {
        id
        name
        code
        values {
          id
          name
          code
        }
      }
    }
  }
`;

// GraphQL Query for a single Product by ID
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      facetValues {
        facet {
          id
          name
          code
        }
        id
        name
        code
      }
      customFields {
        formUrl
        Industry
        BusinessStage
        ProcessingTime
        RegistrationValidity
        Cost
        Steps
        KeyTermsOfService
        RequiredDocuments
        RelatedServices {
          id
          name
          slug
        }
      }
    }
  }
`;
const BOOKMARK_SERVICE = gql`
mutation ToggleFavorite($productId: ID!) {
  toggleFavorite(productId: $productId) {
    items {
      id
      createdAt
      product {
        id
        name
        slug
      }
    }
    totalItems
  }
}
`
const GET_COURSE = gql`
  query GetCourse($id:ID!) {
  course(id:$id) {
    id
    name
    description
    topicTitle
    skillsGained
    prerequisite
    courseTimeline
    uponCompletion
    partner
    rating
    reviewCount
    startDate
    Cost
    keyHighlights
    duration
    logoUrl
    businessStage
    pricingModel
    serviceCategory
    learningObjectives
    learningOutcomes
    resources    
    }    
  }
`
// GraphQL Query for Courses
const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses(options: { take: 10, skip: 0, sort: { rating: DESC } }) {
      items {
        id
        name
        description
        partner
        rating
        reviewCount
        Cost
        duration
        logoUrl
        businessStage
        pricingModel
        serviceCategory
      }
      totalItems
    }
  }
`;

// GraphQL Query for Events
const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    products(options: { take: 100 }) {
      totalItems
      items {
        id
        name
        slug
        description
        assets {
          name
        }
        facetValues {
          facet {
            id
            name
            code
          }
          id
          name
          code
        }
        customFields {
          eventRegistrationValidity
          eventType
          eventStartDate
          eventTime
          eventEndDate
          registrationOpenDate
          registrationCloseDate
          virtualEventLink
          eventTags
          eventCategory
          capacity
          eventObjectives
          eventAgenda
          eventFAQ
          eventSpeakers
          eventTickets
          certificateAvailable
          resourceLink
          organiser
          eventLocation
          eventRequirements
        }
      }
    }
  }
`;

export { GET_PRODUCTS, GET_FACETS, GET_PRODUCT, GET_ALL_COURSES, GET_ALL_EVENTS, GET_COURSE, BOOKMARK_SERVICE };
