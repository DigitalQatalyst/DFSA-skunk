# API Services

This directory contains API service functions for interacting with the backend.

## Service Requests API

### `fetchServiceRequests(userId: string)`

Fetches all service requests for a specific user from the backend API.

**Endpoint:** `https://kfrealexpressserver.vercel.app/api/v1/service-request/all-service-requests/{userId}`

**Parameters:**

- `userId` (string): The ID of the logged-in user

**Returns:**

- `Promise<ServiceRequest[]>`: Array of service requests transformed to match the frontend interface

**Error Handling:**

- Network errors are caught and re-thrown with descriptive messages
- API response errors (4xx, 5xx) are handled with appropriate error messages
- Data transformation ensures compatibility with the frontend ServiceRequest interface

**Usage:**

```typescript
import { fetchServiceRequests } from "../services/api/serviceRequests";

try {
  const requests = await fetchServiceRequests(user.id);
  // Handle successful response
} catch (error) {
  // Handle error
}
```

## Data Structure

The API returns a nested structure with multiple service types, each containing an array of requests:

```json
{
  "userId": "string",
  "totalRequests": 11,
  "serviceRequests": [
    {
      "name": "Request for Membership",
      "data": {
        "value": [
          /* array of actual requests */
        ]
      }
    }
  ]
}
```

## Field Mappings

The service automatically transforms Dynamics CRM fields to frontend interface:

- `kf_requestformembershipformid` → `id`
- `kf_servicename` or parent `name` → `serviceName`
- `kf_category` → `category`
- `statuscode` → `status` (with numeric to text conversion)
- `createdon` → `submittedDate`
- `kf_serviceprovider` → `serviceProvider`

## Status Mappings

- `1` → "draft"
- `2` → "under-review"
- `3` → "approved"
- `4` → "rejected"
