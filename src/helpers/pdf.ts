import { TicketPdf } from "./pdfDefinitions/ticket";
import PdfPrinter from 'pdfmake';

export const buildPdf = (inputData: any) => {
    return new Promise((resolve) => {
        const data = [];

        const document = new TicketPdf(inputData);
        const printer = new PdfPrinter(document.getFonts());
        const pdfDoc = printer.createPdfKitDocument(document.getDefinition());

        pdfDoc.on('data', data.push.bind(data))
        pdfDoc.on('end', () => resolve(Buffer.concat(data)))

        pdfDoc.end();
    })
}