const {startRecording,uploadChunks, completeRecording,streamVideo} = require('../controllers/video.controller')
const upload = require('../utils/multer')

const express = require('express')
const router = express.Router();

router.post('/start-recording',startRecording);
router.post('/upload-chunks/:id',upload.single('recorded-video'),uploadChunks);
router.post('/complete-recording/:id',upload.single('recorded-video'),completeRecording);
router.get('/stream/:id',streamVideo);
// router.post('/generate-buffer/:id',upload.single('buffer'),generateBuffer);
// router.get('/:videoName',getVideo);
// router.post('/send/:videoName',sendVideo);

module.exports = router