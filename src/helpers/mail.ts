import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { isLocal } from './validation';

const transporter = nodemailer.createTransport({
    SES: new AWS.SES()
});
const S3 = new AWS.S3({
    s3ForcePathStyle: true,
    credentials: isLocal() ? {accessKeyId: "S3RVER",secretAccessKey: "S3RVER"} : null,
    region: 'us-east-1',
    endpoint: isLocal() ? 'http://localhost:3005' : null
});

export const sendMail = async (opt: any) => {
    const s3Params = {
        Bucket: opt.file?.Bucket,
        Key: opt.file?.Key,
    }
    const ticketPdf = await S3.getObject(s3Params).promise();
  
    const text = 'Adjunto a este correo encontraras el boleto para tu conceirto. Favor de presentarlo en tu celular o impreso.';

    // send mail with defined transport object
    const info = await transporter.sendMail({
    from: '"OFGM" <contacto@ofgm.com.mx>',
    to: opt.ticket?.email,
    subject: "Tu boleto para el concierto",
    text: text,
    html: `
        <div>
            <h1>Boleto para tu concierto</h1>

            <p>Adjunto a este correo encontraras el boleto para tu concierto. Favor de presentarlo en tu celular o impreso.</p>
            <p>Te esperamos!</p>
        </div>
    `,
    attachments: [{
        filename: "ticket.pdf",
        content: ticketPdf.Body
    }]
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}