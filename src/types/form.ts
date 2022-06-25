export type RequestSignupData = {
  email: string
  password: string
  company_name: string
}

export type RequestSigninData = Omit<RequestSignupData, 'company_name'>
