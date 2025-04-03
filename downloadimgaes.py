  
import os
import requests

# Create folder if it doesn't exist
def create_folder(folder_name):
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

# Download image function
def download_image(url, folder_name):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            filename = os.path.join(folder_name, url.split("/")[-1])
            with open(filename, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"Downloaded: {url}")
        else:
            print(f"Failed to download {url}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

# Main scraping function
def scrape_images(base_url, start_page=1, end_page=250, max_images=100):
    availability_map = {}  # To store available/unavailable pages

    for page_number in range(start_page, end_page + 1):
        folder_name = f"images/page_{page_number}"
        create_folder(folder_name)

        print(f"Scraping page {page_number}...")
        page_available = False

        for image_number in range(1, max_images + 1):
            # Format the URL with the page and image numbers
            image_url = base_url.format(page_number, image_number)

            try:
                response = requests.head(image_url)  # Use HEAD to check if the image exists
                if response.status_code == 200:
                    page_available = True
                    download_image(image_url, folder_name)
                elif response.status_code == 404:
                    print(f"Image not found: {image_url}")
                    break  # Stop trying for this page if an image is missing
                else:
                    print(f"Unexpected status for {image_url}: {response.status_code}")
            except Exception as e:
                print(f"Error checking {image_url}: {e}")

        # Record page availability in the map
        availability_map[page_number] = "Available" if page_available else "Not Available"

        if not page_available:
            print(f"No images found for page {page_number}. Moving to the next page.")

    # Save the availability map to a file
    with open("availability_map.txt", "w") as file:
        for page, status in availability_map.items():
            file.write(f"Page {page}: {status}\n")

    print("Scraping complete. Availability map saved to 'availability_map.txt'.")

# Example usage
base_url = "https://www.idlebrain.com/movie/photogallery/nayanatara47/images/nayanatara{}.jpg"
# https://www.idlebrain.com/movie/photogallery/samantha130/images/samantha37.jpg
scrape_images(base_url, start_page=1, end_page=250, max_images=100)
