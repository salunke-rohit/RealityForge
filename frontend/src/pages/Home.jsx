import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/home.css";

function Home({ user }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const speak = (text) => {
    if (!text) return;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const getToken = () => {
    return user?.token || null;
  };

  // LOAD HISTORY
  const loadHistory = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(
        "https://realityforge.onrender.com/api/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setHistory(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.log("History Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // SEARCH
  const handleSearch = async () => {
    if (!query.trim()) return;

    const token = getToken();
    if (!token) return;

    const userMsg = query;
    setQuery("");

    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    try {
      const res = await axios.post(
        "https://realityforge.onrender.com/api/search",
        { query: userMsg },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ backend response fix
      const aiText = res.data.response || "Saved successfully";

      setMessages(prev => [
        ...prev,
        { role: "ai", text: aiText }
      ]);

      speak(aiText);
      loadHistory();

    } catch (err) {
      console.log("Search Error:", err.response?.data || err.message);

      const errorMsg = "Something went wrong";
      setMessages(prev => [...prev, { role: "ai", text: errorMsg }]);

      speak(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="home">

      <div className="sidebar">
        <div className="logo">🧿 RealityForge</div>

        {history.map(item => (
          <div key={item.id}>{item.query}</div>
        ))}
      </div>

      <div className="main">

        <div className="topbar">
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="chat">
          {messages.map((msg, i) => (
            <div key={i}>{msg.text}</div>
          ))}
        </div>

        <div className="input-area">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Send</button>
        </div>

      </div>
    </div>
  );
}

export default Home;