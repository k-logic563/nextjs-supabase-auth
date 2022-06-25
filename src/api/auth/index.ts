import { supabase } from '../../lib/supabase'
import { RequestSignupData, RequestSigninData } from '../../types/form'

export const signup = (data: RequestSignupData) => {
  const requiredData = {
    email: data.email,
    password: data.password,
  }

  const metaData = {
    company_name: data.company_name,
  }

  return supabase.auth.signUp(requiredData, {
    data: metaData,
  })
}

export const signin = (data: RequestSigninData) => {
  return supabase.auth.signIn(data)
}

export const signout = () => {
  return supabase.auth.signOut()
}
