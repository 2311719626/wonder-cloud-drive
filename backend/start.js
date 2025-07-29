const { exec } = require("child_process");
const path = require("path");

// Function to start the server with nodemon for development
const startServer = () => {
  console.log("Starting Wonder Cloud Drive backend server...");

  // Change to the backend directory
  const backendDir = path.join(__dirname);

  // Start the server with nodemon
  const serverProcess = exec("npx nodemon src/server.ts", {
    cwd: backendDir,
    env: { ...process.env, NODE_ENV: "development" },
  });

  // Handle stdout
  serverProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  // Handle stderr
  serverProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  // Handle process exit
  serverProcess.on("exit", (code) => {
    console.log(`Server process exited with code ${code}`);
  });
};

// Start the server
startServer();
