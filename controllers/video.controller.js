require('dotenv').config();
const { videoUploader } = require('../utils/videoUploader');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
// const video = require('../models/video.model');
// const { downloadAndTranscribe } = require('../utils/transcript');
// const { sendVideoToEmail } = require('../utils/mailer/email.service');
const SITEURL = process.env.SITEURL;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
// const util = require('util');
const childProcess = require('child_process');
const path = require('path');
// const ffmpeg = require('fluent-ffmpeg');


// const writeFileAsync = util.promisify(fs.writeFile);

const recordings = new Map();
const videoDirectory = path.join(__dirname, 'downloads');

// Function to convert video to MP4 using FFmpeg
function convertToMP4(inputPath, outputPath, callback) {
    const ffmpegCommand = `ffmpeg -i ${inputPath} -c:v libx264 -profile:v main -pix_fmt yuv420p -c:a aac -strict experimental -movflags faststart -f mp4 ${outputPath}`;

    childProcess.exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`FFmpeg error: ${error}`);
            callback(error);
        } else {
            console.log('Video converted to MP4 successfully.');
            callback(null);
        }
    });
}

const startRecording = (req, res, next) => {
    try {
        // res.setHeader('Access-Control-Allow-Origin', '*');    
        // res.setHeader('Access-Control-Request-Headers', '*');    
        // res.setHeader('Access-Control-Request-Method', '*');       
        // res.setHeader('Access-Control-Allow-Credentials', 'true');    
        // Generate a unique ID for the recording session
        const recordingId = uuidv4();

        // Create an entry in the recordings map for the ID
        recordings.set(recordingId, []);

        // Send the generated ID to the frontend
        res.status(StatusCodes.OK).json({
            status: 'success',
            id: recordingId
        });
        next()
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const uploadChunks = (req, res, next) => {
    try {
        const recordingId = req.params.id;
        const chunk = req.file.buffer; // Binary chunk received from the frontend
        if (!chunk) {
            throw new BadRequestError('No chunk uploaded.');
        }
        if (!recordings.has(recordingId)) {
            throw new BadRequestError('Invalid recording ID.');
        }
        // // Save the chunk to the temporary directory
        // const chunkFileName = `${tempDir}/${recordingId}_${Date.now()}.webm`;
        // fs.writeFileSync(chunkFileName, chunk);

        // Add the chunk's file path to the recording session
        recordings.get(recordingId).push(chunk);

        // Send a response to indicate successful receipt of the chunk
        res.status(StatusCodes.OK).json({
            status: "success",
            message: 'Chunk received.'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const completeRecording = async (req, res, next) => {
    try {
        const recordingId = req.params.id;
        const chunk = req.file.buffer; // Final video chunk received from the frontend

        if (!chunk) {
            throw new BadRequestError('No chunk uploaded.');
        }
        if (!recordings.has(recordingId)) {
            throw new BadRequestError('Invalid recording ID.');
        }
        // Add the final chunk to the recorded chunks
        const recordingChunks = recordings.get(recordingId);
        recordingChunks.push(chunk);

        // Concatenate video chunks into one buffer
        const completeVideoBuffer = Buffer.concat(recordingChunks);
        // Save the complete video to the filesystem
        const fileName = `video_${recordingId}.webm`;
        fs.writeFile(fileName, completeVideoBuffer, (err) => {
            if (err) {
                console.error('Error saving video:', err);
                return res.status(500).json({ error: 'Error saving video.' });
            }
            console.log('Video saved successfully:', fileName);

            // Cleanup: Remove the stored chunks from the Map
            recordings.delete(recordingId);

            // Send a response to indicate successful completion
            res.status(StatusCodes.OK).json({ status: "success", message: 'Recording completed and saved successfully.' });
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const streamVideo = async (req, res, next) => {
    try {
        const recordingId = req.params.id;
        const outputVideoPath = `public/video_${recordingId}.mp4`;
        const inputVideoPath = `${videoDirectory}/video_${recordingId}.mp4`;


        // Check if the MP4 file exists, and if not, convert it
        if (fs.existsSync(outputVideoPath)) {
            // The MP4 file already exists, so stream it directly
            const videoStream = fs.createReadStream(outputVideoPath);
            res.set('Content-Type', 'video/mp4');
            videoStream.pipe(res);
        } else {
            convertToMP4(inputVideoPath, outputVideoPath, (conversionError) => {
                if (conversionError) {
                    return res.status(500).json({ error: 'Error converting video to MP4.' });
                }

                // Stream the converted MP4 video
                const videoStream = fs.createReadStream(outputVideoPath);
                videoStream.on('open', () => {
                    res.set('Content-Type', 'video/mp4');
                    videoStream.pipe(res);
                });

                videoStream.on('error', () => {
                    res.status(500).json({ error: 'Error streaming video.' });
                });
            });
        }

    } catch (error) {
        next(error);
    }
};

const outputDirectory = videoDirectory;

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

module.exports = { startRecording, uploadChunks, completeRecording, streamVideo }

// const sendVideo = async (req, res) => {
//     try {
//         const videoName = req.params.videoName;
//         const email = req.body.email;
//         if (!email) {
//             throw new BadRequestError("Please provide an email");
//         }
//         const Video = `${SITEURL}/${videoName}`;
//         await sendVideoToEmail(email, Video);
//         res.status(StatusCodes.OK).json({ status: "success", message: `Your video link has been sent to ${email}` })
//     } catch (error) {
//         next(error);
//     }
// }


