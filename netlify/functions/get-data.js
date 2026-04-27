/* export const handler = async (event) => {
  
  const API_KEY = process.env.JSONBIN_KEY; 
  const BIN_ID = "69ef6c19aaba88219742bc76"; 

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        "X-Master-Key": API_KEY
      }
    });

    const result = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.record), 
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
}; */







export const handler = async (event) => {
  // Only allow POST requests (sending data from the frontend)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const API_KEY = process.env.JSONBIN_KEY;
  const BIN_ID = "69ef6c19aaba88219742bc76";

  try {
    // Receive the university name and student grades from the frontend
    const { university, studentData } = JSON.parse(event.body);

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const result = await response.json();
    const data = result.record;

    // Identify which university list to use
    let requiredUni;
    if (university === "KNUST") requiredUni = data[0].KNUST;
    else if (university === "UG") requiredUni = data[1].UG;
    else if (university === "UCC") requiredUni = data[2].UCC;
    else if (university === "UMAT") requiredUni = data[3].UMAT;

    // PERFORM FILTERING (Exactly your logic, moved here)
    let elegible = (requiredUni || []).filter((program) => {
      const cutoff = program.cutoff_criteria || {};
      const passAggregrate = studentData.aggregrate <= cutoff.minimum_aggregate;

      const studentElectives = (cutoff.elective_required?.any_of || []).filter((subject) => {
        return studentData[subject] !== undefined;
      });

      const passElective = studentElectives.length >= (cutoff.elective_required?.count || 0);
      return passAggregrate && passElective;
    });

    // PERFORM SORTING (Exactly your logic, moved here)
    for (let i = 0; i < elegible.length; i++) {
      for (let j = 0; j < elegible.length; j++) {
        if (elegible[i].cutoff_criteria.minimum_aggregate < elegible[j].cutoff_criteria.minimum_aggregate) {
          let temp = elegible[i];
          elegible[i] = elegible[j];
          elegible[j] = temp;
        }
      }
    }

    // Return ONLY the results the student is eligible for
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(elegible),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};