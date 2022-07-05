import { CloudFormation } from 'aws-sdk';
import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.TICKETS_TABLE, "id");

export const handler = async (event: ConcertEventType) => {
    const { id } = event.pathParameters;

    if(isEmptyOrNull(id)) {
        return handleError("Empty ID", "getTicketById", 400);
    }

    const ticket = await db.getByPrimaryKey(id);

    if(ticket.Items.length === 0) {
        return handleError("Concert Not Found", "getTicketById", 404);
    }

    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        statusCode: 200,
        body: JSON.stringify(CustomDynamoDB.unmarshall(ticket.Items[0])),
    };
}
