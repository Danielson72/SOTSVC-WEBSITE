import { createClient } from '@supabase/supabase-js'

// Public Supabase credentials (anon key is safe to expose - RLS protects data)
const supabaseUrl = 'https://jvznxszxlqtvizpjokav.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2em54c3p4bHF0dml6cGpva2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNTk0MDgsImV4cCI6MjA1MDkzNTQwOH0.qAif43DwA-QQ-A2a8U4KnnuHCrMvWfb6I7AUJQrKCL4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
