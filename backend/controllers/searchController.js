import supabase from '../config/supabase.js';

// Save search
export const saveSearch = async (req, res) => {
  try {
    const { user_id, query } = req.body;

    if (!user_id || !query) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from('search_history')
      .insert([{ user_id, query }]);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Saved", data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get history
export const getHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};