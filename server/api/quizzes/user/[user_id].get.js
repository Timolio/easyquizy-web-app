import { Quiz } from '~/server/models/quiz.model';

export default defineEventHandler(async event => {
    console.log(event.context.params);
    const { user_id } = event.context.params;

    console.log(user_id);

    try {
        const quizzes = await Quiz.find({ user_id }).select('title').exec();
        console.log(quizzes);
        return { data: quizzes };
    } catch (e) {
        console.error(e);
        throw e;
    }
});
