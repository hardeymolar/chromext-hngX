const mongoose = require('mongoose');

const videoSChema = mongoose.Schema({
    videoName: {
        type: String,
        required: [true, 'please provide a video name'],
    },
    videoUrl: {
        type: String,
        required: [true, 'please provide a url'],
    },
    videoTranscript:{
        type:String,
        default:"",
    },
    publicLink:String,
})


module.exports = mongoose.model('video', videoSChema);