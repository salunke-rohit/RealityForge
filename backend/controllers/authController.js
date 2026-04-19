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
    const { email, password } = req.body;

    console.log("LOGIN DATA:", email, password); // debug

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("LOGIN ERROR:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      user: data.user,
      token: data.session.access_token,
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};