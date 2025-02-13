import mongoose from 'mongoose';

const loveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    partnerName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    firstMet: {
        type: Date,
        required: true
    },
    loveLetters:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LoveLetter'
        }
    ]
}, { timestamps: true });

const Love = mongoose.model('Love', loveSchema);

export default Love ;