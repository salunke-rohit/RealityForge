import { useEffect, useState } from "react"
import Auth from "./pages/Auth"
import Home from "./pages/Home"

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return user ? <Home user={user} /> : <Auth />
}

export default App