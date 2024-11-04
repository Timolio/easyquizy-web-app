import mongoose, { Schema } from 'mongoose';

const ResultSchema = new Schema({
    quiz_id: { type: mongoose.Types.ObjectId, ref: 'Quiz', required: true },
    user_id: { type: Number, required: true },
    score: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
});

export const Result = mongoose.model('Result', ResultSchema);
