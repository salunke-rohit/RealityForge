import supabase from "../config/supabase.js";

// AUTH HELPER (IMPORTANT)
const getUserFromToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
};

// CREATE SEARCH
export const createSearch = async (req, res) => {
  try {
    const { query } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];

    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ error: "Authentication failed" });

    await supabase.from("searches").insert([
      {
        user_id: user.id,
        query,
        response: "AI response here"
      }
    ]);

    res.json({ message: "Saved" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// HISTORY
export const getHistory = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await getUserFromToken(token);

    if (!user) return res.status(401).json({ error: "Auth failed" });

    const { data } = await supabase
      .from("searches")
      .select("*")
      .eq("user_id", user.id);

    res.json(data);

  } catch {
    res.status(500).json({ error: "Server error" });
  }
};