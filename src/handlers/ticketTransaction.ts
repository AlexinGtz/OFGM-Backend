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
const concertsDb = new CustomDynamoDB(process.env.CONCERTS_TABLE, "id");
const S3 = new AWS.S3({ region: 'us-east-1' });


export const handler = async (event: ConcertEventType) => {
    const { concertId, email, name, atendees } = JSON.parse(event.body);

    if(isEmptyOrNull(concertId) 
        || isEmptyOrNull(email)
        || isEmptyOrNull(name)
        || isEmptyOrNull(atendees)) {
           return handleError("Input data not valid", "ticketTransaction", 400); 
    }

    const existingTicket = await ticketsDb.getByPrimaryKey(email, 'email-index', 'email');

    if(existingTicket.Items.length > 0) {
        return handleError("You already have tickets registered", "ticketTransaction", 400);
    }

    const concertRes = await concertsDb.getByPrimaryKey(concertId);

    if(concertRes.Items.length <= 0) {
        return handleError("Concert not found", "ticketTransaction", 400);
    }

    const concert = CustomDynamoDB.unmarshall(concertRes.Items[0]);

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
        await S3.putObject(s3Params).promise();

        const ticketItem = {
            ...ticket,
            concert: concertId,
            key: s3Params.Key,
            date: new Date().toISOString(),
            scanned: false,
        }
        await ticketsDb.putItem(ticketItem);
    
        // Mandar correo
        await sendMail({ticket, file: s3Params});
    
        // Mandar al FE
        delete s3Params.Body;
        const pdfUrl = await S3.getSignedUrlPromise('getObject', s3Params);

        return {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
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
