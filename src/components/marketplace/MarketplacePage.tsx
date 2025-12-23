import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FilterSidebar, FilterConfig } from "./FilterSidebar";
import { MarketplaceGrid } from "./MarketplaceGrid";
import { SearchBar } from "../SearchBar";
import {
  FilterIcon,
  XIcon,
  HomeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { ErrorDisplay, CourseCardSkeleton } from "../SkeletonLoader";
import { getMarketplaceConfig } from "../../utils/marketplaceConfig";
import { MarketplaceComparison } from "./MarketplaceComparison";
import { Header, useAuth } from "../Header";
import { Footer } from "../Footer";
import {
  getStoredCompareIds,
  setStoredCompareIds,
  addCompareId as storageAddCompareId,
  removeCompareId as storageRemoveCompareId,
  clearCompare as storageClearCompare,
} from "../../utils/comparisonStorage";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import {
  GET_PRODUCTS,
  GET_FACETS,
  GET_ALL_EVENTS,
} from "../../services/marketplaceQueries.ts";
import { fetchNonFinancialServices } from "../../services/nonFinancialService";

// Shared mapping + options
import {
  MEDIA_TYPE_FORMAT_MAPPING,
  POPULARITY_OPTIONS,
} from "../../../shared/mediaConstants.mjs";

// Type for comparison items
interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}

// Types for GET_FACETS query
interface FacetValue {
  id: string;
  name: string;
  code: string;
}

interface Facet {
  id: string;
  name: string;
  code: string;
  values: FacetValue[];
}

interface GetFacetsData {
  facets: {
    items: Facet[];
  };
}

// Types for GET_PRODUCTS query
interface Asset {
  name: string;
}

interface RequiredDocument {
  id: string;
  customFields: any;
}

interface RelatedService {
  id: string;
}

interface ProductCustomFields {
  Industry?: string;
  BusinessStage?: string;
  ProcessingTime?: string;
  RegistrationValidity?: string;
  Cost?: number;
  Steps?: string;
  KeyTermsOfService?: string;
  RequiredDocuments?: RequiredDocument[];
  RelatedServices?: RelatedService[];
  formUrl?: string;
  logoUrl?: string;
  // Course-related fields
  learningObjectives?: string[];
  learningOutcomes?: string[];
  skillsGained?: string[];
  audience?: string;
  duration?: string;
  courseTimeline?: string;
  resources?: string[];
  documentLink?: string;
  uponCompletion?: string;
  rating?: number;
  reviewCount?: number;
  languages?: string[];
  pricingModel?: string;
  serviceCategory?: string;
  resourceType?: string;
  notes?: string;
  isFeatured?: boolean;
  isOnline?: boolean;
}

interface ProductFacetValue {
  facet: {
    id: string;
    name: string;
    code: string;
  };
  id: string;
  name: string;
  code: string;
}

interface Product {
  id: string;
  assets: Asset[];
  name: string;
  slug: string;
  description: string;
  facetValues: ProductFacetValue[];
  customFields: ProductCustomFields;
}

interface GetProductsData {
  products: {
    items: Product[];
    totalItems: number;
  };
}

// Events-specific types
interface EventCustomFields {
  eventRegistrationValidity?: string[];
  eventType?: string;
  eventStartDate?: string;
  eventTime?: string;
  eventEndDate?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  virtualEventLink?: string;
  eventTags?: string;
  eventCategory?: string;
  capacity?: string;
  eventObjectives?: string[];
  eventAgenda?: string[];
  eventFAQ?: string[];
  eventSpeakers?: string[];
  eventTickets?: string;
  certificateAvailable?: boolean;
  resourceLink?: string;
  organiser?: string;
  eventLocation?: string;
  eventRequirements?: string;
}

interface EventProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  assets: Asset[];
  facetValues: ProductFacetValue[];
  customFields: EventCustomFields;
}

interface GetEventsData {
  products: {
    items: EventProduct[];
    totalItems: number;
  };
}

