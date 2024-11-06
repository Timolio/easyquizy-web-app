import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';

const config = useRuntimeConfig();

const credentials = JSON.parse(config.gcpServiceAccountKey);

const storage = new Storage({
    credentials,
});

const bucketName = 'squidquiz-bucket';
const bucket = storage.bucket(bucketName);

const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
];

export default defineEventHandler(async event => {
    const contentType = getHeader(event, 'Content-Type');

    if (!allowedMimeTypes.includes(contentType)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'MimeType not allowed',
        });
    }

    const uniqueFileName = uuidv4();

    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType,
    };

    try {
        const [url] = await bucket.file(uniqueFileName).getSignedUrl(options);
        return {
            uploadUrl: url,
            publicUrl: `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`,
        };
    } catch (e) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Error generating url',
        });
    }
});
