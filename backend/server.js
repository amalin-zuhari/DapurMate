// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import required modules
const express = require("express"); // Express framework for building the server
const cors = require("cors"); // Middleware to enable CORS (Cross-Origin Resource Sharing)
const mongoose = require("mongoose"); // MongoDB ODM (Object Data Modeling) library
const puppeteer = require("puppeteer"); // Library for controlling headless browsers
const path = require("path"); // Utility module for handling file paths

// Import route handlers
const authRoutes = require("./routes/auth"); // Authentication routes
const inventoryRoutes = require("./routes/inventoryRoutes"); // Inventory management routes
const shoppingListRoutes = require("./routes/shoppingList"); // Shopping list management routes
const recipeRoutes = require("./routes/recipeRoutes"); // Recipe management routes

const app = express(); // Create an Express application instance
const PORT = process.env.PORT || 5000; // Set the port number from environment variable or default to 5000

// Middleware setup
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Middleware to enable CORS

// Function to enter form data into a webpage and take a screenshot
async function enterFormData(url, searchQuery, imagePath, inputName) {
  const browser = await puppeteer.launch({ headless: false }); // Launch Puppeteer browser
  try {
    const page = await browser.newPage(); // Open a new page in the browser
    await page.goto(url, { waitUntil: 'networkidle2' }); // Navigate to the URL and wait until network is idle

    // Wait for the input field to be available and interact with it
    await page.waitForSelector(`input[name="${inputName}"]`, { timeout: 10000 });
    await page.focus(`input[name="${inputName}"]`); // Focus on the input field
    await page.keyboard.type(searchQuery); // Type the search query into the input field
    await page.keyboard.press("Enter"); // Simulate pressing the Enter key

    // Wait for navigation to complete and take a screenshot
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 });
    await page.screenshot({ path: imagePath, fullPage: true }); // Take a screenshot of the full page
  } catch (error) {
    console.error(`Error in enterFormData for ${url}:`, error); // Log errors
  } finally {
    await browser.close(); // Close the browser
  }
}

// Endpoint to handle search requests
app.post("/search", async (req, res) => {
  const { query } = req.body; // Extract the search query from the request body

  // Define the URLs and input names for different grocery sites
  const sites = [
    { url: "https://mygroser.com/en/index", inputName: "searchText", imagePath: "public/mygroser.png" },
    { url: "https://klec.jayagrocer.com/", inputName: "q", imagePath: "public/jayagrocer.png" },
    { url: "https://www.mycs.com.my/", inputName: "q", imagePath: "public/cs.png" },
  ];

  try {
    // Use Promise.all to run Puppeteer for each site concurrently
    await Promise.all(
      sites.map((site) => enterFormData(site.url, query, site.imagePath, site.inputName))
    );

    // Send the filenames of the screenshots to the client
    res.json({ images: ["mygroser.png", "jayagrocer.png", "cs.png"] });
  } catch (error) {
    console.error("Error during search:", error); // Log errors
    res.status(500).json({ error: "An error occurred while processing your request." }); // Send error response
  }
});

// Serve static files (e.g., screenshots) from the 'public' directory
app.use('/images', express.static(path.join(__dirname, 'public')));

// Test Route to verify server is running
app.get("/test", (req, res) => {
  res.status(200).send("Test route working"); // Send a success message
});

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  })
  .then(() => console.log("Connected to MongoDB")) // Log success message
  .catch((err) => console.error("Failed to connect to MongoDB:", err)); // Log error message if connection fails

// Define routes for different parts of the application
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/inventory", inventoryRoutes); // Inventory management routes
app.use("/shoppinglist", shoppingListRoutes); // Shopping list management routes
app.use("/api/recipe", recipeRoutes); // Recipe management routes

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack
  res.status(500).send("Something broke!"); // Send a generic error message
});

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Log the server start message
