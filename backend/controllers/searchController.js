import supabase from "../config/supabase.js";
import { getAIResponse } from "../config/ai.js";

// ================= HELPER =================
const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;

  return user;
};

// ================= CREATE SEARCH =================
export const createSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query required" });
    }

    const user = await getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // 🔥 AI CALL (YAHI HOGA)
    const aiResponse = await getAIResponse(query);

    // SAVE TO DB
    const { error } = await supabase.from("searches").insert([
      {
        user_id: user.id,
        query,
        response: aiResponse,
      },
    ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 🔥 FRONTEND KO RESPONSE
    res.json({
      query,
      response: aiResponse,
    });

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= GET HISTORY =================
export const getHistory = async (req, res) => {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const { data, error } = await supabase
      .from("searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    console.log("HISTORY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= DELETE SEARCH =================
export const deleteSearch = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const { error } = await supabase
      .from("searches")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};