require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('./errors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const app = express();

// Configuration
const tempDir = path.join(__dirname, 'temp'); // Temporary directory to store chunks
const outputDir = path.join(__dirname, 'downloads'); // Directory to save the concatenated video
const videoDirectory = path.join(__dirname, 'downloads');
const maxFileSize = 10 * 1024 * 1024; // Maximum chunk file size (adjust as needed)
const maxChunks = 100; // Maximum number of chunks to concatenate (adjust as needed)

// Create the output and temp directories if they don't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const recordingId = req.params.id || uuidv4();
        cb(null, `${recordingId}_${Date.now()}.webm`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize },
});

// Function to concatenate and save video chunks
function concatenateAndSaveChunks(chunkDataArray, outputFilepath, res) {
    const ffmpegCommand = ffmpeg();
    chunkDataArray.forEach((chunkPath) => {
        ffmpegCommand.input(chunkPath);
    });

    ffmpegCommand
        .on('end', () => {
            console.log('Video chunks concatenated and saved:', outputFilepath);
            res.status(StatusCodes.OK).send('Recording completed.');
        })
        .on('error', (err) => {
            console.error('Error concatenating video chunks:', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error concatenating video chunks');
        })
        .mergeToFile(outputFilepath, outputDir);
}

// Routes
app.post('/start-recording', (req, res) => {
    const recordingId = uuidv4();
    res.status(StatusCodes.OK).json({
        status: 'success',
        id: recordingId,
    });
});

app.post('/upload-chunk/:id', upload.single('chunk'), (req, res) => {
    const recordingId = req.params.id;
    const chunkPath = req.file.path;

    // You may want to perform additional checks here, e.g., validate recordingId

    // Check if the number of chunks exceeds the maximum
    if (recordings[recordingId].length >= maxChunks) {
        return res.status(StatusCodes.BAD_REQUEST).send('Maximum number of chunks reached.');
    }

    // Add the chunk's file path to the recording session
    recordings[recordingId].push(chunkPath);

    res.status(StatusCodes.OK).send('Chunk received.');
});

app.post('/complete-recording/:id', (req, res) => {
    const recordingId = req.params.id;

    // Check if the recording session exists
    if (!recordings[recordingId]) {
        return res.status(StatusCodes.BAD_REQUEST).send('Invalid recording ID.');
    }

    // Concatenate and save all chunks as a single video
    const outputFilePath = `${outputDir}/${recordingId}_recorded_video.webm`;
    concatenateAndSaveChunks(recordings[recordingId], outputFilePath, res);

    // Clean up the temporary files
    recordings[recordingId].forEach((chunkPath) => {
        fs.unlinkSync(chunkPath);
    });

    // Remove the recording session
    delete recordings[recordingId];
});

app.get('/stream-video/:id', (req, res) => {
    const recordingId = req.params.id;
    const videoName = `${recordingId}_recorded_video.webm`;
    const videoPath = path.join(videoDirectory, videoName);

    if (!fs.existsSync(videoPath)) {
        return res.status(StatusCodes.NOT_FOUND).send('Video not found');
    }

    // Set headers for video streaming
    res.setHeader('Content-Type', 'video/webm');
    res.setHeader('Content-Length', fs.statSync(videoPath).size);
    res.setHeader('Content-Disposition', `inline; filename="${videoName}"`);

    // Create a read stream from the video file and pipe it to the response
    const videoStream = fs.createReadStream(videoPath);

    videoStream.on('error', (error) => {
        console.error('Error streaming video:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error streaming video');
    });

    videoStream.pipe(res);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Map to store video recording sessions
const recordings = {};

// You may want to handle cleanup of old recording sessions to prevent disk space issues.
