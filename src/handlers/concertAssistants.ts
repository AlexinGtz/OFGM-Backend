import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.TICKETS_TABLE, "id");

export const handler = async (event: ConcertEventType) => {  
    const { concertId } = event.pathParameters;

    const items = await db.getByPrimaryKey(concertId, 'concert-index', 'concert', ['atendees']);

    if(items.Items.length === 0) {
        return handleError("No hay tickets reservados para ese concierto", "concertAssistants", 404);
    }

    const atendees: Array<any> = items.Items.map((item) => CustomDynamoDB.unmarshall(item));

    const res = atendees.reduce((prev, curr) => ({
        atendees: prev.atendees + curr.atendees
    }));

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify({
            atendees: res.atendees
        }),
    };
}
