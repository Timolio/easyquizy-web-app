import { Quiz } from '~/server/models/quiz.model';

export default defineEventHandler(async event => {
    const { quizId } = event.context.params;
    const body = await readBody(event);

    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, body, {
            new: true,
            runValidators: true,
        });
        if (!updatedQuiz) throw createError('Quiz not found');
        return { success: true };
    } catch (e) {
        console.error(e);
        throw e;
    }
});
