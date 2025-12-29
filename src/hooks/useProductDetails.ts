import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT } from "../services/marketplaceQueries";
import {
  getFallbackItemDetails,
  getFallbackItems,
} from "../utils/fallbackData";
import { mockServicesData } from "../data/mockServicesData";

// Normalize eligibility display to the first non-empty segment before a semicolon
const normalizeEligibility = (val: any): string | undefined => {
  if (Array.isArray(val)) {
    const first = val.find((e: any) => typeof e === "string" && e.trim() !== "");
    return first ? String(first).split(";")[0].trim() : undefined;
  }
  if (typeof val === "string") {
    return val.split(";")[0].trim();
  }
  return undefined;
};

// Extract a human-readable document name without extension
const normalizeDocumentName = (raw: string): string => {
  if (!raw) return "";
  // Remove query/hash
  let s = raw.split("#")[0].split("?")[0];
  // Extract basename from URL or path
  const parts = s.split(/[/\\]/);
  s = parts[parts.length - 1] || s;
  // If there's no dot or it's a hidden file like ".env", just return trimmed
  if (!/\./.test(s.replace(/^\.+/, ""))) return s.trim();
  // Strip last extension
  s = s.replace(/\.[^.\/\\]+$/, "");
  return s.trim();
};

export interface UseProductDetailsArgs {
  itemId?: string;
  marketplaceType: "courses" | "financial" | "non-financial" | "knowledge-hub";
  shouldTakeAction?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  [key: string]: any;
}

