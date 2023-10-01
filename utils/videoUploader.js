const axios = require('axios');
const fs = require('fs');
const path = require('path');

const videoUploader = async (videoName, videoUrl) => {
    // Local path where you want to save the video

    const downloadDir = path.join(__dirname, 'downloads');

    try {
        fs.mkdirSync(downloadDir, { recursive: true });

        const saveVideo = path.join(__dirname, 'downloads', `${videoName}`);
        const response = await axios.get(videoUrl, { responseType: 'stream' });

        const videoStream = fs.createWriteStream(saveVideo);

        response.data.pipe(videoStream);

        await new Promise((resolve, reject) => {
            videoStream.on('finish', () => {
                console.log('Video downloaded successfully.');
                resolve();
            });

            videoStream.on('error', (error) => {
                console.error('Error downloading the video:', error);
                reject(error);
            });
        });

        const readStream = fs.createReadStream(saveVideo);
        return readStream;
    } catch (error) {
        console.error('Error downloading the video:', error);
        throw error;
    }
};

module.exports = { videoUploader };