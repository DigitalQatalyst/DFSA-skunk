import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getSupabase as getSupabaseDefault,
  isSupabaseConfigured as isSupabaseDefaultConfigured,
} from './defaultClient';

export { getSupabaseDefault, isSupabaseDefaultConfigured };

// Knowledge Hub client: isolated envs, never falls back to default
export { getSupabaseKnowledgeHub, isSupabaseKHConfigured } from './khubClient';
