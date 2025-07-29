const { exec } = require("child_process");
const path = require("path");

// Function to start the frontend with Vite for development
const startFrontend = () => {
  console.log("Starting Wonder Cloud Drive frontend...");

  // Change to the frontend directory
  const frontendDir = path.join(__dirname);

  // Start the frontend with Vite
  const frontendProcess = exec("npx vite", {
    cwd: frontendDir,
    env: { ...process.env, NODE_ENV: "development" },
  });

  // Handle stdout
  frontendProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  // Handle stderr
  frontendProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  // Handle process exit
  frontendProcess.on("exit", (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });
};

// Start the frontend
startFrontend();
