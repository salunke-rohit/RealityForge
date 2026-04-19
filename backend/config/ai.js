export const getAIResponse = async (query) => {
  try {
    if (!query || query.trim() === "") {
      return "Please enter a valid query"
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "RealityForge"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are RealityForge AI.
Answer ONLY what-if, simulation, alternate reality questions.
Otherwise reply:
"This is RealityForge AI. Ask only what-if, simulation, or alternate reality questions."`
          },
          {
            role: "user",
            content: query
          }
        ]
      })
    })

    let data
    try {
      data = await res.json()
    } catch {
      console.log("❌ Response not JSON")
      return "AI response error"
    }

    

    if (!res.ok) {
      console.log("❌ AI ERROR:", data)
      return data?.error?.message || "AI service unavailable"
    }

    // ✅ FINAL FIX
    const aiText = data?.choices?.[0]?.message?.content

    if (!aiText) {
      console.log("❌ No AI content found:", data)
      return "No response"
    }
if (process.env.NODE_ENV === "development") {
  console.log("AI RESPONSE:", data)
}

    return aiText

  } catch (err) {
    console.log("❌ FETCH ERROR:", err)
    return "AI Error"
  }
}