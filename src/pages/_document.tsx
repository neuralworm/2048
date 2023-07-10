import FooterView from '@/components/overlay/footer/FooterView'
import { Footer } from 'antd/es/layout/layout'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
      <FooterView/>
    </Html>
  )
}
