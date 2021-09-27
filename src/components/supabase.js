import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonkey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseURL, supabaseAnonkey);

export default supabase;
