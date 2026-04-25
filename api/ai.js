export default async function handler(req, res) {
  try {
    const { desc } = req.body;

    // 1️⃣ 무기 데이터 생성
    const textRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "무기를 JSON으로만 생성해라: {\"name\":\"\",\"damage\":0,\"speed\":0,\"effect\":\"\"}"
          },
          {
            role: "user",
            content: desc
          }
        ]
      })
    });

    const textData = await textRes.json();
    const match = textData.choices[0].message.content.match(/\{[\s\S]*\}/);
    const weapon = JSON.parse(match[0]);

    // 2️⃣ 이미지 생성
    const imgRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.API_KEY
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `${weapon.name}, fantasy weapon, glowing, high detail, game art`,
        size: "512x512"
      })
    });

    const imgData = await imgRes.json();
    const imageUrl = imgData.data[0].url;

    // 3️⃣ 같이 반환
    res.json({
      weapon,
      image: imageUrl
    });

  } catch (e) {
    res.json({
      weapon: {
        name: "기본 무기",
        damage: 50,
        speed: 50,
        effect: "none"
      },
      image: ""
    });
  }
}
