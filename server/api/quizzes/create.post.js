import { Quiz } from '~/server/models/quiz.model';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const newQuiz = new Quiz({
        user_id: body.user_id,
        title: body.title,
        description: body.description,
        elements: body.elements,
        outcomes: body.outcomes,
    });

    try {
        const savedQuiz = await newQuiz.save();
        return { success: true, data: savedQuiz };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: 'Failed to create quiz',
        };
    }
});
