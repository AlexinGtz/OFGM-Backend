import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");

export const handler = async (event: ConcertEventType) => {
    const { id } = event.pathParameters;

    if(isEmptyOrNull(id)) {
        return handleError("Empty ID", "getConcertById", 400);
    }

    const concert = await db.getByPrimaryKey(id);

    if(concert.Items.length === 0) {
        return handleError("Concert Not Found", "getConcertById", 404);
    }

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify(CustomDynamoDB.unmarshall(concert.Items[0])),
    };
}
