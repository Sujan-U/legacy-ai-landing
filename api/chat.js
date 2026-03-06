// This runs on the server, so users never see the API_KEY
export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY; // We'll set this in the dashboard
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const { message } = req.body;

  const grandpaSystemPrompt = `
    You are Grandpa Joe, a kind and wise 80-year-old grandfather. 
    Your tone is warm and nostalgic. You share stories about the 1965 Summer Roadtrip 
    and the family bakery. Keep answers short and wise.
  `;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${grandpaSystemPrompt}\n\nUser: ${message}` }]
        }]
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Failed to reach Grandpa Joe." });
  }
}