import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cecvbnwgkprtglvwcomf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlY3Zibndna3BydGdsdndjb21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTAwNTMsImV4cCI6MjA2NjQyNjA1M30.0v5KpUDmYb1DYto6whnlvPWj904IZcKN_4LimW2gc28'

export const supabase = createClient(supabaseUrl, supabaseKey)
