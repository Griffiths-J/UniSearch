exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  try {
    const { name } = JSON.parse(event.body);
    let currentTotal = "??";

    // 1. Increment Upstash Counter
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/incr/proceed_count`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
      });
      const data = await response.json();
      currentTotal = data.result;
    } catch (e) { console.log("Counter failed"); }

    // 2. Send Pushbullet
    await fetch('https://api.pushbullet.com/v2/pushes', {
      method: 'POST',
      headers: {
        'Access-Token': process.env.PUSHBULLET_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'note',
        title: `👀 Potential Customer (#${currentTotal})`,
        body: `${name || "A student"} is looking at the payment page.`
      })
    });

    return { statusCode: 200, body: "Success" };
  } catch (err) { return { statusCode: 500, body: err.toString() }; }
};