import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import config from '@/aws-exports'
import '@aws-amplify/ui-react/styles.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

Amplify.configure(config)

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <Authenticator>
    //   {({ signOut, user }) => (
    //     <main>
    //       <h1>Hello {user!.username}</h1>
    //       <button onClick={signOut}>Sign out</button>
    <Component {...pageProps} />
    //     </main>
    //   )}
    // </Authenticator>
  )
}
