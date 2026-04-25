export default async function handler(req, res) {
  const { desc } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.API_KEY
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "무기를 JSON으로 생성해라 (name, damage, speed, effect)"
        },
        {
          role: "user",
          content: desc
        }
      ]
    })
  });

  const data = await response.json();
  res.json({ result: data.choices[0].message.content });
}
