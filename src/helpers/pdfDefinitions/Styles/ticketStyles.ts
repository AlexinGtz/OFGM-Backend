export class TicketStyles {
    static getStyles() {
        return {
            concert_title: {
                fontSize: 36,
                alignment: 'center',
            },
            concert_date: {
                fontSize: 24,
                alignment: 'center',
            },
            concert_time: {
                fontSize: 42,
                alignment: 'center',
            },
            concert_location: {
                fontSize: 36,
                alignment: 'center',
            },
            concert_quantity_title: {
                fontSize: 36,
                alignment: 'center',
            },
            concert_quantity: {
                fontSize: 36,
                alignment: 'center',
            }
        }
    }

    static getDefaultStyles(){
        return {
            alignment: 'left',
            bold: false,
            font: 'Gruppo',
            fontSize: 16,
            color: '#024959'
        }
    }
}