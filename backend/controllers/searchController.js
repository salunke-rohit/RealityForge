import supabase from '../config/supabase.js'
import { getAIResponse } from '../config/ai.js'

// Save search + AI response
export const saveSearch = async (req, res) => {
  try {
    const { user_id, query } = req.body

    if (!user_id || !query) {
      return res.status(400).json({ error: "Missing fields" })
    }

    // 🔥 AI call
    const aiResponse = await getAIResponse(query)

    // 🔥 Save in DB
    const { error } = await supabase
      .from('searches')
      .insert([{ user_id, query, response: aiResponse }])

    if (error) {
      console.error("DB ERROR:", error)
      return res.status(400).json({ error: error.message })
    }

    res.json({
      success: true,
      query,
      response: aiResponse
    })

  } catch (err) {
    console.error("SERVER ERROR:", err)
    res.status(500).json({ error: "Server error" })
  }
}

// Get history
export const getHistory = async (req, res) => {
  try {
    const { user_id } = req.params

    const { data, error } = await supabase
      .from('searches')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) return res.status(400).json({ error: error.message })

    res.json(data)

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}