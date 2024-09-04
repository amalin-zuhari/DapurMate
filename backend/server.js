require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const inventoryRoutes = require("./routes/inventoryRoutes");
const shoppingListRoutes = require("./routes/shoppingList");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Function to enter form data and take a screenshot
async function enterFormData(url, searchQuery, imagePath, inputName) {
  const browser = await puppeteer.launch( {headless: false});
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector(`input[name="${inputName}"]`, { timeout: 10000 });
    await page.focus(`input[name="${inputName}"]`);
    await page.keyboard.type(searchQuery);
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 });
    await page.screenshot({ path: imagePath, fullPage: true });
  } catch (error) {
    console.error(`Error in enterFormData for ${url}:`, error);
  } finally {
    await browser.close();
  }
}

// Endpoint to handle search requests
app.post("/search", async (req, res) => {
  const { query } = req.body;

  // URLs and input names for different grocery sites
  const sites = [
    { url: "https://mygroser.com/en/index", inputName: "searchText", imagePath: "public/mygroser.png" },
    { url: "https://klec.jayagrocer.com/", inputName: "q", imagePath: "public/jayagrocer.png" },
    { url: "https://www.mycs.com.my/", inputName: "q", imagePath: "public/cs.png" },
  ];

  try {
    // Run Puppeteer for each site
    await Promise.all(
      sites.map((site) => enterFormData(site.url, query, site.imagePath, site.inputName))
    );

    // Send the filenames to the frontend
    res.json({ images: ["mygroser.png", "jayagrocer.png", "cs.png"] });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

// Serve static files (e.g., the screenshots)
app.use('/images', express.static(path.join(__dirname, 'public')));

// Test Route
app.get("/test", (req, res) => {
  res.status(200).send("Test route working");
});

// MongoDB Connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/shoppinglist", shoppingListRoutes);
app.use("/api/recipe", recipeRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
