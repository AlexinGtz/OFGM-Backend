import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "concertYear");

export const handler = async (event: ConcertEventType) => {
    const { year } = event.pathParameters;

    if(isEmptyOrNull(year)) {
        return handleError("Por favor de proveer el año", "getConcertById", 400);
    }

    const concert = await db.getByPrimaryKey(year, 'date-index');

    if(concert.Items.length === 0) {
        return handleError("No hay concierto para ese año", "getConcertById", 404);
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
