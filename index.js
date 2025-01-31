const network = new brain.NeuralNetwork();
let trainingData = [];

// Generate Random Data and Automatically "Upload" as a CSV to the network
document.getElementById('generate-data').addEventListener('click', function () {
    const generatedData = generateFootballMatchData(100); // Generate 50 rows
    console.log(generatedData);
    const csvHeader = "team,home_away,last_5_matches_goals_1,last_5_matches_goals_2,last_5_matches_goals_3,last_5_matches_goals_4,last_5_matches_goals_5,opposition_strength,injury_status,next_match_goals";
    const csvContent = [csvHeader, ...generatedData].join("\n");

    // Simulate File Upload by creating a Blob
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a virtual FileReader to read the Blob as CSV
    const reader = new FileReader();
    reader.onload = function () {
        const result = reader.result;
        Papa.parse(result, {
            complete: function (results) {
                // Convert CSV data to usable format for neural network
                trainingData = results.data.slice(1).map(row => ({
                    input: [
                        parseInt(row[0]), // team
                        parseInt(row[1]), // home/away
                        ...row.slice(2, 7).map(Number), // last 5 goals
                        parseInt(row[7]), // opposition strength
                        parseInt(row[8]), // injury status
                    ],
                    output: [parseInt(row[9])] // next match goals
                }));

                // Train the network with the parsed CSV data
                network.train(trainingData);
                alert("Training data loaded and neural network trained successfully!");
            },
            header: false,
            skipEmptyLines: true
        });
    };

    reader.readAsText(blob); // Simulate reading the CSV Blob
});

// Handle form submission to make a prediction
document.getElementById("input-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const team = parseInt(document.getElementById("team").value);
    const homeAway = parseInt(document.getElementById("home_away").value);
    const goals = document.getElementById("goals").value.split(",").map(Number);
    const oppositionStrength = parseInt(document.getElementById("opposition_strength").value);
    const injuryStatus = parseInt(document.getElementById("injury_status").value);

    // Ensure exactly 5 goals are provided
    if (goals.length !== 5) {
        alert("Please enter exactly 5 numbers for the last 5 match goals.");
        return;
    }

    // Prepare input for prediction
    const input = [
        team,
        homeAway,
        ...goals,
        oppositionStrength,
        injuryStatus
    ];

    // Get the network output (prediction)
    const output = network.run(input);

    // Convert output to binary (0 or 1)
    const prediction = output > 0.5 ? "More than 1 goal" : "1 or fewer goals";

    // Display the prediction result
    document.getElementById("prediction").innerText = `Prediction: The team will score ${prediction}.`;
});

// Function to generate random football match data
function generateFootballMatchData(numRows) {
    const teams = [0, 1]; // 0 for Real Madrid, 1 for Barcelona
    const homeAway = [0, 1]; // 0 for Away, 1 for Home
    const oppositionStrength = [0, 1]; // 0 for Weak, 1 for Strong
    const injuryStatus = [0, 1]; // 0 for No Injuries, 1 for Injured
    
    let data = [];

    // Loop to generate 'numRows' of data
    for (let i = 0; i < numRows; i++) {
        const team = teams[Math.floor(Math.random() * teams.length)];
        const home = homeAway[Math.floor(Math.random() * homeAway.length)];
        const last5Goals = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5)); // Random goals for last 5 matches
        const opposition = oppositionStrength[Math.floor(Math.random() * oppositionStrength.length)];
        const injury = injuryStatus[Math.floor(Math.random() * injuryStatus.length)];
        const nextMatchGoals = Math.random() > 0.5 ? 1 : 0; // Random 0 or 1 for prediction

        // Format data into CSV format
        const row = [
            team, 
            home, 
            ...last5Goals, 
            opposition, 
            injury, 
            nextMatchGoals
        ];

        data.push(row.join(","));
    }

    return data;
}