import AWS from 'aws-sdk';
import { handleError } from '../errors/handler';
import { CustomDynamoDB } from '../helpers/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { isEmptyOrNull } from '../helpers/validation';
import { ConcertEventType } from '../types/concertTypes.types';
import { buildPdf } from '../helpers/pdf';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { sendMail } from '../helpers/mail';
const ticketsDb = new CustomDynamoDB(process.env.TICKETS_TABLE, "id");
const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    credentials: {
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
    },
    region: 'us-east-1',
    endpoint: 'http://localhost:3005'
});


export const handler = async (event: ConcertEventType) => {
    const { concert, email, name, atendees } = JSON.parse(event.body);

    if(isEmptyOrNull(concert) 
        || isEmptyOrNull(email)
        || isEmptyOrNull(name)
        || isEmptyOrNull(atendees)) {
           return handleError("Input data not valid", "ticketTransaction", 400); 
    }

    const existingTicket = await ticketsDb.getByPrimaryKey(email, 'email-index');

    if(existingTicket.Items.length > 0) {
        return handleError("You already have tickets registered", "ticketTransaction", 400);
    }

    const ticket = {
        id: uuidv4(),
        concert,
        email,
        name,
        atendees,
    }

    try {
        const fileData = await buildPdf(ticket);

        // Guardar en s3
        const s3Params: PutObjectRequest = {
            Bucket: process.env.DATA_BUCKET,
            Key: `tickets/${ticket.id}.pdf`,
            Body: fileData,
        };
        await s3.putObject(s3Params).promise();

        const ticketItem = {
            ...ticket,
            key: s3Params.Key,
        }
        await ticketsDb.putItem(ticketItem);
    
        // Mandar correo
        await sendMail({ticket, file: s3Params});
    
        // Mandar al FE
        delete s3Params.Body;
        const pdfUrl = await s3.getSignedUrlPromise('getObject', s3Params);

        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            },
            statusCode: 200,
            body: JSON.stringify({
                message: "Success",
                pdfUrl,
            }),
        };
    } catch(err) {
        //Cleanup
        return handleError(err, "ticketTransaction", 500);
    }
}
