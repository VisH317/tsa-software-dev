import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    
  })

  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}
