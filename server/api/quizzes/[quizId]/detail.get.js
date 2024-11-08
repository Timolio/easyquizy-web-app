import { Quiz } from '~/server/models/quiz.model';

export default defineEventHandler(async event => {
    const { quizId } = event.context.params;
    const telegramId = getHeader(event, 'X-Telegram-ID');

    if (!telegramId)
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz)
            throw createError({
                statusCode: 404,
                statusMessage: 'Quiz not found',
            });

        // if (quiz.user_id.toString() !== telegramId)
        //     throw createError({ statusCode: 403, statusMessage: 'Forbidden' });

        return { data: quiz };
    } catch (e) {
        // console.error(e);
        throw createError({
            statusCode: 400,
            statusMessage: 'Error fetching quiz',
        });
    }
});
