const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

// Add some intents and example sentences
manager.addDocument('en', 'debug my code', 'debug');
manager.addDocument('en', 'explain this error', 'explainError');
manager.addDocument('en', 'why is this not working', 'debug');
manager.addDocument('en', 'what does this function do', 'explainFunction');

// Train and save the model
const trainAndSave = async () => {
    await manager.train();
    manager.save();
    console.log('Training complete and model saved');
};

trainAndSave();