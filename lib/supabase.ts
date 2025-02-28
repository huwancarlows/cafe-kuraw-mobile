import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://iajwawjvypettxixeemq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhandhd2p2eXBldHR4aXhlZW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzg2ODcsImV4cCI6MjA1NDg1NDY4N30.Q_YznFlUfoSkUR9chnECRMt2YJATvmYZgFyiH3C5boY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})