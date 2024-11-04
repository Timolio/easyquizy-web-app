import { Result } from '~/server/models/result.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const newResult = new Result({
        quiz_id: body.quiz_id,
        user_id: body.user_id,
        score: body.score,
    });

    try {
        const savedResult = await newResult.save();
        return { success: true };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: 'Failed to save quiz result',
        };
    }
});
