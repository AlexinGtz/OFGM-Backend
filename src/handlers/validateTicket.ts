import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
const db = new CustomDynamoDB(process.env.TICKETS_TABLE, "id");

export const handler = async (event: ConcertEventType) => {
    const { ticketId, concert, email } = JSON.parse(event.body);

    if(isEmptyOrNull(ticketId)) {
        if(isEmptyOrNull(email)){
            return handleError("Missing Search Key", "validateTicket", 400);
        }
    }

    const res = await db.getByPrimaryKey(ticketId ? ticketId : email,
        ticketId ? null : 'email-index',
        ticketId ? null : 'email');

    if(res.Items.length === 0) {
        return handleError("Ticket Not Found", "validateTicket", 404);
    }

    const ticket = CustomDynamoDB.unmarshall(res.Items[0]);

    if(ticket.concert !== concert) {
        return handleError("Ticket Is for another concert", "validateTicket", 409);
    }

    if(ticket.scanned) {
        return handleError("Ticket Was already Scanned", "validateTicket", 409);
    }

    const newTicket = {
        ...ticket,
        scanned: true
    }

    try{
        await db.putItem(newTicket);
    }catch (err) {
        return handleError(err, 'validateTicket', 500);
    }


    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
        body: JSON.stringify(newTicket),
    };
}
