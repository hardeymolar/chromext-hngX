# ChromeXt Video Management Application

This Node.js Express application is designed for managing video files. It allows you to upload videos, retrieve video details, and send video links via email. The application also includes transcription capabilities using the Deepgram API and video storage using Cloudinary.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)

## Prerequisites
Before running the application, make sure you have the following prerequisites installed and configured:

- Node.js: You need Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

- MongoDB: If you plan to use a MongoDB database, ensure it's set up and running.

- Cloudinary Account: Sign up for a Cloudinary account at [cloudinary.com](https://cloudinary.com/) to obtain API credentials.

- Deepgram API Key: Obtain an API key from Deepgram for speech-to-text capabilities.

- Environment Variables: Create a `.env` file in the project root directory and define the following environment variables:

  ```
  PORT=3000
  MONGOURI=mongodb://localhost:27017/chromext
  CLOUDNAME=your_cloudinary_cloud_name
  CLOUDAPIKEY=your_cloudinary_api_key
  CLOUDAPISECRET=your_cloudinary_api_secret
  DEEPGRAMAPIKEY=your_deepgram_api_key
  SITEURL=localhost:3000
  ```

## Installation
1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/hardeymolar/chromext-video-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd chromext-video-app
   ```

3. Install the required npm packages:

   ```bash
   npm install
   ```

## Configuration
- Ensure you've set up the environment variables as described in the prerequisites section.
- Configure Cloudinary and Deepgram API keys in the respective code files.

## Usage
To run the application, use the following command:

```bash
npm start
```

The application will start and listen on the specified port (default is 3000). You can access it in your web browser at `http://localhost:3000`.

## Endpoints
The application exposes the following endpoints:

- `POST /videos`: Upload a video.
- `GET /:videoName`: Retrieve video details.
- `POST /send/:videoName`: Send a video link via email.

Refer to the provided code and controller functions for more details on how these endpoints work.

## Contributing
Contributions to this project are welcome! If you find any issues or want to add new features, please open an issue or create a pull request.
