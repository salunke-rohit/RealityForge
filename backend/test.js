const res = await fetch("https://openrouter.ai/api/v1/models")
const data = await res.json()

console.log(data)