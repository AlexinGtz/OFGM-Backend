import { CustomDynamoDB } from '../helpers/dynamodb';
import { ConcertEventType } from '../types/concertTypes.types';

export const handler = async (event: ConcertEventType) => {
    // const db = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");

    // const concert = await db.get(event.pathParameters.id);

    console.log(process.env.CONCERTS_TABLE)

    return {
        headers: {},
        body: JSON.stringify("Success"/*CustomDynamoDB.unmarshall(concert.Items[0])8*/),
    };
}
