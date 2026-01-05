export default async function handler(req, res) {
  const API_URL = "https://script.google.com/macros/s/AKfycbwUfuHDw9S67CRE6Ro9tTSe0lku_xZKRGBODN2Li0yzkplHkk9vasXOO_Q6gU-c7tdN/exec";

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}
