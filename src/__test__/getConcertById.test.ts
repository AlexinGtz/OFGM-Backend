import { handler } from "../handlers/getConcertById";
import mockConcerts from '../seeds/concerts.json';
import { CustomDynamoDB } from '../helpers/dynamodb';

jest.mock("../helpers/dynamodb", () => ({
    CustomDynamoDB: jest.fn(() => ({
        get: jest.fn((id) => {
            if(!id || id === 'invalid_id') {
                return {
                    Items: []
                }
            }
            return {
                Items: [mockConcerts.find((con) => con.id === id)]
            }
        }),
    })),
}));

describe("getConcertById",() => {

    test("Throws error if path has no id", async () => {
        const event = {
            pathParameters:{
                id: ""
            }
        };

        const res = await handler(event);

        expect(res.statusCode).toEqual(400);
        const body = JSON.parse(res.body);
        expect(body.message).toEqual("Empty ID");
        expect(body.key).toEqual("getConcertById");
    });

    test("Throws error if there in no concert in DB", async () => {
        const event = {
            pathParameters:{
                id: "invalid_id"
            }
        };

        process.env.CONCERTS_TABLE = "test-concerts";

        const res = await handler(event);

        expect(res.statusCode).toEqual(404);
        const body = JSON.parse(res.body);
        expect(body.message).toEqual("Concert Not Found");
        expect(body.key).toEqual("getConcertById");
    });

    test("Sucessful Call", async () => {
        const event = {
            pathParameters:{
                id: "c759738c-4449-44e2-9454-907c2ceccbf1"
            }
        };

        CustomDynamoDB.unmarshall = jest.fn((item) => item);

        process.env.CONCERTS_TABLE = "test-concerts";

        const res = await handler(event);

        expect(res.statusCode).toEqual(200);
        const body = JSON.parse(res.body);
        expect(body).toEqual(mockConcerts.find((con) => con.id === event.pathParameters.id))
    });
});