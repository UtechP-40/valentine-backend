import mongoose from 'mongoose';

const loveLetterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    from: {
        type: String,
        required: true,
        trim: true,
    },
    
},{timestamps: true});

const LoveLetter = mongoose.model('LoveLetter', loveLetterSchema);

export default LoveLetter;