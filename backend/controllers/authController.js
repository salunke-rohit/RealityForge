import supabase from "../config/supabase.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // username check
    const { data: existing } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    const user = data.user;

    // save extra data
    await supabase.from("users").insert([
      {
        id: user.id,
        email: user.email,
        username,
      },
    ]);

    res.json({
      message: "Signup successful",
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email & Password required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.log("LOGIN ERROR:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session, // IMPORTANT
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: "Logged out" });
  } catch {
    res.status(500).json({ error: "Logout failed" });
  }
};