export function useProductDetails({
  itemId,
  marketplaceType,
  shouldTakeAction,
}: UseProductDetailsArgs) {
  const [item, setItem] = useState<ProductItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  // Query product details (all types including courses)
  const {
    data: productData,
    error: productError,
    loading: productLoading,
    refetch: refetchProduct,
  } = useQuery(GET_PRODUCT, {
    variables: { id: itemId || "" },
    skip: !itemId,
  });
  // Partner details query disabled - backend doesn't support this query yet
  // Courses now use GET_PRODUCT query - removed separate GET_COURSE query

  const mapProductToItem = (product: any): ProductItem | null => {
    if (!product) return null;
    const cf = (product as any).customFields || {};
    // Resolve provider logo strictly from CustomFields.Logo.source
    const logoFromCFArray = Array.isArray(cf.Logo)
      ? (cf.Logo[0] as any)?.source
      : undefined;
    const logoFromCFObject = !Array.isArray(cf.Logo)
      ? (cf.Logo as any)?.source
      : undefined;
    const toAbsolute = (url?: string) => {
      if (!url) return undefined;
      if (/^https?:\/\//i.test(url)) return url;
      const base = (import.meta as any)?.env?.VITE_ASSETS_BASE_URL || "";
      if (base) {
        const trimmedBase = String(base).replace(/\/$/, "");
        return `${trimmedBase}${url}`;
      }
      return url; // fallback: hope it's valid as-is
    };
    const logoFromCustomFields = cf.logoUrl;

    const resolvedLogo =
      toAbsolute(logoFromCustomFields) ||
      toAbsolute(logoFromCFArray) ||
      toAbsolute(logoFromCFObject) ||
      "/mzn_logo.png";

    return {
      id: product.id,
      title: product.name,
      description: product.description,
      category: cf.Industry,
      businessStage: cf.BusinessStage,
      serviceType: cf.CustomerType,
      price: cf.Cost,
      processingTime: cf.ProcessingTime,
      amount: cf.Cost,
      interestRate: cf.InterestRate,
      serviceApplication: cf.ServiceApplication,
      // URL/path to the application form
      formUrl: typeof cf.formUrl === "string" ? cf.formUrl.trim() : undefined,
      // Eligibility mapping for EligibilityTermsTab
      eligibilityCriteria: Array.isArray(cf.Eligibility)
        ? cf.Eligibility.filter((e: any) => typeof e === "string" && e.trim() !== "")
        : undefined,
      eligibility: normalizeEligibility(cf.Eligibility),
      // Highlights/details mapping
      // Prefer KeyHighlights when present; otherwise fall back to Steps or TermsOfService
      details: Array.isArray(cf.KeyHighlights)
        ? cf.KeyHighlights
        : typeof cf.KeyHighlights === "string" && cf.KeyHighlights.trim() !== ""
          ? [cf.KeyHighlights]
          : Array.isArray(cf.Steps)
            ? cf.Steps
            : typeof cf.Steps === "string" && cf.Steps.trim() !== ""
              ? [cf.Steps]
              : typeof cf.TermsOfService === "string" && cf.TermsOfService.trim() !== ""
                ? [cf.TermsOfService]
                : [],
      // Expose learning outcomes - prefer course-specific fields when available
      learningOutcomes: Array.isArray(cf.learningOutcomes)
        ? cf.learningOutcomes
        : Array.isArray(cf.KeyHighlights)
          ? cf.KeyHighlights
          : typeof cf.KeyHighlights === "string" && cf.KeyHighlights.trim() !== ""
            ? [cf.KeyHighlights]
            : [],
      requiredDocuments: Array.isArray(cf.RequiredDocuments)
        ? cf.RequiredDocuments
          .map((d: any) => {
            if (typeof d === "string") return normalizeDocumentName(d);
            const raw = d?.name || d?.source || "";
            return normalizeDocumentName(raw);
          })
          .filter((s: string) => !!s)
        : [],
      // Normalize application process steps from CustomFields.Steps
      applicationProcess: Array.isArray(cf.Steps)
        ? cf.Steps
          .map((s: any) => {
            if (typeof s === "string") {
              return { title: s, description: "" };
            }
            if (s && typeof s === "object") {
              const title =
                typeof s.title === "string" && s.title.trim() !== ""
                  ? s.title.trim()
                  : typeof s.name === "string" && s.name.trim() !== ""
                    ? s.name.trim()
                    : "";
              const description =
                typeof s.description === "string" ? s.description : "";
              return { title, description };
            }
            return { title: "", description: "" };
          })
          .filter((x: any) => x.title !== "")
        : undefined,
      // Prefer new fields for terms when available
      keyTerms:
        (Array.isArray(cf.KeyTermsOfService)
          ? cf.KeyTermsOfService.join(", ")
          : cf.KeyTermsOfService) ||
        (Array.isArray(cf.TermsOfService)
          ? cf.TermsOfService.join(", ")
          : cf.TermsOfService),
      additionalTerms: Array.isArray(cf.AdditionalTermsOfService)
        ? cf.AdditionalTermsOfService
        : cf.AdditionalTermsOfService
          ? [cf.AdditionalTermsOfService]
          : undefined,
      tags: [cf.Industry, cf.CustomerType, cf.BusinessStage, cf.serviceCategory].filter(Boolean),
      // Course-specific fields from GET_PRODUCTS customFields
      learningObjectives: cf.learningObjectives || [],
      skillsGained: cf.skillsGained || [],
      audience: cf.audience,
      duration: cf.duration,
      courseTimeline: cf.courseTimeline,
      resources: cf.resources || [],
      documentLink: cf.documentLink,
      uponCompletion: cf.uponCompletion,
      rating: cf.rating,
      reviewCount: cf.reviewCount,
      languages: cf.languages || [],
      pricingModel: cf.pricingModel,
      serviceCategory: cf.serviceCategory,
      resourceType: cf.resourceType,
      notes: cf.notes,
      isFeatured: cf.isFeatured,
      isOnline: cf.isOnline,
      provider: {
        // Prefer explicit Partner field from customFields, otherwise fallback to Khalifa Fund
        name:
          (typeof cf.Partner === "string" && cf.Partner.trim() !== ""
            ? cf.Partner.trim()
            : undefined) || "Khalifa Fund",
        logoUrl: resolvedLogo,
      },
      providerLocation: "UAE",
    } as any;
  };
  // Removed mapCourseToItem function - courses now use mapProductToItem with course-specific fields

  useEffect(() => {
    if (!itemId) return;

    if (marketplaceType === 'non-financial') {
      const mockItem = mockServicesData.find(s => s.id === itemId);
      if (mockItem) {
        setItem({
          id: mockItem.id,
          title: mockItem.name,
          description: mockItem.details.longDescription || mockItem.description,
          provider: {
            name: "DFSA",
            logoUrl: "/mzn_logo.png",
          },
          tags: mockItem.customFields.tags,
          ...mockItem.customFields,
          details: mockItem.details.benefits || [], // Using benefits as details/highlights
          keyHighlights: mockItem.details.benefits || [],
          requiredDocuments: mockItem.details.requirements || [],
          applicationProcess: mockItem.details.processSteps || [],
          eligibility: "N/A", // Mock data doesn't have explicit eligibility
          eligibilityCriteria: [],
          formUrl: "#",
        });
        setRelatedItems(mockServicesData.filter(s => s.id !== itemId).slice(0, 3).map(s => ({
          id: s.id,
          title: s.name,
          description: s.description,
          provider: {
            name: "DFSA",
            logoUrl: "/mzn_logo.png",
          },
          tags: s.customFields.tags
        })));
        return;
      }
    }

    const product = (productData as any)?.product;

    // Use product data for all marketplace types including courses
    const raw = product;

    if (!raw) {
      // fallback path if no item in response
      const fallback = getFallbackItemDetails(
        marketplaceType,
        itemId || "fallback-1"
      );
      if (fallback) {
        setItem(fallback);
        setRelatedItems(getFallbackItems(marketplaceType));
      }
      return;
    }

    // For courses, we now use the same product structure but may need different mapping
    const mapped = marketplaceType === "courses" ? mapProductToItem(raw) : mapProductToItem(raw);
    if (!mapped) return;

    // merge with fallback to fill gaps
    const fallbackForItem = getFallbackItemDetails(
      marketplaceType,
      itemId || "fallback-1"
    );
    // Start with mapped data, only fill gaps with fallback
    const merged: any = { ...mapped };
    if (fallbackForItem) {
      for (const key of Object.keys(fallbackForItem)) {
        // Never override provider with fallback data
        if (key === 'provider') continue;

        const val = merged[key];
        const shouldUseFallback =
          val === undefined ||
          val === null ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "string" && val.trim() === "");
        if (shouldUseFallback) {
          merged[key] = (fallbackForItem as any)[key];
        }
      }
    }
    // Ensure provider from mapped data is always used
    merged.provider = (mapped as any).provider;

    // Ensure eligibility is shortened even if it came from fallback
    merged.eligibility = normalizeEligibility(merged.eligibility) ?? merged.eligibility;

    setItem(merged);

    // For products we may have related services from GQL; for courses fallback for now
    let limitedRelated: any[] = [];
    if (marketplaceType !== "courses") {
      const rs = product?.customFields?.RelatedServices;
      const relatedFromGql = Array.isArray(rs)
        ? rs.map((x: any) => ({
          id: x.id,
          title: x.name,
          description: x.description || "",
          provider: {
            name: merged.provider?.name,
            logoUrl: merged.provider?.logoUrl || "/mzn_logo.png",
          },
          tags: [],
        }))
        : [];
      limitedRelated = relatedFromGql.slice(0, 3);
    }
    const fallbackLimited = getFallbackItems(marketplaceType).slice(0, 3);
    const chosen = limitedRelated.length > 0 ? limitedRelated : fallbackLimited;
    const normalized = chosen
      .filter((x: any) => x?.id !== merged.id) // avoid showing the same item as related
      .slice(0, 3)
      .map((x: any) => ({
        id: x.id,
        title: x.title || x.name || "Related Service",
        description: x.description || "",
        provider: {
          name: x.provider?.name || merged.provider?.name || "Service Provider",
          logoUrl:
            x.provider?.logoUrl || merged.provider?.logoUrl || "/mzn_logo.png",
        },
        tags: Array.isArray(x.tags) ? x.tags : [],
      }));
    setRelatedItems(normalized);

    if (shouldTakeAction) {
      setTimeout(() => {
        document
          .getElementById("action-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [productData, itemId, marketplaceType, shouldTakeAction]);
  // Expose a unified loading/error/refetch
  const loading = productLoading;
  const error = productError as any;
  const refetch = refetchProduct;

  return {
    item,
    relatedItems,
    loading,
    error,
    refetch,
  } as const;
}
