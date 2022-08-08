import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.IGNORED_MAILS_TABLE, "email");

export const handler = async (event: ConcertEventType) => {
    console.log(event)

    const item = {
        email: event.queryStringParameters['email']
    }

    try {
        await db.putItem(item);
    } catch (err) {
        return handleError(err, 'ignoreMail', 500);
    }

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify("Success"),
    };
}
