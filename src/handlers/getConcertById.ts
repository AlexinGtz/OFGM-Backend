import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';

export const handler = async (event: ConcertEventType) => {
    const { id } = event.pathParameters;

    if(isEmptyOrNull(id)) {
        return handleError("Empty ID", "getConcertById", 400);
    }

    console.log(CustomDynamoDB)

    const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");

    const concert = await db.get(id);

    if(concert.Items.length === 0) {
        return handleError("Concert Not Found", "getConcertById", 404);
    }

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        statusCode: 200,
        body: JSON.stringify(CustomDynamoDB.unmarshall(concert.Items[0])),
    };
}
