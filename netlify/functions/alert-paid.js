exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  try {
    const { name } = JSON.parse(event.body);
    let currentTotal = "??";

    //  Increment Upstash Counter
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/incr/paid_count`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
      });
      const data = await response.json();
      currentTotal = data.result;
    } catch (e) { console.log("Counter failed"); }

    //  Send Pushbullet
    await fetch('https://api.pushbullet.com/v2/pushes', {
      method: 'POST',
      headers: {
        'Access-Token': process.env.PUSHBULLET_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'note',
        title: `💰 MONEY IN! (Sale #${currentTotal})`,
        body: `Victory! ${name || "A student"} just paid for their results.`
      })
    });

    return { statusCode: 200, body: "Success" };
  } catch (err) { return { statusCode: 500, body: err.toString() }; }
};