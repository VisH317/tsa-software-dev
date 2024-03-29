import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{padding: 0, margin: 0, height: "100vh", overflow: "hidden"}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
