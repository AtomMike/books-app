import '../styles/globals.css'

import Axios from 'axios'

Axios.defaults.baseURL = 'http://127.0.0.1:3000';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
