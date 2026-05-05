exports.handler = async (event) => {
  // Only allow POST requests from your frontend
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name } = JSON.parse(event.body);

    // We use global fetch (no require needed)
    const response = await fetch('https://api.pushbullet.com/v2/pushes', {
      method: 'POST',
      headers: {
        'Access-Token': process.env.PUSHBULLET_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'note',
        title: '💰 UniLift: SUCCESS!',
        body: `Victory! ${name || "A student"} has just paid for their results.`
      })
    });

    if (!response.ok) {
      throw new Error(`Pushbullet API responded with ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Paid alert sent to Admin" })
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};