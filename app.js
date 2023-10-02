const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const notfound = require('./middlewares/not-found');
const cors = require('cors');
const router = require('./routes/router');

const express = require('express');
const app = express();

app.use(express.json())
const corsOptions = {
  origin: 'https://github.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true, // Enable preflight requests
  optionsSuccessStatus: 204, // Use 204 No Content for preflight success status
};

app.options('*', cors(corsOptions)); // Set up a global OPTIONS handler
app.use(cors(corsOptions)); // Use the configured CORS middleware for all routes


app.get('/',(req,res)=>{
    res.send('welcome to chromeXt api')
});
app.use('/',router);

// const whiteList = ['https://www.github.com']

// app.use(
//   cors({
//     origin: "*",
//     // origin: whiteList,
//     credentials: true,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     optionsSuccessStatus: 200,
//     preflightContinue: false,
//     allowedHeaders: '*',
//   }),
// );

app.use(errorHandlerMiddleware);
app.use(notfound);
const start = async () => {
    try {
      const PORT = process.env.PORT
      await connectDB(process.env.MONGOURI);
      app.listen(PORT, () => console.log(`app is listening on port 3000...`));
    } catch (error) {
      console.log(error);
    }
  };

  start();
