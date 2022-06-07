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
});