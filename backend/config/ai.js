export const getAIResponse = async (query) => {
  try {
    // 1. validation
    if (!query || query.trim() === "") {
      return "Please enter a valid query";
    }

    // 2. API call with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://realityforge.onrender.com",
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
"This is RealityForge AI. Ask only what-if questions."`
          },
          {
            role: "user",
            content: query
          }
        ]
      })
    });

    clearTimeout(timeout);

    // 3. parse response safely
    const data = await res.json();

    if (!res.ok) {
      console.log("❌ AI API ERROR:", data);
      return data?.error?.message || "AI service unavailable";
    }

    // 4. extract response
    const aiText = data?.choices?.[0]?.message?.content;

    if (!aiText) {
      console.log("❌ EMPTY AI RESPONSE:", data);
      return "No response from AI";
    }

    // 5. return clean text
    return aiText.trim();

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("⏱ AI Timeout");
      return "AI took too long. Try again.";
    }

    console.log("❌ FETCH ERROR:", err);
    return "AI Error";
  }
};