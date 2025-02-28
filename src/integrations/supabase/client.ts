
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rspxqsnfnbshmchqksty.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzcHhxc25mbmJzaG1jaHFrc3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzMxOTksImV4cCI6MjA1NjI0OTE5OX0.RfugUCm9GTFwuJ4XHpiT7SAAqFKVxbC-VYcrOfxTV7M";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
