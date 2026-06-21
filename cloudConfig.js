const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

//configuring i.e. accessing cloudinary credentials in this js file
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

//define storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'joyhub_DEV',
      allowedFormats: ["png","jpg","jpeg"],//formats of our file(s)
    },
  });

module.exports={
    cloudinary,
    storage
}