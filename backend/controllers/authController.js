import supabase from "../config/supabase.js";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // 2. Check username already exists
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 3. Signup with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;

    if (!user) {
      return res.status(400).json({ error: "Signup failed" });
    }

    // 4. Insert into custom users table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        email: user.email,
        username,
      },
    ]);

    if (insertError) {
      console.log("DB INSERT ERROR:", insertError.message);
    }

    return res.status(200).json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email & Password required" });
    }

    // 2. Login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.log("LOGIN ERROR:", error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data.session) {
      return res.status(400).json({ error: "Login failed" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: data.user,
      token: data.session.access_token,
    });

  } catch (err) {
    console.log("LOGIN SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Logged out successfully" });

  } catch (err) {
    console.log("LOGOUT ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};