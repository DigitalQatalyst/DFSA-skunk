import { request } from "./graphql/client";
import { MARKETPLACE_QUERIES } from "./graphql/queries";
import { FilterConfig } from "../components/marketplace/FilterSidebar";
import { MarketplaceItem } from "../components/marketplace/MarketplaceGrid";
import { getMarketplaceConfig } from "../utils/marketplaceConfig";

/**
 * Fetches marketplace items based on marketplace type, filters, and search query
 */
export const fetchMarketplaceItems = async (
  marketplaceType: string,
  filters: Record<string, string>,
  searchQuery?: string
): Promise<any[]> => {
  try {
    // Get the marketplace config to access query and mapping functions
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getItems;
    if (!query) {
      throw new Error(
        `No query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Prepare variables for the query
    const variables: Record<string, string | undefined> = {
      search: searchQuery || undefined,
    };
    // Add filter variables
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        variables[key] = value;
      }
    });
    // Execute the query
    const data = (await request(
      query,
      variables,
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Items`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapListResponse && data.items) {
      return config.mapListResponse(data.items);
    }
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} items:`, error);
    throw new Error(
      `Failed to load ${marketplaceType} items. Please try again later.`
    );
  }
};

/**
 * Fetches filter configurations for a specific marketplace type
 */
export const fetchMarketplaceFilters = async (
  marketplaceType: string
): Promise<FilterConfig[]> => {
  try {
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getFilterOptions;
    if (!query) {
      // Fall back to config-defined filters if no query is available
      return config.filterCategories;
    }
    // Execute the query
    const data = (await request(
      query,
      {},
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }FilterOptions`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapFilterResponse && data.filterOptions) {
      return config.mapFilterResponse(data.filterOptions);
    }
    // Fall back to config-defined filters if mapping fails
    return config.filterCategories;
  } catch (error) {
    console.error(
      `Error fetching filter options for ${marketplaceType}:`,
      error
    );
    // Fall back to config-defined filters on error
    const config = getMarketplaceConfig(marketplaceType);
    return config.filterCategories;
  }
};

/**
 * Fetches details for a specific marketplace item
 */
export const fetchMarketplaceItemDetails = async (
  marketplaceType: string,
  itemId: string
): Promise<any> => {
  try {
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getItemDetails;
    if (!query) {
      throw new Error(
        `No detail query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {
        id: itemId,
      },
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }ItemDetails`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapDetailResponse && data.item) {
      return config.mapDetailResponse(data.item);
    }
    return data.item;
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} item details:`, error);
    throw new Error(`Failed to load item details. Please try again later.`);
  }
};

/**
 * Fetches related items for a specific marketplace item
 */
export const fetchRelatedMarketplaceItems = async (
  marketplaceType: string,
  itemId: string,
  category: string,
  provider: string
): Promise<any[]> => {
  try {
    // Get the marketplace config
    const config = getMarketplaceConfig(marketplaceType);
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getRelatedItems;
    if (!query) {
      throw new Error(
        `No related items query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {
        id: itemId,
        category,
        provider,
      },
      `getRelated${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Items`,
      marketplaceType
    )) as any;
    // Transform the data using the mapping function if provided in the config
    if (config.mapListResponse && data.relatedItems) {
      return config.mapListResponse(data.relatedItems);
    }
    return data.relatedItems || [];
  } catch (error) {
    console.error(`Error fetching related ${marketplaceType} items:`, error);
    throw new Error(`Failed to load related items. Please try again later.`);
  }
};

/**
 * Fetches providers for a specific marketplace type
 */
export const fetchMarketplaceProviders = async (
  marketplaceType: string
): Promise<any[]> => {
  try {
    // Get the appropriate query for this marketplace type
    const query =
      MARKETPLACE_QUERIES[marketplaceType as keyof typeof MARKETPLACE_QUERIES]
        ?.getProviders;
    if (!query) {
      throw new Error(
        `No providers query defined for marketplace type: ${marketplaceType}`
      );
    }
    // Execute the query
    const data = (await request(
      query,
      {},
      `get${
        marketplaceType.charAt(0).toUpperCase() + marketplaceType.slice(1)
      }Providers`,
      marketplaceType
    )) as any;
    return data.providers || [];
  } catch (error) {
    console.error(`Error fetching ${marketplaceType} providers:`, error);
    throw new Error(`Failed to load providers. Please try again later.`);
  }
};
