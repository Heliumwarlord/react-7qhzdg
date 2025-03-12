export const fetchImages = async () => {
  const baseUrl = "https://www.idlebrain.com/movie/photogallery/nayanatara45/images/";
  const imageUrls = [];

  // Generate image URLs (e.g., nayanatara1.jpg, nayanatara2.jpg, etc.)
  for (let i = 1; i <= 20; i++) { // Adjust the range as needed
    const imageUrl = `${baseUrl}nayanatara${i}.jpg`;
    imageUrls.push(imageUrl);
  }

  console.log("Generated Image URLs:", imageUrls); // Log the image URLs
  return imageUrls;
};