import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");

export const handler = async (event: ConcertEventType) => {  
    const body = JSON.parse(event.body)

    const concert = {
        id: uuidv4(),
        ...body.concert,
    }

    try {
        await db.putItem(concert);
    } catch (err) {
        return handleError(err, 'createConcert', 500);
    }

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        statusCode: 200,
        body: JSON.stringify("Success"),
    };
}
