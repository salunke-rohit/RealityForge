import supabase from "../config/supabase.js"
import { getAIResponse } from "../config/ai.js"

// CREATE SEARCH
export const createSearch = async (req, res) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: "Query is required" })
    }

    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.replace("Bearer ", "")

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: "Authentication failed" })
    }

    const user_id = user.id

    const response = await getAIResponse(query)

    const { error: dbError } = await supabase
      .from("searches")
      .insert([{ user_id, query, response }])

    if (dbError) {
      return res.status(400).json({ error: dbError.message })
    }

    res.json({ query, response })

  } catch (err) {
    console.log("SERVER ERROR:", err)
    res.status(500).json({ error: "Server error" })
  }
}


// GET HISTORY
export const getHistory = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: "No token" })
    }

    const token = authHeader.replace("Bearer ", "")

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: "Auth failed" })
    }

    const { data, error: dbError } = await supabase
      .from("searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (dbError) {
      return res.status(400).json({ error: dbError.message })
    }

    res.json(data)

  } catch (err) {
    console.log("SERVER ERROR:", err)
    res.status(500).json({ error: "Server error" })
  }
}


// DELETE
export const deleteSearch = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from("searches")
      .delete()
      .eq("id", id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: "Deleted" })

  } catch (err) {
    console.log("SERVER ERROR:", err)
    res.status(500).json({ error: "Server error" })
  }
}