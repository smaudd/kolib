const WaveformData = require("waveform-data");

function scaleY(amplitude, height) {
  const range = 256;
  const offset = 128;
  return height - ((amplitude + offset) * height) / range;
}

export default async function drawWaveform({ canvas, arrayBuffer }) {
  if (process.client) {
    return new Promise((resolve) => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      WaveformData.createFromAudio(
        {
          audio_context: new AudioContext(),
          scale: 32,
          array_buffer: arrayBuffer,
        },
        async (err, waveform) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (err) {
            console.log(err);
          }
          ctx.beginPath();

          const channel = waveform.channel(0);

          // Loop forwards, drawing the upper half of the waveform
          for (let x = 0; x < waveform.length; x++) {
            const val = channel.max_sample(x);
            ctx.lineTo(x + 0.5, scaleY(val, canvas.height));
          }
          // Loop backwards, drawing the lower half of the waveform
          for (let x = waveform.length - 1; x >= 0; x--) {
            const val = channel.min_sample(x);
            ctx.lineTo(x + 0.5, scaleY(val, canvas.height));
          }

          ctx.closePath();
          ctx.fillStyle = "#FFBFB7";
          ctx.strokeStyle = "#FFBFB7";
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.fill();
          resolve({ base64: canvas.toDataURL(), duration: waveform.duration });
        }
      );
    });
  }
}
