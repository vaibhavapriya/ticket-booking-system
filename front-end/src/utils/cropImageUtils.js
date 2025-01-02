export const getCroppedImg = (imageSrc, croppedArea) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate the width and height of the cropped image
      canvas.width = croppedArea.width;
      canvas.height = croppedArea.height;

      // Draw the image on the canvas with the correct crop area
      ctx.drawImage(
        image,
        croppedArea.x, // x position on image
        croppedArea.y, // y position on image
        croppedArea.width, // width of the cropped area
        croppedArea.height, // height of the cropped area
        0, 0, // Position on the canvas
        croppedArea.width, // width on the canvas
        croppedArea.height // height on the canvas
      );

      // Convert canvas to image URL
      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      resolve(croppedImageUrl);  // Return the cropped image URL
    };

    image.onerror = (error) => reject(error);
  });
};