export interface MarketplacePageProps {
  marketplaceType:
    | "courses"
    | "financial"
    | "business-services"
    | "knowledge-hub"
    | "events";
  title: string;
  description: string;
  promoCards?: any[];
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  promoCards = [],
}) => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const location = useLocation() as any;

  // Safely get config with error handling
  let config: ReturnType<typeof getMarketplaceConfig> | null = null;
  try {
    config = getMarketplaceConfig(marketplaceType);
  } catch (error) {
    console.error("Error loading marketplace config:", error);
  }

  // State for items and filtering
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  // Filter sidebar visibility - should be visible on desktop, hidden on mobile by default
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  // Avoid clobbering localStorage with empty state before hydration
  const [hasHydratedCompare, setHasHydratedCompare] = useState(false);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // State for filter options
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Knowledge Hub specific filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Collapsible filter categories state
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track header height so sticky elements sit directly under it
  const [headerHeight, setHeaderHeight] = useState<number>(46);
  // Knowledge Hub keyset pagination + caching state
  const [khCursor, setKhCursor] = useState<string | null>(null);
  const [khHasMore, setKhHasMore] = useState<boolean>(true);
  const [khFetching, setKhFetching] = useState<boolean>(false);
  const [khPages, setKhPages] = useState<
    Array<{ items: any[]; after: string | null; nextCursor: string | null }>
  >([]);
  // Sync filters/search/pagination with URL as the source of truth
  const [queryParams, setQueryParams] = useSearchParams();
  const getCsv = (v: string | null): string[] => {
    if (!v) return [];
    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };
  // Hydrate local UI from URL and on back/forward
  useEffect(() => {
    if (marketplaceType !== "knowledge-hub") return;
    const q = queryParams.get("q") || "";
    setSearchQuery(q);
    const fromDbToUi: Record<string, string> = {
      News: "News",
      Article: "Article",
      Report: "Reports",
      Tool: "Toolkits & Templates",
      Guide: "Guides",
      Video: "Videos",
      Podcast: "Podcasts",
    };
    const nextActive: string[] = [];
    const typeCsv = getCsv(queryParams.get("type"));
    const formatCsv = getCsv(queryParams.get("format"));
    // Special handling: when DB type is Article, reflect UI as News/Guides depending on selected formats
    typeCsv.forEach((t) => {
      if (t === "Article") {
        const hasQuick = formatCsv.includes("Quick Reads");
        const hasInDepth = formatCsv.includes("In-Depth Reports");
        if (hasQuick && !hasInDepth) {
          if (!nextActive.includes("News")) nextActive.push("News");
        } else if (hasInDepth && !hasQuick) {
          if (!nextActive.includes("Guides")) nextActive.push("Guides");
        } else if (hasQuick && hasInDepth) {
          // Both selected => show both for clarity
          if (!nextActive.includes("News")) nextActive.push("News");
          if (!nextActive.includes("Guides")) nextActive.push("Guides");
        } else {
          // No format chosen => user explicitly chose Article
          nextActive.push("Article");
        }
      } else {
        const ui = fromDbToUi[t];
        if (ui) nextActive.push(ui);
      }
    });
    getCsv(queryParams.get("domain")).forEach((d) => nextActive.push(d));
    getCsv(queryParams.get("stage")).forEach((s) => nextActive.push(s));
    formatCsv.forEach((f) => nextActive.push(f));
    getCsv(queryParams.get("popularity")).forEach((p) => nextActive.push(p));
    setActiveFilters(nextActive);
    const p = parseInt(queryParams.get("page") || "1", 10);
    setCurrentPage(isNaN(p) || p < 1 ? 1 : p);
    // mark as hydrated so search changes can start updating URL
    hasHydratedParamsRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, marketplaceType, filterConfig]);

  // Responsive columns (used by non-KH views); KH uses fixed perPage from URL
  const [columns, setColumns] = useState<number>(1);
  const DEFAULT_PER_PAGE = 9;
  const urlPerPage = parseInt(
    queryParams.get("perPage") || String(DEFAULT_PER_PAGE),
    10
  );
  const perPage =
    isNaN(urlPerPage) || urlPerPage < 1 ? DEFAULT_PER_PAGE : urlPerPage;
  const rowsPerPage = 4;
  const computedPageSize = columns * rowsPerPage;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const khCacheRef = useRef<
    Record<string, { items: any[]; cursor: string | null; ts: number }>
  >({});
  // Reduce/disable client-side caching so admin updates reflect immediately
  const KH_CACHE_TTL_MS = 0; // set to 0 to always fetch fresh
  const [khPageSize, setKhPageSize] = useState<number>(0);

  // Apollo queries for products, facets, and events
  // Skip GraphQL entirely for Knowledge Hub — it uses Supabase
  const skipGraph = marketplaceType === "knowledge-hub";

  const { data: productData, error: productError } = useQuery<GetProductsData>(
    GET_PRODUCTS,
    {
      skip: skipGraph,
    }
  );

  const { data: eventData, error: eventError } = useQuery<GetEventsData>(
    GET_ALL_EVENTS,
    {
      skip: marketplaceType !== "events",
    }
  );

  // Debug logging for courses
  useEffect(() => {
    if (marketplaceType === "courses") {
      console.log("=== COURSES DEBUG LOG ===");
      console.log("skipGraph:", skipGraph);
      console.log("productData:", productData);
      console.log("productError:", productError);
      console.log("Total products:", productData?.products?.items?.length || 0);

      if (productData?.products?.items) {
        console.log(
          "All products facet values:",
          productData.products.items.map((p) => ({
            id: p.id,
            name: p.name,
            facetValues: p.facetValues.map((fv) => ({
              id: fv.id,
              name: fv.name,
              code: fv.code,
            })),
          }))
        );

        const coursesWithFacet72 = productData.products.items.filter(
          (product) => product.facetValues.some((fv) => fv.id === "72")
        );
        console.log("Products with facet id '72':", coursesWithFacet72.length);
        console.log(
          "Course products:",
          coursesWithFacet72.map((p) => ({
            id: p.id,
            name: p.name,
            customFields: p.customFields,
          }))
        );
      }
      console.log("========================");
    }
  }, [marketplaceType, productData, productError, skipGraph]);

  const { data: facetData, error: facetError } = useQuery<GetFacetsData>(
    GET_FACETS,
    {
      skip: skipGraph,
      errorPolicy: "all",
      onError: (error) => {
        console.error("GraphQL facets query error:", error);
        // Don't set error for facets as it's not critical - just log it
        console.warn(
          "Facets query failed, using fallback filter configuration"
        );
      },
    }
  );

  // Measure header height for correct sticky offset on mobile
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      setHeaderHeight(header?.offsetHeight || 46);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Detect responsive columns; set a stable KH page size once (4 rows * cols)
  useEffect(() => {
    const calcColumns = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      const cols = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      setColumns(cols);
      if (!khPageSize) {
        setKhPageSize(cols * rowsPerPage);
      }
    };
    calcColumns();
    window.addEventListener("resize", calcColumns);
    return () => window.removeEventListener("resize", calcColumns);
  }, [khPageSize]);

  // Debounce search input for Knowledge Hub
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Normalize UI media type labels to DB values (v_media_public.type)
  const toDbType = (label: string): string | null => {
    const m: Record<string, string> = {
      // Article-family UI labels map to canonical Article
      News: "Article",
      Article: "Article",
      Articles: "Article",
      Guides: "Article",
      Guide: "Article",
      // Others map 1:1 to canonical types
      Reports: "Report",
      Report: "Report",
      "Toolkits & Templates": "Tool",
      Toolkit: "Tool",
      Tool: "Tool",
      Videos: "Video",
      Video: "Video",
      Podcasts: "Podcast",
      Podcast: "Podcast",
    };
    return m[label] || null;
  };
  const stripHtml = (html: string): string => {
    try {
      const tmp = document.createElement("div");
      tmp.innerHTML = String(html || "");
      return (tmp.textContent || tmp.innerText || "")
        .replace(/\s+/g, " ")
        .trim();
    } catch {
      return String(html || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  };
  // Minimal set of columns needed for KH cards to avoid pulling full body payloads
  const KH_SELECT_COLUMNS = [
    "id",
    "title",
    "summary",
    "body_html",
    "article_body_html",
    "type",
    "domain",
    "business_stage",
    "format",
    "popularity",
    "provider_name:legacy_provider_name",
    "provider_logo_url:legacy_provider_logo_url",
    "authors",
    "thumbnail_url",
    "image_url",
    "report_document_url",
    "tool_document_url",
    "tags",
    "published_at",
    "updated_at",
  ].join(",");

  // Build server-side KH query with all active filters
  const fetchKHPaginated = async ({
    page,
    perPage,
    filters,
  }: {
    page: number;
    perPage: number;
    filters: {
      type: string[];
      domain: string[];
      stage: string[];
      format: string[];
      popularity: string[];
      search: string;
    };
  }): Promise<{ items: any[]; totalCount: number }> => {
    const supabase = getSupabaseKnowledgeHub();
    const from = Math.max(0, (page - 1) * perPage);
    const to = from + perPage - 1;
    let query = supabase
      // .schema("admin")
      .from("v_media_public")
      .select(KH_SELECT_COLUMNS, { count: "exact" })
      .eq("visibility", "Public")
      .eq("status", "Published")
      .range(from, to);

    if (filters.type && filters.type.length > 0)
      query = query.in("type", filters.type);
    if (filters.domain && filters.domain.length > 0)
      query = query.in("domain", filters.domain);
    if (filters.stage && filters.stage.length > 0)
      query = query.in("business_stage", filters.stage);
    if (filters.format && filters.format.length > 0)
      query = query.in("format", filters.format);
    // Popularity: if specific options selected, filter/sort accordingly
    let popularityKey = "";
    if (filters.popularity && filters.popularity.length > 0)
      popularityKey = String(filters.popularity[0]);
    if (popularityKey === "Editor's Pick") {
      query = query.eq("popularity", "Editor's Pick");
    }
    if (filters.search && filters.search.trim()) {
      const safe = filters.search.replace(/%/g, "");
      query = query.or(`title.ilike.%${safe}%,summary.ilike.%${safe}%`);
    }

    // Apply ordering: Most Downloaded uses download_count; others default to latest
    if (popularityKey === "Most Downloaded") {
      query = query.order("download_count", { ascending: false });
      query = query.order("published_at", { ascending: false });
      query = query.order("id", { ascending: false });
    } else {
      query = query.order("published_at", { ascending: false });
      query = query.order("id", { ascending: false });
    }

    const { data, error, count } = await query;
    if (error) throw error;
    const rows = data || [];
    const mapped = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description:
        (row.summary && String(row.summary).trim()) ||
        stripHtml(
          (row as any).body_html || (row as any).article_body_html || ""
        ),
      mediaType: row.type,
      domain: (row as any).domain || null,
      businessStage: (row as any).business_stage || null,
      format: (row as any).format || null,
      popularity: (row as any).popularity || null,
      provider: {
        name: row.provider_name || "Knowledge Hub",
        logoUrl: row.provider_logo_url || null,
      },
      authors: (row as any).authors || null,
      imageUrl: row.thumbnail_url || row.image_url || undefined,
      downloadUrl:
        (row as any).report_document_url ||
        (row as any).tool_document_url ||
        undefined,
      tags: (row as any).tags || [],
      date: row.published_at,
      lastUpdated: row.updated_at,
    }));
    const shouldDeriveTrending = popularityKey === "Trending";
    if (shouldDeriveTrending) {
      try {
        const ids = mapped.map((m) => m.id);
        if (ids.length > 0) {
          const sinceIso = new Date(
            Date.now() - 7 * 24 * 3600 * 1000
          ).toISOString();
          const { data: viewRows } = await supabase
            // .schema("admin")
            .from("media_views")
            .select("media_id, viewed_at")
            .in("media_id", ids)
            .gte("viewed_at", sinceIso);
          const counts: Record<string, number> = {};
          (viewRows || []).forEach((r: any) => {
            const k = r.media_id;
            counts[k] = (counts[k] || 0) + 1;
          });
          const arr = Object.values(counts)
            .filter((n) => typeof n === "number" && n > 0)
            .sort((a, b) => a - b);
          const p75 = arr.length ? arr[Math.floor(0.75 * (arr.length - 1))] : 0;
          const recentDays = 30;
          mapped.forEach((m) => {
            const publishedAt = m.date ? new Date(m.date as any).getTime() : 0;
            const isRecent =
              publishedAt &&
              Date.now() - publishedAt <= recentDays * 24 * 3600 * 1000;
            const v = counts[m.id] || 0;
            if (v > 0 && v >= p75) m.popularity = "Trending";
            else if (isRecent) m.popularity = "Latest";
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
    // If user selected 'Trending', filter client-side based on derived popularity
    const finalItems =
      popularityKey === "Trending"
        ? mapped.filter(
            (m) =>
              String(m.popularity || "").toLowerCase() ===
              "trending".toLowerCase()
          )
        : mapped;
    return {
      items: finalItems,
      totalCount: popularityKey === "Trending" ? finalItems.length : count || 0,
    };
  };
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);
  // Write search to URL when user changes it (reset to page=1)
  const hasHydratedParamsRef = useRef(false);
  useEffect(() => {
    if (marketplaceType !== "knowledge-hub") return;
    // mark hydrated after first query param sync
    hasHydratedParamsRef.current = true;
  }, [marketplaceType]);
  useEffect(() => {
    if (marketplaceType !== "knowledge-hub") return;
    if (!hasHydratedParamsRef.current) return;
    const currentQ = queryParams.get("q") || "";
    if ((searchQuery || "") === currentQ) return;
    const next: Record<string, string> = {};
    queryParams.forEach((v, k) => {
      next[k] = v;
    });
    if (searchQuery && searchQuery.trim()) next.q = searchQuery;
    else delete next.q;
    next.page = "1";
    next.perPage = String(perPage);
    setQueryParams(next);
  }, [searchQuery, marketplaceType, queryParams, perPage, setQueryParams]);

  // Knowledge Hub: fetch on URL param changes (true pagination)
  const [khTotalCount, setKhTotalCount] = useState<number>(0);
  const requestSeqRef = useRef(0);
  const loadKHInitial = useCallback(async () => {
    if (marketplaceType !== "knowledge-hub") return;
    setKhFetching(true);
    setError(null);
    const page = Math.max(1, parseInt(queryParams.get("page") || "1", 10) || 1);
    const ppg = perPage;
    const fType = getCsv(queryParams.get("type"));
    const fDomain = getCsv(queryParams.get("domain"));
    const fStage = getCsv(queryParams.get("stage"));
    const fFormat = getCsv(queryParams.get("format"));
    const fPopularity = getCsv(queryParams.get("popularity"));
    const seq = ++requestSeqRef.current;
    try {
      const { items: mapped, totalCount } = await fetchKHPaginated({
        page,
        perPage: ppg,
        filters: {
          type: fType,
          domain: fDomain,
          stage: fStage,
          format: fFormat,
          popularity: fPopularity,
          search: debouncedSearch,
        },
      });
      if (seq !== requestSeqRef.current) return;
      const totalPages = Math.max(1, Math.ceil((totalCount || 0) / ppg));
      if (totalCount > 0 && page > totalPages) {
        const next: Record<string, string> = {};
        queryParams.forEach((v, k) => {
          next[k] = v;
        });
        next.page = String(totalPages);
        setQueryParams(next);
        return;
      }
      setKhTotalCount(totalCount || 0);
      setItems(mapped);
      setFilteredItems(mapped);
      setCurrentPage(page);
    } catch (e) {
      if (seq !== requestSeqRef.current) return;
      console.warn("Knowledge Hub fetch failed", e);
      setError("Failed to load knowledge hub");
      setItems([]);
      setFilteredItems([]);
      setKhTotalCount(0);
    } finally {
      if (seq === requestSeqRef.current) setKhFetching(false);
    }
  }, [marketplaceType, queryParams, perPage, debouncedSearch]);

  // Knowledge Hub: URL-driven pagination; no infinite load-more path

  // Removed auto-prefetch sentinel to avoid flicker and dupe fetches

  // KH page derived from URL; filters/search change will update URL and re-fetch

  // For knowledge-hub we show one page at a time; others use client-side pagination
  const paginatedItems =
    marketplaceType === "knowledge-hub"
      ? filteredItems
      : filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalPages =
    marketplaceType === "knowledge-hub"
      ? 1
      : Math.ceil(filteredItems.length / perPage);

  // Navigate KH pages (update URL page param only)
  const goToKHPage = useCallback(
    async (page: number) => {
      if (marketplaceType !== "knowledge-hub") return;
      const target = Math.max(1, Math.floor(page || 1));
      const next: Record<string, string> = {};
      queryParams.forEach((v, k) => {
        next[k] = v;
      });
      next.page = String(target);
      setQueryParams(next);
    },
    [marketplaceType, queryParams, setQueryParams]
  );

  // Load filter configurations based on marketplace type
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        if (!config) {
          return;
        }
        if (marketplaceType === "knowledge-hub") {
          // Use static config for Knowledge Hub filters only
          const filterOptions: FilterConfig[] = config.filterCategories;
          setFilterConfig(filterOptions);

          // Initialize empty filters based on the configuration
          const initialFilters: Record<string, string[]> = {};
          filterOptions.forEach((fc) => {
            initialFilters[fc.id] = [];
          });
          setFilters(initialFilters);
          return;
        }

        if (marketplaceType === "business-services") {
          // Generate filters directly from Supabase data
          const services = await fetchNonFinancialServices();

          const serviceTypes = [...new Set(services.map((s) => s.service_type))]
            .filter(Boolean)
            .sort();
          const serviceCategories = [
            ...new Set(services.map((s) => s.service_category)),
          ]
            .filter(Boolean)
            .sort();
          const entityTypes = [...new Set(services.map((s) => s.entity_type))]
            .filter(Boolean)
            .sort();

          const filterOptions: FilterConfig[] = [
            {
              id: "service-type",
              title: "Service Type",
              options: serviceTypes.map((type) => ({
                id: type.toLowerCase().replace(/\s+/g, "-"),
                name: type,
              })),
            },
            {
              id: "service-category",
              title: "Service Category",
              options: serviceCategories.map((category) => ({
                id: category.toLowerCase().replace(/\s+/g, "-"),
                name: category,
              })),
            },
            {
              id: "entity-type",
              title: "Entity Type",
              options: entityTypes.map((entity) => ({
                id: entity.toLowerCase().replace(/\s+/g, "-"),
                name: entity,
              })),
            },
            {
              id: "provided-by",
              title: "Provided By",
              options: [{ id: "dfsa", name: "DFSA" }],
            },
          ];

          setFilterConfig(filterOptions);

          const initialFilters: Record<string, string[]> = {};
          filterOptions.forEach((config) => {
            initialFilters[config.id] = [];
          });
          setFilters(initialFilters);
          return;
        }

        if (facetData) {
          // Choose facet codes based on marketplace type
          let facetCodes: string[] = [];
          if (marketplaceType === "financial") {
            facetCodes = [
              "service-category",
              "service-type",
              "entity-type",
              "provided-by",
            ];
          } else if (marketplaceType === "business-services") {
            facetCodes = [
              "service-category",
              "service-type",
              "entity-type",
              "provided-by",
            ];
          } else if (marketplaceType === "courses") {
            facetCodes = [
              "service-category",
              "delivery-mode",
              "duration",
              "business-stage",
              "provided-by",
            ];
          } else if (marketplaceType === "events") {
            // Events: strictly use backend facets only
            facetCodes = [
              "time-range",
              "event-type",
              "delivery-mode",
              "cost-type",
              "duration-band",
              "language",
              "capability",
              "business-stage",
              "industry",
              "organizer",
            ];
          } else {
            facetCodes = [
              "service-category",
              "business-stage",
              "provided-by",
              "pricing-model",
            ];
          }

          // Define the desired order for business-stage filter options
          const businessStageOrder = [
            "Ideation",
            "Launch",
            "Growth",
            "Expansion",
            "Optimisation",
            "Transformation",
          ];

          const filterOptions: FilterConfig[] = facetData.facets.items
            .filter((facet) => facetCodes.includes(facet.code))
            .map((facet) => {
              let options = facet.values.map((value) => ({
                id: value.code,
                name: value.name,
              }));

              // Sort business-stage options according to the specified order
              if (facet.code === "business-stage") {
                options = options.sort((a, b) => {
                  const indexA = businessStageOrder.indexOf(a.name);
                  const indexB = businessStageOrder.indexOf(b.name);
                  // If both are in the order list, sort by the specified order
                  if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                  }
                  // If only A is in the order list, prioritize A
                  if (indexA !== -1) return -1;
                  // If only B is in the order list, prioritize B
                  if (indexB !== -1) return 1;
                  // If neither is in the order list, sort alphabetically
                  return a.name.localeCompare(b.name);
                });
              }

              return {
                id: facet.code,
                title: facet.name,
                options,
              };
            });

          console.log("filterOptions:", filterOptions);

          // For events, ensure we have filters loaded from backend
          if (marketplaceType === "events" && filterOptions.length === 0) {
            console.error(
              "No event facets found in backend. Please ensure event facets are configured."
            );
            setError(
              "Event filters could not be loaded from backend. Please ensure facets are configured."
            );
            setFilterConfig([]);
            setFilters({});
            return;
          }

          setFilterConfig(filterOptions);

          // Initialize empty filters based on the configuration
          const initialFilters: Record<string, string[]> = {};
          filterOptions.forEach((config) => {
            initialFilters[config.id] = [];
          });
          setFilters(initialFilters);
        } else if (
          marketplaceType === "events" ||
          marketplaceType === "financial" ||
          marketplaceType === "courses"
        ) {
          // These marketplaces require backend facets - no fallback
          console.error(
            `No facet data available for ${marketplaceType} marketplace`
          );
          setError(
            "Filters could not be loaded from backend. Please ensure facets are configured."
          );
          setFilterConfig([]);
          setFilters({});
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);

        // For events, financial, and courses, do NOT use fallback - show error instead
        if (
          marketplaceType === "events" ||
          marketplaceType === "financial" ||
          marketplaceType === "courses"
        ) {
          console.error(
            `Failed to load ${marketplaceType} filters from backend`
          );
          setError(
            "Failed to load filters. Please check backend configuration."
          );
          setFilterConfig([]);
          setFilters({});
        } else {
          // Use fallback filter config from marketplace config for other marketplaces
          setFilterConfig(config.filterCategories);
          // Initialize empty filters based on the configuration
          const initialFilters: Record<string, string[]> = {};
          config.filterCategories.forEach((config) => {
            initialFilters[config.id] = [];
          });
          setFilters(initialFilters);
        }
      }
    };
    loadFilterOptions();
  }, [facetData, marketplaceType, config]);

  // Initialize all filter categories as collapsed by default
  useEffect(() => {
    if (filterConfig.length > 0) {
      const initialCollapsed: Record<string, boolean> = {};
      filterConfig.forEach((category) => {
        initialCollapsed[category.id] = true;
      });
      setCollapsedCategories(initialCollapsed);
    }
  }, [filterConfig]);

  // Fetch items based on marketplace type, filters, and search query
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);

      try {
        // Handle Knowledge Hub (URL-driven pagination)
        if (marketplaceType === "knowledge-hub") {
          await loadKHInitial();
          setLoading(false);
          return;
        }

        // Handle Events (backend-driven)
        if (marketplaceType === "events" && eventData) {
          // Filter products belonging to Events marketplace (facet value id "25")
          const rawEvents = eventData.products.items.filter((product) =>
            product.facetValues.some((fv) => fv.id === "25")
          );

          const mappedItems = rawEvents.map((event) => {
            const cf = event.customFields || {};

            // Format event start date for display
            let eventDateFormatted = "";
            if (cf.eventStartDate) {
              try {
                const d = new Date(cf.eventStartDate);
                if (!isNaN(d.getTime())) {
                  eventDateFormatted = d.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                }
              } catch {
                eventDateFormatted = cf.eventStartDate || "";
              }
            }

            const getFacetValue = (facetCode: string) => {
              const facet = event.facetValues.find(
                (fv) => fv.facet.code === facetCode
              );
              return facet ? facet.name : null;
            };

            return {
              id: event.id,
              title: event.name,
              slug: event.slug,
              description: event.description,
              facetValues: event.facetValues,
              // Basic event info
              date: eventDateFormatted,
              eventStartDate: cf.eventStartDate,
              eventEndDate: cf.eventEndDate,
              eventTime: cf.eventTime,
              location: cf.eventLocation,
              type: cf.eventType || getFacetValue("event-type"),
              organizer: cf.organiser,
              // Provider structure used by cards
              provider: {
                name: cf.organiser || "Event Organizer",
                logoUrl: undefined,
                description: "",
              },
              // Spread all custom fields so details page & cards can access them
              ...cf,
            };
          });

          // Deduplicate by id to prevent duplicate cards
          const uniqueMappedItems = Array.from(
            new Map(mappedItems.map((it) => [String(it.id), it])).values()
          );

          const filtered = uniqueMappedItems.filter((item: any) => {
            const matchesFilters = Object.keys(filters).every((filterKey) => {
              const selectedValues = filters[filterKey] || [];
              if (!selectedValues.length) return true;

              // Check against facetValues directly
              const hasFacetMatch = selectedValues.some(
                (selectedValue: string) => {
                  return item.facetValues.some(
                    (fv: any) =>
                      fv.facet.code === filterKey && fv.code === selectedValue
                  );
                }
              );

              switch (filterKey) {
                case "time-range": {
                  // Date-based filtering using eventStartDate
                  if (!item.eventStartDate) return false;
                  const eventDate = new Date(item.eventStartDate);
                  if (isNaN(eventDate.getTime())) return false;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const endOfToday = new Date(today);
                  endOfToday.setHours(23, 59, 59, 999);

                  const endOfWeek = new Date(today);
                  // Assume week = next 7 days including today
                  endOfWeek.setDate(endOfWeek.getDate() + 6);
                  endOfWeek.setHours(23, 59, 59, 999);

                  const endOf30Days = new Date(today);
                  endOf30Days.setDate(endOf30Days.getDate() + 29);
                  endOf30Days.setHours(23, 59, 59, 999);

                  return selectedValues.some((code: string) => {
                    switch (code) {
                      case "today":
                        return eventDate >= today && eventDate <= endOfToday;
                      case "this-week":
                        return eventDate >= today && eventDate <= endOfWeek;
                      case "next-30-days":
                        return eventDate >= today && eventDate <= endOf30Days;
                      case "custom-date-range":
                        // Custom date range not implemented; treat as pass-through for now
                        return true;
                      default:
                        return false;
                    }
                  });
                }
                case "event-type":
                case "delivery-mode":
                case "cost-type":
                case "duration-band":
                case "language":
                case "capability":
                case "business-stage":
                case "industry":
                  return hasFacetMatch;
                case "organizer":
                  // Organizer filtering via facet; special cases handled via backend config
                  return hasFacetMatch;
                default:
                  return hasFacetMatch || true;
              }
            });

            const lowerSearch = searchQuery.trim().toLowerCase();
            const matchesSearch =
              !lowerSearch ||
              item.title?.toLowerCase().includes(lowerSearch) ||
              item.description?.toLowerCase().includes(lowerSearch) ||
              item.location?.toLowerCase().includes(lowerSearch) ||
              item.type?.toLowerCase().includes(lowerSearch);

            return matchesFilters && matchesSearch;
          });

          setItems(uniqueMappedItems);
          setFilteredItems(filtered);
          setLoading(false);
          return;
        }

        // Handle Products (Financial, Non-Financial, and Courses)
        if (productData || marketplaceType === "business-services") {
          let mappedItems: any[] = [];

          // Handle business-services separately with Supabase
          if (marketplaceType === "business-services") {
            const services = await fetchNonFinancialServices();
            mappedItems = services.map((service) => ({
              id: service.id,
              title: service.name,
              slug: service.slug,
              description: service.description,
              facetValues: [
                {
                  code: service.service_type.toLowerCase().replace(/\s+/g, "-"),
                  name: service.service_type,
                  facet: { code: "service-type" },
                },
                {
                  code: service.service_category
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                  name: service.service_category,
                  facet: { code: "service-category" },
                },
                {
                  code: service.entity_type.toLowerCase().replace(/\s+/g, "-"),
                  name: service.entity_type,
                  facet: { code: "entity-type" },
                },
                { code: "dfsa", name: "DFSA", facet: { code: "provided-by" } },
              ],
              tags: service.tags,
              provider: {
                name: "DFSA",
                logoUrl: "/mzn_logo.png",
                description: "Dubai Financial Services Authority",
              },
              formUrl: "#",
              serviceType: service.service_type,
              serviceCategory: service.service_category,
              entityType: service.entity_type,
              processingTime: service.processing_time,
              details: {
                longDescription: service.long_description,
                benefits: service.benefits,
                requirements: service.requirements,
                processSteps: service.process_steps,
              },
            }));
          } else {
            // Handle other marketplace types (financial, courses)
            let filteredServices = productData?.products?.items || [];

            if (marketplaceType === "financial") {
              filteredServices = productData.products.items.filter((product) =>
                product.facetValues.some((fv) => fv.id === "1")
              );

              // If no products match, show all products
              if (filteredServices.length === 0) {
                filteredServices = productData.products.items;
              }
            } else if (marketplaceType === "courses") {
              console.log("=== COURSES FILTERING DEBUG ===");
              console.log(
                "All products before filtering:",
                productData.products.items.length
              );

              filteredServices = productData.products.items.filter((product) =>
                product.facetValues.some((fv) => fv.id === "72")
              );

              console.log(
                "Filtered courses after facet id '72' filter:",
                filteredServices.length
              );
              console.log(
                "Filtered course products:",
                filteredServices.map((p) => ({
                  id: p.id,
                  name: p.name,
                  facetValues: p.facetValues.map((fv) => ({
                    id: fv.id,
                    name: fv.name,
                  })),
                }))
              );
              console.log("===============================");
            }

            const fallbackLogos = ["/mzn_logo.png"];

            // Map product data to match expected MarketplaceItem structure
            mappedItems = filteredServices.map((product) => {
              const randomFallbackLogo =
                fallbackLogos[Math.floor(Math.random() * fallbackLogos.length)];

              // Handle course-specific mapping
              if (marketplaceType === "courses") {
                console.log("=== COURSE MAPPING DEBUG ===");
                console.log(
                  "Mapping course product:",
                  product.id,
                  product.name
                );
                console.log("Product customFields:", product.customFields);

                const rawCost = product.customFields?.Cost;
                const parsedCost =
                  typeof rawCost === "number"
                    ? rawCost
                    : parseFloat(String(rawCost ?? ""));
                const normalizedCost =
                  !isNaN(parsedCost) && parsedCost >= 1 ? parsedCost : 3200;

                const mappedCourse = {
                  id: product.id,
                  title: product.name,
                  slug: `courses/${product.id}`,
                  description:
                    product.description || "No description available",
                  facetValues: product.facetValues,
                  provider: {
                    name: product.customFields?.Partner || "Unknown Partner",
                    logoUrl:
                      product.customFields?.logoUrl || "/default_logo.png",
                    description: "No provider description available",
                  },
                  formUrl: null,
                  Cost: normalizedCost,
                  price: normalizedCost,
                  BusinessStage: product.customFields?.BusinessStage,
                  rating: product.customFields?.rating,
                  reviewCount: product.customFields?.reviewCount,
                  duration: product.customFields?.duration,
                  pricingModel: product.customFields?.pricingModel,
                  serviceCategory: product.customFields?.serviceCategory,
                  learningObjectives: product.customFields?.learningObjectives,
                  learningOutcomes: product.customFields?.learningOutcomes,
                  skillsGained: product.customFields?.skillsGained,
                  audience: product.customFields?.audience,
                  courseTimeline: product.customFields?.courseTimeline,
                  resources: product.customFields?.resources,
                  documentLink: product.customFields?.documentLink,
                  uponCompletion: product.customFields?.uponCompletion,
                  languages: product.customFields?.languages,
                  resourceType: product.customFields?.resourceType,
                  notes: product.customFields?.notes,
                  isFeatured: product.customFields?.isFeatured,
                  isOnline: product.customFields?.isOnline,
                  ...product.customFields,
                };

                console.log("Mapped course item:", mappedCourse);
                console.log("============================");

                return mappedCourse;
              }

              // Handle regular products (financial/non-financial)
              const rawFormUrl = product.customFields?.formUrl;
              const finalFormUrl =
                rawFormUrl || "https://www.tamm.abudhabi/en/login";

              if (product.id === "133" || !rawFormUrl) {
                console.log(
                  `Product "${product.name}" (ID: ${product.id}): Raw formUrl =`,
                  rawFormUrl,
                  "| Final =",
                  finalFormUrl
                );
              }

              return {
                id: product.id,
                title: product.name,
                slug: product.slug,
                description:
                  product.description ||
                  "Through this service, you can easily reallocate your approved loan funds to different areas of your business to support changing needs and enhance growth.",
                facetValues: product.facetValues,
                tags: [
                  product.customFields?.Industry,
                  product.customFields?.BusinessStage,
                ].filter(Boolean),
                provider: {
                  name: product.customFields?.Industry || "Khalifa Fund",
                  logoUrl: randomFallbackLogo,
                  description: "No provider description available",
                },
                formUrl: "https://www.tamm.abudhabi/en/login",
                ...product.customFields,
              };
            });
          }

          // Apply filters and search query
          const filtered = mappedItems.filter((product: any) => {
            const matchesAllFacets = Object.keys(filters).every((facetCode) => {
              const selectedValues = filters[facetCode] || [];
              if (!selectedValues.length) return true;

              return selectedValues.some(
                (selectedValue) =>
                  product.facetValues.some(
                    (facetValue: any) =>
                      facetValue.code === selectedValue &&
                      (!facetValue.facet?.code ||
                        facetValue.facet.code === facetCode)
                  ) ||
                  (facetCode === "pricing-model" &&
                    selectedValue === "one-time-fee" &&
                    product.Cost &&
                    product.Cost > 0) ||
                  (facetCode === "business-stage" &&
                    product.BusinessStage &&
                    selectedValue === product.BusinessStage)
              );
            });

            const matchesSearch =
              searchQuery.trim() === "" ||
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.facetValues.some((facetValue: any) =>
                facetValue.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              );

            return matchesAllFacets && matchesSearch;
          });

          // Prioritize ID 133
          const prioritized = filtered.sort((a, b) => {
            if (a.id === "133") return -1;
            if (b.id === "133") return 1;
            return 0;
          });

          console.log("filters:", filters);
          console.log("filteredItems:", prioritized);

          // Additional logging for courses
          if (marketplaceType === "courses") {
            console.log("=== FINAL COURSES RESULT ===");
            console.log("Total mapped items:", mappedItems.length);
            console.log("Total filtered items:", prioritized.length);
            console.log("Final course items:", prioritized);
            console.log("============================");
          }

          setItems(mappedItems);
          setFilteredItems(prioritized);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error processing ${marketplaceType} items:`, err);
        setError(`Failed to load ${marketplaceType}`);
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
      }
    };

    loadItems();
  }, [
    productData,
    eventData,
    filters,
    debouncedSearch,
    marketplaceType,
    activeFilters,
    filterConfig,
    loadKHInitial,
  ]);

  // Reset to page 1 when filters or search changes (non-KH only)
  useEffect(() => {
    if (marketplaceType !== "knowledge-hub") {
      setCurrentPage(1);
    }
  }, [filters, debouncedSearch, marketplaceType]);

  // Immediately hydrate compare from navigation state when arriving from details page
  useEffect(() => {
    const pending = location?.state?.addToCompare;
    if (pending) {
      // Add if not present and under cap
      if (
        !compareItems.some((c) => c.id === pending.id) &&
        compareItems.length < 3
      ) {
        setCompareItems((prev) => [...prev, pending]);
        storageAddCompareId(marketplaceType, pending.id);
      }
      // Clear the navigation state to avoid duplicate adds on back/refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state, location?.pathname, marketplaceType, compareItems]);

  // Hydrate compareItems from localStorage when items are available (merge, don't clear)
  useEffect(() => {
    if (!items || items.length === 0) return; // wait until items are loaded
    // Build a map for quick lookup
    const byId: Record<string, any> = {};
    items.forEach((it) => {
      byId[it.id] = it;
    });
    const storedIds = getStoredCompareIds(marketplaceType);
    if (!storedIds.length) return; // nothing stored; don't alter current state

    // Start with current selections
    const merged: ComparisonItem[] = [...compareItems];
    for (const id of storedIds) {
      if (merged.length >= 3) break;
      if (!merged.some((c) => c.id === id)) {
        const found = byId[id];
        if (found) merged.push(found);
      }
    }
    const currentIds = compareItems.map((i) => i.id).join(",");
    const nextIds = merged.map((i) => i.id).join(",");
    if (currentIds !== nextIds) {
      setCompareItems(merged.slice(0, 3));
    }
    setHasHydratedCompare(true);
  }, [items, marketplaceType, compareItems]);

  // Keep storage in sync with current compareItems
  useEffect(() => {
    // Don't sync to storage until we've attempted hydration to avoid wiping existing selections
    if (!hasHydratedCompare) return;
    const ids = compareItems.map((i) => i.id);
    setStoredCompareIds(marketplaceType, ids);
  }, [compareItems, marketplaceType, hasHydratedCompare]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      setFilters((prev) => {
        const currentValues = prev[filterType] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        const newFilters = {
          ...prev,
          [filterType]: newValues,
        };

        // If changing media type, clear format filter if it's no longer valid
        if (
          filterType === "mediaType" &&
          prev.format &&
          prev.format.length > 0
        ) {
          const mediaTypeFormatMapping: Record<string, string[]> = {
            News: ["Quick Reads"],
            Reports: ["In-Depth Reports", "Downloadable Templates"],
            "Toolkits & Templates": [
              "Interactive Tools",
              "Downloadable Templates",
            ],
            Guides: ["Quick Reads", "In-Depth Reports"],
            Videos: ["Recorded Media"],
            Podcasts: ["Recorded Media"],
          };

          const newMediaTypes = newFilters[filterType];
          if (newMediaTypes.length > 0) {
            const allowedFormats = newMediaTypes
              .flatMap((mt) => mediaTypeFormatMapping[mt] || [])
              .filter((v, i, self) => self.indexOf(v) === i); // Remove duplicates
            newFilters.format =
              newFilters.format?.filter((f) => allowedFormats.includes(f)) ||
              [];
          }
        }

        return newFilters;
      });
    },
    []
  );

  // Clear Knowledge Hub filters (URL params)
  const clearKnowledgeHubFilters = useCallback(() => {
    const next: Record<string, string> = {};
    queryParams.forEach((v, k) => {
      next[k] = v;
    });
    delete next.type;
    delete next.domain;
    delete next.stage;
    delete next.format;
    delete next.popularity;
    next.page = "1";
    next.perPage = String(perPage);
    setQueryParams(next);
  }, [queryParams, perPage, setQueryParams]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    const emptyFilters: Record<string, string[]> = {};
    filterConfig.forEach((config) => {
      emptyFilters[config.id] = [];
    });
    setFilters(emptyFilters);
    setSearchQuery("");
    setActiveFilters([]);

    // For knowledge-hub, also clear URL params
    if (marketplaceType === "knowledge-hub") {
      clearKnowledgeHubFilters();
    }
  }, [filterConfig, marketplaceType, clearKnowledgeHubFilters]);

  // Toggle sidebar visibility (only on mobile)
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Clear all comparison selections
  const handleClearComparison = useCallback(() => {
    setCompareItems([]);
    storageClearCompare(marketplaceType);
    setShowComparison(false);
  }, [marketplaceType]);

  // Toggle bookmark for an item
  const toggleBookmark = useCallback((itemId: string) => {
    setBookmarkedItems((prev) => {
      return prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
    });
  }, []);

  // Add an item to comparison
  const handleAddToComparison = useCallback(
    (item: any) => {
      if (
        compareItems.length < 3 &&
        !compareItems.some((c) => c.id === item.id)
      ) {
        setCompareItems((prev) => [...prev, item]);
        storageAddCompareId(marketplaceType, item.id);
      }
    },
    [compareItems, marketplaceType]
  );

  // Remove an item from comparison
  const handleRemoveFromComparison = useCallback(
    (itemId: string) => {
      setCompareItems((prev) => prev.filter((item) => item.id !== itemId));
      storageRemoveCompareId(marketplaceType, itemId);
    },
    [marketplaceType]
  );

  // Retry loading items after an error
  const retryFetch = useCallback(() => {
    setError(null);
    setLoading(true);
  }, []);

  // Filter the format options based on selected media type for knowledge-hub
  const filteredKnowledgeHubConfig = useMemo(() => {
    if (marketplaceType !== "knowledge-hub") {
      return filterConfig;
    }

    // Find all selected media types from activeFilters
    const mediaTypeFilter = filterConfig.find((c) => c.id === "mediaType");
    const selectedMediaTypes =
      mediaTypeFilter?.options
        .filter((opt) => activeFilters.includes(opt.name))
        .map((opt) => opt.name) || [];

    return filterConfig.map((config) => {
      // Only filter the Format category if at least one Media Type is selected
      if (config.id === "format" && selectedMediaTypes.length > 0) {
        // Aggregate all allowed formats from all selected media types
        const allAllowedFormats = new Set<string>();
        selectedMediaTypes.forEach((mediaType) => {
          const allowedFormats = MEDIA_TYPE_FORMAT_MAPPING[mediaType];
          if (allowedFormats) {
            allowedFormats.forEach((format) => allAllowedFormats.add(format));
          }
        });

        // Filter to only show formats that are allowed by at least one selected media type
        return {
          ...config,
          options: config.options.filter((option) =>
            allAllowedFormats.has(option.name)
          ),
        };
      }
      return config;
    });
  }, [filterConfig, activeFilters, marketplaceType]);

  // Handle Knowledge Hub specific filter changes
  const handleKnowledgeHubFilterChange = useCallback(
    (filter: string) => {
      // Determine which category this filter belongs to
      const category = filterConfig.find((c) =>
        c.options.some((o) => o.name === filter)
      );
      if (!category) return;
      const next: Record<string, string> = {};
      queryParams.forEach((v, k) => {
        next[k] = v;
      });
      const toggle = (key: string, value: string) => {
        const current = next[key] ? next[key].split(",").filter(Boolean) : [];
        const exists = current.includes(value);
        const list = exists
          ? current.filter((v) => v !== value)
          : [...current, value];
        if (list.length > 0) next[key] = list.join(",");
        else delete next[key];
      };
      if (category.id === "mediaType") {
        // Custom behavior for Media Type:
        // - Article is exclusive of News/Guides (it is the parent type)
        // - News/Guides map to Article type + specific formats
        const mediaTypeCat = filterConfig.find((c) => c.id === "mediaType");
        const allUiTypes = new Set<string>(
          (mediaTypeCat?.options || []).map((o) => o.name)
        );
        const currentlySelected = new Set<string>(
          activeFilters.filter((f) => allUiTypes.has(f))
        );
        if (currentlySelected.has(filter)) currentlySelected.delete(filter);
        else currentlySelected.add(filter);

        // Exclusivity: if Article is selected, drop News/Guides from the UI selection
        if (currentlySelected.has("Article")) {
          currentlySelected.delete("News");
          currentlySelected.delete("Guides");
        } else {
          // If selecting News or Guides, ensure Article isn't kept simultaneously
          if (filter === "News" || filter === "Guides") {
            currentlySelected.delete("Article");
          }
        }

        // Compute final DB types set and format set from selected UI types
        const finalTypes = new Set<string>();
        const existingFormats = new Set<string>(
          next.format ? next.format.split(",").filter(Boolean) : []
        );
        // Remove our managed article formats; we will re-add based on selection
        existingFormats.delete("Quick Reads");
        existingFormats.delete("In-Depth Reports");

        // If Article is selected, do NOT infer News/Guides formats; keep broad Article
        if (currentlySelected.has("Article")) {
          finalTypes.add("Article");
        } else {
          currentlySelected.forEach((ui) => {
            const db = toDbType(ui);
            if (db) finalTypes.add(db);
            // Enrich formats selectively:
            // - News -> Quick Reads only
            // - Guides -> In-Depth Reports only
            if (ui === "News") existingFormats.add("Quick Reads");
            if (ui === "Guides") existingFormats.add("In-Depth Reports");
          });
        }

        if (finalTypes.size > 0) next.type = Array.from(finalTypes).join(",");
        else delete next.type;
        if (existingFormats.size > 0)
          next.format = Array.from(existingFormats).join(",");
        else delete next.format;
      } else if (category.id === "category" || category.id === "domain") {
        toggle("domain", filter);
      } else if (category.id === "businessStage") {
        toggle("stage", filter);
      } else if (category.id === "format") {
        toggle("format", filter);
      } else if (category.id === "popularity") {
        toggle("popularity", filter);
      }
      // Reset to page 1 when filters change
      next.page = "1";
      // Persist perPage to keep consistent page sizing
      next.perPage = String(perPage);
      setQueryParams(next);
    },
    [filterConfig, queryParams, perPage, setQueryParams, activeFilters]
  );

  // Toggle collapse state for a filter category
  const toggleCategoryCollapse = useCallback((categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Apply client-side filters/search to Knowledge Hub items (keeps UI parity)
  useEffect(() => {
    if (marketplaceType !== "knowledge-hub") return;
    const normalize = (str: string): string => {
      const s = String(str || "")
        .toLowerCase()
        .trim();
      return s.endsWith("s") ? s.slice(0, -1) : s;
    };
    const filtersByCategory: Record<string, string[]> = {};
    activeFilters.forEach((val) => {
      const category = filterConfig.find((cat) =>
        cat.options.some((o) => o.name === val)
      );
      if (category) {
        if (!filtersByCategory[category.id])
          filtersByCategory[category.id] = [];
        filtersByCategory[category.id].push(val);
      }
    });
    const matchesActiveFilters = (it: any): boolean => {
      if (Object.keys(filtersByCategory).length === 0) return true;
      const itemValues: Record<string, string | undefined> = {
        mediaType: it.mediaType,
        category: it.domain,
        format: it.format,
        popularity: it.popularity,
        businessStage: it.businessStage,
      };
      return Object.keys(filtersByCategory).every((catId) => {
        const vals = filtersByCategory[catId];
        const itemVal = itemValues[catId];
        if (!itemVal) return false; // no tag fallback
        if (catId === "mediaType") {
          // Compare canonical DB types. Map UI labels (e.g., Toolkits & Templates) → Tool
          const itemType = String(itemVal).trim();
          const selectedDbTypes = vals
            .map((v) => toDbType(v))
            .filter(Boolean)
            .map((v) => String(v).toLowerCase());
          return (
            selectedDbTypes.length === 0 ||
            selectedDbTypes.includes(itemType.toLowerCase())
          );
        }
        return vals.some((f) => normalize(itemVal) === normalize(f));
      });
    };
    const s = debouncedSearch.toLowerCase();
    const filteredKH = items.filter((it) => {
      const matchesSearch =
        !s ||
        it.title?.toLowerCase().includes(s) ||
        it.description?.toLowerCase().includes(s) ||
        (Array.isArray(it.tags) &&
          it.tags.some((t: string) => String(t).toLowerCase().includes(s)));
      return matchesSearch && matchesActiveFilters(it);
    });
    setFilteredItems(filteredKH);
  }, [marketplaceType, items, activeFilters, filterConfig, debouncedSearch]);

  // Render error fallback if config failed to load
  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Page
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load the {marketplaceType} marketplace. Please try again
            later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">
                  {config.itemNamePlural}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
        </div>
        <p className="text-gray-600 mb-6">{config.description}</p>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="w-full ">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        {/* Comparison bar */}
        {compareItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-blue-800">
                {config.itemName} Comparison ({compareItems.length}/3)
              </h3>
              <div>
                <button
                  onClick={() => setShowComparison(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                >
                  Compare Selected
                </button>
                <button
                  onClick={handleClearComparison}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-full px-3 py-1 flex items-center gap-2 text-sm border border-gray-200"
                >
                  <span className="truncate max-w-[150px]">{item.title}</span>
                  <button
                    onClick={() => handleRemoveFromComparison(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${item.title} from comparison`}
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div
            className="xl:hidden sticky z-20 bg-gray-50 py-2 shadow-sm"
            style={{ top: "46px" }}
          >
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {(Object.values(filters).some((f) => f.length > 0) ||
                activeFilters.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-x-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
            style={{ top: headerHeight, bottom: 0 }}
          >
            <div
              id="filter-sidebar"
              className={`fixed left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              style={{ top: headerHeight, bottom: 0 }}
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={toggleFilters}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  {marketplaceType === "knowledge-hub" ? (
                    <div className="space-y-4">
                      {filteredKnowledgeHubConfig.map((category) => (
                        <div
                          key={category.id}
                          className="border-b border-gray-100 pb-3"
                        >
                          <h3 className="font-medium text-gray-900 mb-2">
                            {category.title}
                          </h3>
                          <div className="space-y-2">
                            {category.options.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  id={`mobile-${category.id}-${option.id}`}
                                  checked={activeFilters.includes(option.name)}
                                  onChange={() =>
                                    handleKnowledgeHubFilterChange(option.name)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor={`mobile-${category.id}-${option.id}`}
                                  className="ml-2 text-xs text-gray-700"
                                >
                                  {option.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FilterSidebar
                      filters={filters}
                      filterConfig={filterConfig}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                      isResponsive={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop - always visible */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold">Filters</h2>
                {(Object.values(filters).some((f) => f.length > 0) ||
                  activeFilters.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {marketplaceType === "knowledge-hub" ? (
                  <div className="space-y-2">
                    {filteredKnowledgeHubConfig.map((category) => {
                      const isCollapsed = collapsedCategories[category.id];
                      const hasActiveFilters = category.options.some((opt) =>
                        activeFilters.includes(opt.name)
                      );
                      return (
                        <div
                          key={category.id}
                          className="border-b border-gray-100 pb-2"
                        >
                          <button
                            onClick={() => toggleCategoryCollapse(category.id)}
                            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition-colors"
                            aria-expanded={!isCollapsed}
                          >
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                              {category.title}
                              {hasActiveFilters && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  {
                                    category.options.filter((opt) =>
                                      activeFilters.includes(opt.name)
                                    ).length
                                  }
                                </span>
                              )}
                            </h3>
                            {isCollapsed ? (
                              <ChevronDownIcon
                                size={18}
                                className="text-gray-500"
                              />
                            ) : (
                              <ChevronUpIcon
                                size={18}
                                className="text-gray-500"
                              />
                            )}
                          </button>
                          {!isCollapsed && (
                            <div className="space-y-2 mt-2 ml-1">
                              {category.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    id={`desktop-${category.id}-${option.id}`}
                                    checked={activeFilters.includes(
                                      option.name
                                    )}
                                    onChange={() =>
                                      handleKnowledgeHubFilterChange(
                                        option.name
                                      )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label
                                    htmlFor={`desktop-${category.id}-${option.id}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <FilterSidebar
                    filters={filters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={false}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {loading || (marketplaceType === "knowledge-hub" && khFetching) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => (
                  <CourseCardSkeleton key={idx} />
                ))}
              </div>
            ) : error || (!skipGraph && (facetError || productError)) ? (
              <ErrorDisplay
                message={
                  error ||
                  (!skipGraph &&
                    (facetError?.message || productError?.message)) ||
                  `Failed to load ${marketplaceType}`
                }
                onRetry={retryFetch}
              />
            ) : filteredItems.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                <p className="mb-2">No service available</p>
                <p className="text-sm text-gray-400">
                  Check browser console for debugging info
                </p>
              </div>
            ) : (
              <div ref={gridContainerRef}>
                <MarketplaceGrid
                  items={paginatedItems}
                  marketplaceType={marketplaceType}
                  bookmarkedItems={bookmarkedItems}
                  onToggleBookmark={toggleBookmark}
                  onAddToComparison={handleAddToComparison}
                  promoCards={promoCards}
                  totalCount={undefined}
                  showingCount={undefined}
                />
                {marketplaceType === "knowledge-hub" ? (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => goToKHPage(currentPage - 1)}
                      disabled={currentPage <= 1 || khFetching}
                      className={`px-3 py-2 rounded-md border ${
                        currentPage <= 1 || khFetching
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of{" "}
                      {Math.max(1, Math.ceil((khTotalCount || 0) / perPage))}
                    </span>
                    <button
                      onClick={() => goToKHPage(currentPage + 1)}
                      disabled={
                        currentPage >=
                          Math.max(
                            1,
                            Math.ceil((khTotalCount || 0) / perPage)
                          ) || khFetching
                      }
                      className={`px-3 py-2 rounded-md border ${
                        currentPage >=
                          Math.max(
                            1,
                            Math.ceil((khTotalCount || 0) / perPage)
                          ) || khFetching
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage <= 1}
                        className={`px-3 py-2 rounded-md border ${
                          currentPage <= 1
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage >= totalPages}
                        className={`px-3 py-2 rounded-md border ${
                          currentPage >= totalPages
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison modal */}
        {showComparison && (
          <MarketplaceComparison
            items={compareItems}
            onClose={() => setShowComparison(false)}
            onRemoveItem={handleRemoveFromComparison}
            marketplaceType={marketplaceType}
          />
        )}
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default MarketplacePage;
