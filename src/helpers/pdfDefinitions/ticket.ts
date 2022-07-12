import fs from 'fs';
import { TicketsData } from '../../types/pdf.types';
import { TicketStyles } from './Styles/ticketStyles';

export class TicketPdf {
    data: TicketsData;
    
    constructor(data) {
        this.data = data;
    }

    getDefinition() {
        return{
            content: [
                this._getHeader(),
                this._getInfo(),
                this._getQR(),
                this._getLocation(),
                this._getAtendees(),
            ],
            info: {
                author: 'OFGM',
                creator: 'OFGM',
                keywords: 'Orchestra',
                subject: 'Ticket',
                title: 'Ticket',
            },
            defaultStyle: TicketStyles.getDefaultStyles(),
            pageMargins: [15,10,15,20],
            pageOrientation: 'portrait',
            pageSize: 'A4',
            styles: TicketStyles.getStyles()
        }
    }

    getFonts() {
        return {
            Gruppo: {
                normal: `${__dirname}/assets/Gruppo.ttf`,
                bold: `${__dirname}/assets/Gruppo.ttf`,
                italics: `${__dirname}/assets/Gruppo.ttf`,
                bolditalics: `${__dirname}/assets/Gruppo.ttf`,
            }
        }
    }

    _parseDate(dateString) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
        };

        const currentDate = date.toLocaleDateString('es-MX', options).split(" ");

        return `${currentDate[0]} ${currentDate[1]} de ${currentDate[3]} del ${currentDate[5].split(',')[0]}`
    }

    _parseTime(dateString) {
        
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            hour: "2-digit",
            minute: "2-digit" 
        };

        const currentDate = date.toLocaleDateString('es-MX', options).split(" ");

        return `${currentDate[1]}`
    }

    _getHeader() {
        const logo = fs.readFileSync(`${__dirname}/assets/Logo.svg`);

        return [
            {
                svg: logo,
                width: 150,
                height: 150,
                alignment: 'center',
                margin: [0,15,0,0]
            }
        ]
    }

    _getInfo() {
        return [
            {
                columns: [
                    {
                        text: [{style: 'concert_title', text: `${this.data.concert.concertTitle}`}],
                        margin: [0,20,0,10],
                    }
                ]
            },
            {
                columns: [
                    {
                        text: [{style: 'concert_date', text: `${this._parseDate(this.data.concert.concertDate)}`}],
                        margin: [0,10,0,10],
                    }
                ]
            },
            {
                columns: [
                    {
                        text: [{style: 'concert_time', text: `${this._parseTime(this.data.concert.concertDate)}`}],
                        margin: [0,10,0,10],
                    }
                ]
            }
        ]
    }

    _getQR() {
        return [
            {
                qr: `${JSON.stringify({
                    id: this.data.id,
                    atendees: this.data.atendees,
                })}`,
                margin: [0,30,0,30],
                fit: 250,
                style: {alignment: 'center'}
            }
        ]
    }

    _getLocation() {
        return [
            {
                columns: [
                    {
                        text: [{style: 'concert_location', text: `${this.data.concert.concertLocationName}`}]
                    }
                ]
            }
        ]
    }

    _getAtendees() {
        return [
            {
                columns: [
                    {
                        text: [{style: 'concert_quantity_title', text: `${this.data.atendees} Boletos`}],
                        margin: [0,40,0,10]
                    }
                ]
            },
        ]
    }
}