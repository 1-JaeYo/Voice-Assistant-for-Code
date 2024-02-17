const record = require('node-record-lpcm16');

// Function to start recording voice
const startRecording = () => {
console.log('Recording started. Please speak into the microphone.');

const recording = record
    .record({
    sampleRate: 16000,
    threshold: 0.5, // Silence threshold
    verbose: false,
    recordProgram: 'rec', // Try 'rec' or 'sox' depending on your OS
    silence: '1.0', // Seconds of silence before ending
    })
    .stream();

return recording;
};

module.exports = startRecording;