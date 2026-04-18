export const getAIResponse = async (query) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "RealityForge"
      },
      body: JSON.stringify({
        model: "mistralai/ministral-8b-2512",
        messages: [
          {
            role: "system",
            content: `
You are RealityForge AI.

RealityForge is a platform that answers ONLY:
- what-if scenarios
- simulations
- alternate realities
- futuristic ideas

STRICT RULES:
1. If the query is related to above topics → generate creative RealityForge response.
2. If NOT → reply ONLY:
"This is RealityForge AI. Ask only what-if, simulation, or alternate reality questions."

DO NOT:
- explain grammar
- correct sentences
- act like normal chatbot
- give general knowledge answers

Stay in RealityForge mode only.
`
          },
          {
            role: "user",
            content: query
          }
        ]
      })
    })

    const text = await res.text()
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