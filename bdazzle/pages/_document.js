import Document, { Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html lang="th" dir="ltr">
        <Head>
          <link rel="shortcut icon" type="image/png" href="/static/favicon.png"/>
          <link rel="icon" type="image/png" href="/static/favicon.png"/>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link href="https://fonts.googleapis.com/css?family=Sarabun:300,400,500,600,700,800,900&display=swap" rel="stylesheet"></link>
        </Head>
        <body dir="ltr">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
export default MyDocument;
