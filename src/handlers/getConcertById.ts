import { CustomDynamoDB } from '../helpers/dynamodb';
import { ConcertEventType } from '../types/concertTypes.types';

export const handler = async (event: ConcertEventType) => {
    const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");

    const concert = await db.get(event.pathParameters.id);

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(CustomDynamoDB.unmarshall(concert.Items[0])),
    };
}
