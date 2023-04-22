// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'jotai'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../styles/global.css';

const client = new QueryClient()

import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: "#22c55e" }
  }
})

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
