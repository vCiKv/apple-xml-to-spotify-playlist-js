import './app.css'
import AppController from './components/app-controller'
import { Toaster } from './components/portals'
import SpotifyLoginButton from './components/spot-button'

export function App() {

  return (
    <main
      style={{
        padding: "60px 0"
      }}
    >
      <SpotifyLoginButton />
      <AppController />

    </main>
  )
}
