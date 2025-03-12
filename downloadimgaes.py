import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin

# Ensure the public/images folder exists
image_dir = os.path.join("public", "images")
os.makedirs(image_dir, exist_ok=True)

# Function to download an image
def download_image(url, filename):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://www.idlebrain.com/",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        response = requests.get(url, headers=headers, stream=True)
        if response.status_code == 200:
            with open(filename, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f"Downloaded: {filename}")
        else:
            print(f"Failed to download {url}: Status code {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

# Function to fetch and download all images
def fetch_and_download_images():
    base_url = "https://www.idlebrain.com/movie/photogallery/nayanatara15/images/"

    # Set up Selenium with Chrome
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    # Use webdriver_manager to automatically download and manage the ChromeDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    try:
        # Open the target URL
        driver.get(base_url)
        time.sleep(5)  # Wait for the page to load completely

        # Get the page source after JavaScript rendering
        page_source = driver.page_source

        # Parse the page source with BeautifulSoup
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(page_source, "html.parser")

        # Find all image tags
        image_tags = soup.find_all("img")

        # Download each image
        for i, img in enumerate(image_tags):
            src = img.get("src")
            if src and "nayanatara" in src:
                # Convert relative URLs to absolute URLs
                image_url = urljoin(base_url, src)
                filename = os.path.join(image_dir, f"nayanatara{i + 1}.jpg")
                download_image(image_url, filename)

        print("All images downloaded successfully!")
    except Exception as e:
        print(f"Error fetching or downloading images: {e}")
    finally:
        # Close the browser
        driver.quit()

# Run the script
if __name__ == "__main__":
    fetch_and_download_images()