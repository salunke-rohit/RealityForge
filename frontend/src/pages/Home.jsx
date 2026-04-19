import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/home.css"

function Home({ user }) {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])

  //  SAFE SPEAK
  const speak = (text) => {
    if (!text || typeof text !== "string") return

    try {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(speech)
    } catch (e) {
      console.log("Speech error:", e)
    }
  }
//  LOAD HISTORY
  const loadHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/history",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      if (Array.isArray(res.data)) {
        setHistory(res.data)
      } else {
        setHistory([])
      }

    } catch (err) {
      console.log("History Error:", err.response?.data || err.message)
      setHistory([])
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  //  SEARCH (FULL SAFE VERSION)
  const handleSearch = async () => {
    if (!query.trim()) return

    const userMsg = query
    setQuery("")

    // add user message instantly
    setMessages(prev => [...prev, { role: "user", text: userMsg }])

    try {
      const res = await axios.post(
        "https://realityforge.onrender.com/api/search",
        { query: userMsg },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      console.log("API RESPONSE:", res.data)

      const aiText = res?.data?.response

      if (!aiText || typeof aiText !== "string") {
        throw new Error("Invalid AI response")
      }

      // add AI message
      setMessages(prev => [
        ...prev,
        { role: "ai", text: aiText }
      ])

      speak(aiText)
      loadHistory()

    } catch (err) {
      console.log("FRONTEND ERROR:", err.response?.data || err.message)

      const errorMsg = "Something went wrong. Try again."

      setMessages(prev => [
        ...prev,
        { role: "ai", text: errorMsg }
      ])

      speak(errorMsg)
    }
  }

  //  LOGOUT
  const logout = () => {
    speak("Logging out")

    setTimeout(() => {
      localStorage.removeItem("user")
      window.location.reload()
    }, 500)
  }

  return (
    <div className="home">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">🧿 RealityForge</div>

        {history.map(item => (
          <div key={item.id} className="history-item">
            {item.query}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <span>{user.email}</span>
          <span className="logout" onClick={logout}>Logout</span>
        </div>

        {/* CHAT */}
        <div className="chat">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="input-area">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ask something..."
          />
          <button onClick={handleSearch}>➤</button>
        </div>

      </div>
    </div>
  )
}

export default Home