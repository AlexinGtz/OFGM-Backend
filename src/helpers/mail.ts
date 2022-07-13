import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    SES: new AWS.SES()
});

export const sendMail = async (opt: any) => {
  
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

            <br />
            <br />

            <p style="font-size: smaller;">Si ya no quieres recibir correos haz click <a href="https://sgct180v33.execute-api.us-east-1.amazonaws.com/qa/ignoreMail?email=${opt.ticket?.email}">aqui</a></p>
        </div>
    `,
    attachments: [{
        filename: `Entrada-${opt.ticket?.email}.pdf`,
        content: opt.file
    }]
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}