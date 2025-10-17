import cloudinary from "../config/cloudinary.config.js"; // ✅ correct

const uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height) options.height = height;
    if (quality) options.quality = quality;
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options); // ✅ no more undefined
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;
