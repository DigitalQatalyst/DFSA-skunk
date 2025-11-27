// Mock API service for Enterprise Journey
import { mockHeroData, mockGrowthAreas, mockMapLocations, mockBusinessInsights, mockInvestmentOpportunities, mockEconomicIndicators, mockEventCalendar, mockNewsItems } from './mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';
// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// Add some randomness to API delays to simulate network variability
const randomDelay = () => delay(500 + Math.random() * 1000);
// API functions with artificial delay to simulate network requests
export const fetchHeroData = async () => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('hero').select('*').single();
    if (!error && data) return data;
    console.warn('Supabase hero fallback:', error?.message);
  }
  await randomDelay();
  return mockHeroData;
};
export const fetchGrowthAreas = async (filter?: string) => {
  if (isSupabaseConfigured) {
    let query = supabase.from('growth_areas').select('*');
    if (filter && filter.trim()) {
      const like = `%${filter}%`;
      query = query.or(`title.ilike.${like},description.ilike.${like}`);
    }
    const { data, error } = await query;
    if (!error && data) return data;
    console.warn('Supabase growth_areas fallback:', error?.message);
  }
  await randomDelay();
  if (filter) {
    return mockGrowthAreas.filter(area => area.title.toLowerCase().includes(filter.toLowerCase()) || area.description.toLowerCase().includes(filter.toLowerCase()));
  }
  return mockGrowthAreas;
};
export const fetchDirectoryItems = async (options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  // Remove mock fallback: require Supabase to be configured and the table to exist
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }

  const page = options?.page || 1;
  const limit = options?.limit || 6;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('directory_items')
    .select('*', { count: 'exact' })
    .range(from, to);

  if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category);
  }
  if (options?.search) {
    const like = `%${options.search}%`;
    // Support filtering by both snake_case and potential alias columns
    query = query.or(
      `name.ilike.${like},category.ilike.${like},location.ilike.${like},address.ilike.${like}`
    );
  }

  const { data, error, count } = await query;
  if (error) {
    throw error;
  }
  return {
    items: data ?? [],
    total: typeof count === 'number' ? count : data?.length ?? 0,
    page,
    totalPages: Math.ceil(((typeof count === 'number' ? count : data?.length ?? 0) || 0) / limit) || 1,
  };
};
export const fetchMapLocations = async (region?: string) => {
  if (isSupabaseConfigured) {
    let query = supabase.from('map_locations').select('*');
    if (region) query = query.eq('region', region);
    const { data, error } = await query;
    if (!error && data) return data;
    console.warn('Supabase map_locations fallback:', error?.message);
  }
  await randomDelay();
  if (region) {
    return mockMapLocations.filter(location => location.region === region);
  }
  return mockMapLocations;
};

export const fetchBusinessMapData = async (type?: string) => {
  if (isSupabaseConfigured) {
    let query = supabase.from('business_map_data').select('*');
    if (type) query = query.eq('type', type);
    const { data, error } = await query;
    if (!error && data) return data;
    console.warn('Supabase business_map_data fallback:', error?.message);
  }
  await randomDelay();
  // Return empty array as fallback - HeroSection has its own hardcoded data
  return [];
};
export const fetchBusinessInsights = async (sector?: string) => {
  await randomDelay();
  if (sector) {
    return mockBusinessInsights.filter(insight => insight.sector === sector);
  }
  return mockBusinessInsights;
};
export const fetchInvestmentOpportunities = async (options?: {
  sector?: string;
  minInvestment?: number;
  maxInvestment?: number;
}) => {
  await randomDelay();
  let results = [...mockInvestmentOpportunities];
  if (options?.sector) {
    results = results.filter(opportunity => opportunity.sector === options.sector);
  }
  if (options?.minInvestment !== undefined) {
    results = results.filter(opportunity => opportunity.investmentAmount >= options.minInvestment);
  }
  if (options?.maxInvestment !== undefined) {
    results = results.filter(opportunity => opportunity.investmentAmount <= options.maxInvestment);
  }
  return results;
};
export const fetchEconomicIndicators = async (year?: number) => {
  await randomDelay();
  if (year) {
    return mockEconomicIndicators.filter(indicator => indicator.year === year);
  }
  return mockEconomicIndicators;
};
export const fetchEventCalendar = async (options?: {
  month?: number;
  category?: string;
}) => {
  await randomDelay();
  let results = [...mockEventCalendar];
  if (options?.month !== undefined) {
    results = results.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === options.month;
    });
  }
  if (options?.category) {
    results = results.filter(event => event.category === options.category);
  }
  return results;
};
export const fetchNewsItems = async (options?: {
  category?: string;
  limit?: number;
}) => {
  await randomDelay();
  let results = [...mockNewsItems];
  if (options?.category) {
    results = results.filter(news => news.category === options.category);
  }
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }
  return results;
};
