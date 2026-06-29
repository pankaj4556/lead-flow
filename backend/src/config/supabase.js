const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabaseClient = null;
let isDemoMode = false;

// Basic validation: Check if keys are defined and not placeholders
if (!supabaseUrl || !supabaseKey || 
    supabaseUrl.includes('your-project-id') || 
    supabaseKey.includes('your-supabase-service-role-or-anon-key')) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: Supabase credentials are not configured or are set to placeholders.');
  console.warn('\x1b[36m%s\x1b[0m', '💡 Running backend in DEMO MODE (In-memory storage). Data will reset on server restart.');
  isDemoMode = true;
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('\x1b[32m%s\x1b[0m', '🚀 Connected to Supabase Database successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
    console.warn('\x1b[36m%s\x1b[0m', '💡 Falling back to DEMO MODE (In-memory storage).');
    isDemoMode = true;
  }
}

module.exports = {
  supabase: supabaseClient,
  isDemoMode
};
