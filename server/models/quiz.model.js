import mongoose, { Schema } from 'mongoose';

const OutcomeSchema = new Schema({
    text: { type: String, required: true },
    min_percentage: { type: Number, required: true },
});

const OptionSchema = new Schema({
    text: { type: String, required: true },
    score: { type: Number, required: true },
});

const ElementSchema = new Schema({
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['single-choice', 'multiple-choice', 'text-answer'],
        required: true,
    },
    options: [OptionSchema],
});

const QuizSchema = new Schema({
    user_id: { type: Number, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    elements: [ElementSchema],
    outcomes: [OutcomeSchema],
});

export const Quiz = mongoose.model('Quiz', QuizSchema);
