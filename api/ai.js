export default async function handler(req, res) {
  try {
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
            content: "무기를 JSON으로만 생성해라. 설명 금지. 반드시 다음 형식만: {\"name\":\"검\",\"damage\":50,\"speed\":30,\"effect\":\"fire\"}"
          },
          {
            role: "user",
            content: desc
          }
        ]
      })
    });

    const data = await response.json();

    let text = data.choices?.[0]?.message?.content || "";

    // 🔥 JSON 강제 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return res.json({ result: jsonMatch[0] });
    }

    // fallback
    return res.json({
      result: JSON.stringify({
        name: desc,
        damage: 50,
        speed: 50,
        effect: "none"
      })
    });

  } catch (e) {
    return res.json({
      result: JSON.stringify({
        name: "에러 무기",
        damage: 10,
        speed: 10,
        effect: "none"
      })
    });
  }
}
