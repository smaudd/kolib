const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

module.exports = (req, res) => {
  console.log(ffmpeg)
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  })
}