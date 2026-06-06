import { useEffect } from 'react'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add('luxe--warm')
    return () => document.documentElement.classList.remove('luxe--warm')
  }, [])

  return <Component {...pageProps} />
}
