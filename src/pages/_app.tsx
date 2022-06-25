import { useEffect } from 'react'
import type { AppProps } from 'next/app'

import { supabase } from '../lib/supabase'

import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        fetch('/api/auth', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        })
      }
    )
    return () => {
      listener?.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
