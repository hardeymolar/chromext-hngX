require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDAPISECRET
});

const videoUploader = async (id, path) => {
    const result = await cloudinary.uploader.upload(path, {
        resource_type: 'video', // Specify that this is a video
        public_id: `${id}_video`, // Customize the public_id as needed
        crop: 'scale', // Adjust the crop mode as needed
        format: 'mp4', // Specify the desired video format
    });

    const videoUrl = result.url;
    return videoUrl;
};

module.exports = { videoUploader };
