// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "../styles/globals.css"

const client = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={client}>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </QueryClientProvider>
  )
}
