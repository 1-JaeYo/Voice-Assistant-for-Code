const speech = require('@google-cloud/speech');
const startRecording = require( './record' );
const { NlpManager } = require('node-nlp');
const record = require('node-record-lpcm16');
const fs = require('fs');

const client = new speech.SpeechClient();

const manager = new NlpManager();
manager.load(); // Load the pre-trained model

process.env.GOOGLE_APPLICATION_CREDENTIALS= 'voice-coding-assistant.json';

const recognizeSpeech = async () => {
    const recordingStream = startRecording();

    const request = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    },
    interimResults: false, // If you want interim results, set this to true
    };

    const recognizeStream = client
        .streamingRecognize(request)
        .on('error', console.error)
        .on('data', async (data) => {
            console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`);

            // Process the transcript with the NLP manager
            const transcript = data.results[0].alternatives[0].transcript;
            const response = await manager.process('en', transcript);
            console.log(`Intent: ${response.intent}`);
            // Here you can add more logic based on the detected intent
        });

    recordingStream.pipe(recognizeStream);
};

const listenForWakeWord = () => {
    const request = {
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        },
        interimResults: true, // Set to true for faster, real-time results
    };

    const recognizeStream = client
        .streamingRecognize(request)
        .on('error', console.error)
        .on('data', data => {
            const transcript = data.results[0].alternatives[0].transcript.trim().toLowerCase();
            if (data.results[0].isFinal) {
                console.log(`Final transcript: ${transcript}`);
                if (transcript.includes('zack')) {
                    console.log('Wake word "Zack" detected!');
                    // Trigger the voice assistant functionality here
                }
            }
        });

    record
        .start({
            sampleRateHertz: 16000,
            threshold: 0,
            verbose: false,
            recordProgram: 'rec', // Or 'sox' depending on your system
            silence: '10.0', // Silence duration to stop recording
        })
        .pipe(recognizeStream);
};

recognizeSpeech();
listenForWakeWord();






// async function transcribeAudio(audiofile){
//     try{
//         const speechClient = new speech.SpeechClient();

//         const file = fs.readFileSync(audiofile);
//         const audioBytes = file.toString('base64');

//         const audio = {
//             content: audioBytes,
//         };
        
//         const config = {
//             // encoding: 'LINEAR16',
//             // sampleRateHertz: 24000,  /*/ or 44100 /*/
//             languageCode: 'en-US',
//         };
//         return new Promise((resolve, reject)=>{
//             speechClient.recognize({config, audio})
//             .then(data=>{
//                 resolve(data);
//             })
//             .catch(error=>{
//                 reject(error);
//             })
//         })
//     }catch(error){
//         console.error('ERROR:', error);
//     }
// }

// (async()=>{
//     const data = await transcribeAudio('Turk st 9.wav');
//     console.log(data[0].results[0].alternatives)
//     console.log(data[0].results.map(r => r.alternatives[0].transcript).join('\n'));
// })();