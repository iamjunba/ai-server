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
            content:
              "무기를 JSON으로만 생성해라. 다른 말 금지. 반드시 이 형식만: {\"name\":\"검\",\"damage\":70,\"speed\":30,\"effect\":\"fire\"}"
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

    // 🔥 JSON만 강제 추출
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      return res.json({ result: match[0] });
    }

    throw new Error("JSON 없음");

  } catch (e) {
    return res.json({
      result: JSON.stringify({
        name: "기본 무기",
        damage: 60,
        speed: 40,
        effect: "fire"
      })
    });
  }
}
