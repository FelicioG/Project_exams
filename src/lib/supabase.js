import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const dbHelpers = {
  // Get all faculties
  async getFaculties() {
    const { data, error } = await supabase
      .from('faculties')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Get subjects by faculty
  async getSubjectsByFaculty(facultyId) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('faculty_id', facultyId)
      .order('name')
    
    if (error) throw error
    return data
  },

  // Get papers by subject
  async getPapersBySubject(subjectId) {
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .eq('subject_id', subjectId)
      .order('year', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Check user subscription status
  async checkSubscription(userId) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Log paper access
  async logPaperAccess(userId, paperId) {
    const { error } = await supabase
      .from('paper_access_logs')
      .insert({
        user_id: userId,
        paper_id: paperId,
        accessed_at: new Date().toISOString()
      })
    
    if (error) throw error
  }
}