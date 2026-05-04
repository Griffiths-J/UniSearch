

export const handler = async (event) => {
  
  const SILO_URL = process.env.JSONSILO_URL; 
  const ACCESS_KEY = process.env.JSONSILO_ACCESS_KEY;

  if (!SILO_URL || !ACCESS_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  if (event.httpMethod === 'GET') {
    try {
      const response = await fetch(SILO_URL, {
        method: 'GET',
        headers: {
          "X-SILO-KEY": ACCESS_KEY
        }
      });

      const data = await response.json();

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch data" }),
      };
    }
  }


  if (event.httpMethod === 'POST') {
    try {
      const { university, studentData } = JSON.parse(event.body);

      if (!university || !studentData) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing university or studentData" }),
        };
      }

      // Fetch full database
      const response = await fetch(SILO_URL, {
        method: 'GET',
        headers: {
          "X-SILO-KEY": ACCESS_KEY
        }
      });

      const data = await response.json();

     
      let requiredUni;
      switch (university) {
        case "KNUST":
          requiredUni = data[0].KNUST;
          break;
        case "UG":
          requiredUni = data[1].UG;
          break;
        case "UCC":
          requiredUni = data[2].UCC;
          break;
        case "UMAT":
          requiredUni = data[3].UMAT;
          break;
        case "UPSA":
          requiredUni = data[4].UPSA;  
          break;
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid university" }),
          };
      }

      
      const elegible = (requiredUni || []).filter((program) => {
        const cutoff = program.cutoff_criteria || {};
        const passAggregrate =
          studentData.aggregrate <= cutoff.minimum_aggregate;

        const studentElectives = (
          cutoff.elective_required?.any_of || []
        ).filter((subject) => {
          return studentData[subject] !== undefined;
        });

        const passElective =
          studentElectives.length >= (cutoff.elective_required?.count || 0);
        
        return passAggregrate && passElective;
      });

      
      for (let i = 0; i < elegible.length; i++) {
        for (let j = 0; j < elegible.length - 1; j++) {
          if (
            elegible[j].cutoff_criteria.minimum_aggregate >
            elegible[j + 1].cutoff_criteria.minimum_aggregate
          ) {
            let temp = elegible[j];
            elegible[j] = elegible[j + 1];
            elegible[j + 1] = temp;
          }
        }
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elegible,
          aggregate: studentData.aggregrate,
          Uni: studentData.Uni,
        }),
      };

    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to process request" }),
      };
    }
  }

  // Handle other HTTP methods
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};