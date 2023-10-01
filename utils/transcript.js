const { Deepgram } = require('@deepgram/sdk');
const { BadRequestError } = require('../errors');

const deepgram = new Deepgram(process.env.DEEPGRAMAPIKEY);
  
  async function downloadAndTranscribe(url) {
    console.log(url);
    const response = await deepgram.transcription.preRecorded(
        {url:url},
        {punctuate:true,utterances:true}
    ).catch(err=>{
        console.log(err)
        throw new BadRequestError("Error getting transcription");
    })
    const srtTranscript = response.toSRT();

    return srtTranscript;
  }

  module.exports = { downloadAndTranscribe }