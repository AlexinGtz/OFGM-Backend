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
const ignoredMailsDb = new CustomDynamoDB(process.env.IGNORED_MAILS_TABLE, "email");

const S3 = new AWS.S3({
    // s3ForcePathStyle: true,
    // credentials: {
    //     accessKeyId: "S3RVER",
    //     secretAccessKey: "S3RVER",
    // },
    region: 'us-east-1',
    // endpoint: 'http://localhost:3005'
});

export const handler = async (event: ConcertEventType) => {
    const { concertId, email, name, atendees } = JSON.parse(event.body);

    if(isEmptyOrNull(concertId) 
        || isEmptyOrNull(email)
        || isEmptyOrNull(name)
        || isEmptyOrNull(atendees)) {
           return handleError("Datos no válidos", "ticketTransaction", 400); 
    }

    const existingTickets = await ticketsDb.getByPrimaryKey(email, 'email-index', 'email');
    const concertTickets = existingTickets.Items.map((item: any) => CustomDynamoDB.unmarshall(item));
    const concertTicket = concertTickets.find((ticket) => ticket.concert === concertId);
    
    if(concertTicket) {
        return handleError("Ya tienes una entrada con tu correo", "ticketTransaction", 400);
    }

    const concertRes = await concertsDb.getByPrimaryKey(concertId);

    if(concertRes.Items.length <= 0) {
        return handleError("Concierto no encontrado", "ticketTransaction", 400);
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

        const s3Params: PutObjectRequest = {
            Bucket: process.env.DATA_BUCKET,
            Key: `tickets/${ticket.id}.pdf`,
            Body: fileData,
        };

        // Mandar correo
        const ignoreMail = await ignoredMailsDb.getByPrimaryKey(ticket.email);
        if(!(ignoreMail.Items.length > 0)) {
            await sendMail({ticket, file: fileData});
        } 

        // Guardar en s3
        await S3.putObject(s3Params).promise();

        const ticketItem = {
            ...ticket,
            concert: concertId,
            key: s3Params.Key,
            date: new Date().toISOString(),
            scanned: false,
        }
        await ticketsDb.putItem(ticketItem);
    
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
