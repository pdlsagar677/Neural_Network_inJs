  // Create a new neural network instance
  const network = new brain.NeuralNetwork();

  // Pre-define some training data (as mentioned before)
  const trainingData = [
    {
      input: [1, 1, 2, 1, 3, 4, 2, 1, 0],
      output: [1], // Barcelona will score more than 1 goal
    },
    {
      input: [0, 0, 1, 0, 1, 2, 1, 0, 1],
      output: [0], // Real Madrid will score 1 or fewer goals
    },
    {
      input: [1, 0, 3, 4, 2, 3, 2, 1, 0],
      output: [1], // Barcelona will score more than 1 goal
    },
    {
      input: [0, 1, 0, 1, 1, 0, 2, 1, 0],
      output: [0], // Real Madrid will score 1 or fewer goals
    },
    {
      input: [1, 1, 3, 2, 1, 4, 3, 0, 0],
      output: [1], // Barcelona will score more than 1 goal
    },
    {
      input: [0, 0, 1, 1, 0, 2, 3, 0, 0],
      output: [0], // Real Madrid will score 1 or fewer goals
    },
    {
      input: [1, 0, 2, 3, 1, 2, 2, 1, 1],
      output: [1], // Barcelona will score more than 1 goal
    },
    {
      input: [0, 1, 1, 0, 2, 1, 1, 0, 1],
      output: [0], // Real Madrid will score 1 or fewer goals
    },
  ];

  // Train the network with the defined data
  network.train(trainingData);

  // Handle form submission to make a prediction
  document.getElementById("input-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get user inputs
    const team = parseInt(document.getElementById("team").value);
    const homeAway = parseInt(document.getElementById("home_away").value);
    const goals = document.getElementById("goals").value.split(",").map(Number);
    const oppositionStrength = parseInt(document.getElementById("opposition_strength").value);
    const injuryStatus = parseInt(document.getElementById("injury_status").value);

    // Prepare input for the neural network
    const input = [
      team,
      homeAway,
      ...goals, // Spread the last 5 goals into the input array
      oppositionStrength,
      injuryStatus,
    ];

    // Run prediction using the neural network
    const output = network.run(input);

    // Convert output to binary (0 or 1)
    const prediction = output > 0.5 ? "More than 1 goal" : "1 or fewer goals";

    // Display the prediction result on the page
    document.getElementById("prediction").innerText = `Prediction: The team will score ${prediction}.`;
  });