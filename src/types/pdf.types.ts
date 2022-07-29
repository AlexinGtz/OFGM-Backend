import { Concert } from "./concertTypes.types"

export type TicketsData = {
    id: string,
    concert: Concert,
    email: string,
    name: string,
    atendees: number
}