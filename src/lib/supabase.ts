import { createClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SB_API_URL || ''
const ANON_KEY = process.env.NEXT_PUBLIC_SB_ANON_KEY || ''

export const supabase = createClient(URL, ANON_KEY)
