const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

// Ensure the public/images folder exists
const imageDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Function to download an image
const downloadImage = async (url, filename) => {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    const writer = fs.createWriteStream(path.join(imageDir, filename));
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
  }
};

// Function to fetch and download all images
const fetchAndDownloadImages = async () => {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Proxy server
  const targetUrl = "https://www.idlebrain.com/movie/photogallery/nayanatara15/images/";

  try {
    const response = await axios.get(proxyUrl + targetUrl, {
      headers: {
        Origin: "http://localhost", // Add the Origin header
      },
    });
    const $ = cheerio.load(response.data);

    const imageUrls = [];
    $("img").each((index, element) => {
      let src = $(element).attr("src");
      if (src && src.includes("nayanatara")) {
        // Convert relative URLs to absolute URLs
        if (!src.startsWith("http")) {
          src = new URL(src, targetUrl).href;
        }
        imageUrls.push(src);
      }
    });

    console.log("Found", imageUrls.length, "images to download.");

    // Download each image
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = `nayanatara${i + 1}.jpg`;
      console.log(`Downloading ${filename}...`);
      await downloadImage(url, filename);
    }

    console.log("All images downloaded successfully!");
  } catch (error) {
    console.error("Error fetching or downloading images:", error);
  }
};

// Run the script
fetchAndDownloadImages();