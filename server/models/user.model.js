import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    telegram_id: { type: Number, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', UserSchema);
