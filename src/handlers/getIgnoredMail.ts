import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.IGNORED_MAILS_TABLE, "email");

export const handler = async (event: ConcertEventType) => {
    const { email } = event.pathParameters;

    if(isEmptyOrNull(email)) {
        return handleError("No hay correo", "getIgnoredMails", 400);
    }

    const ignoredMails = await db.getByPrimaryKey(email);

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify({
            ignored: !(ignoredMails.Items.length === 0),
        }),
    };
}
