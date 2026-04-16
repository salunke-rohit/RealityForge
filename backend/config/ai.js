export const getAIResponse = async (query) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",  // 🔥 REQUIRED
        "X-Title": "RealityForge"                 // 🔥 REQUIRED
      },
      body: JSON.stringify({
        model: "mistralai/ministral-8b-2512",
        messages: [
          {
            role: "user",
            content: query
          }
        ]
      })
    })

    const text = await res.text()   // 🔥 IMPORTANT (not json first)
    console.log("RAW RESPONSE:", text)

    const data = JSON.parse(text)

    if (!res.ok) {
      return data?.error?.message || "API failed"
    }

    return data?.choices?.[0]?.message?.content || "No response"

  } catch (err) {
    console.error("FETCH ERROR:", err)
    return "Fetch failed"
  }
}