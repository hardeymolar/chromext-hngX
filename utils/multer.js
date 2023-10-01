const multer = require('multer')

const storage = multer.memoryStorage({});

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('video')){
//         cb(null,true);
//     }else {
//          cb('please upload a video',false)
//     }
// }

const upload = multer({ storage:storage });


module.exports = upload;






