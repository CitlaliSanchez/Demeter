import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nylcukcxkmiaduscpubv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bGN1a2N4a21pYWR1c2NwdWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzk2MzQsImV4cCI6MjA2Njk1NTYzNH0.YjwgBxRSf715u0XWnn_GQIZQaJpcZ4cU_I9RzJrqFts';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
