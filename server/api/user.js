import { User } from '../models/user.model';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { telegram_id } = query;

    try {
        let user = await User.findOne({ telegram_id });
        if (!user) {
            user = await User.create({
                telegram_id,
            });
        }
    } catch (e) {
        console.log(e);
    }
});
