import { handler } from '../testLambda';

describe('Sample Test', () => {
    it('Should return Successful', async () => {
        const res = await handler({});

        const expectedResponse = {
            body: JSON.stringify("Success"),
            headers: {}
        }

        expect(res).toEqual(expectedResponse);
    });

    it('Should enter if', async () => {
        const event = {
            id: 1,
            name: "uno"
        }
        const res = await handler(event);

        const expectedResponse = {
            body: JSON.stringify(event.id),
            headers: {}
        }

        expect(res).toEqual(expectedResponse);
    });
});