import supabase from "../config/supabase.js"

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" })
    }

    // check username exists
    const { data: existing } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single()

    if (existing) {
      return res.status(400).json({ error: "Username already taken" })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    const user = data.user

await supabase.from("users").insert([
  {
    id: user.id,
    email: user.email,
    username
  }
])

    res.json({
      message: "Signup successful",
      user: {
        id: user.id,
        email
      }
    })

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ error: "All fields required" })
    }
    
let email = identifier

console.log("LOGIN EMAIL:", email)

    // username login
    if (!identifier.includes("@")) {
      const { data } = await supabase
        .from("users")
        .select("email")
        .eq("username", identifier)
        .single()

      if (!data) {
        return res.status(400).json({ error: "User not found" })
      }

      email = data.email
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session
    })

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}

// LOGOUT
export const logout = async (req, res) => {
  try {
    await supabase.auth.signOut()
    res.json({ message: "Logged out" })
  } catch {
    res.status(500).json({ error: "Logout failed" })
  }
}