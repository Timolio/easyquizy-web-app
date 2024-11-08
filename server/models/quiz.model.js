import mongoose, { Schema } from 'mongoose';

const OutcomeSchema = new Schema({
    text: { type: String, required: true },
    min_percentage: { type: Number, required: true },
    image_url: { type: String },
});

const OptionSchema = new Schema({
    text: { type: String, required: true, trim: true },
    score: { type: Number, required: true },
    image_url: { type: String },
});

const ElementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['single-choice', 'multiple-choice', 'text-answer'],
        required: true,
    },
    options: [OptionSchema],
    image_url: { type: String },
});

const QuizSchema = new Schema({
    user_id: { type: Number, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    image_url: { type: String },
    elements: [ElementSchema],
    outcomes: [OutcomeSchema],
    created_at: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model('Quiz', QuizSchema);
