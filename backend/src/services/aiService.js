const axios = require("axios");

exports.generateCaption = async (imageBuffer) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream"
        }
      }
    );

    return response.data[0].generated_text;
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);
    throw new Error("Failed to generate caption");
  }
};
