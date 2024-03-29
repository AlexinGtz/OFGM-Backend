import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { optionsRes } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");

export const handler = async (event: ConcertEventType) => {
    const today = new Date();

    const res = await db.getByIndex("concertYear", 
        today.getFullYear().toString(),
        "date-index",
        "concertDate",
        new Date().toISOString(),
        ">=");

    if(res.Items.length === 0) {
        return handleError("No hay eventos próximos", "getConcertById", 404);
    }

    const concerts = res.Items.map((item) => CustomDynamoDB.unmarshall(item))

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify(concerts),
    };
}
