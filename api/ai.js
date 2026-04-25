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
              "반드시 JSON만 출력: {\"name\":\"\",\"damage\":0,\"speed\":0,\"effect\":\"fire\"}"
          },
          {
            role: "user",
            content: desc
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 안전하게 꺼내기
    const text = data?.choices?.[0]?.message?.content || "";

    // 🔥 JSON 추출
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) throw new Error("JSON 없음");

    const weapon = JSON.parse(match[0]);

    // 🔥 기본값 보정
    return res.json({
      weapon: {
        name: weapon.name || desc,
        damage: weapon.damage || 60,
        speed: weapon.speed || 40,
        effect: weapon.effect || "fire"
      }
    });

  } catch (e) {
    console.log("에러:", e);

    return res.json({
      weapon: {
        name: desc,
        damage: 60,
        speed: 40,
        effect: "fire"
      }
    });
  }
}
