import { eventType } from './types/testLambda.types';

export const handler = async (event: eventType) => {
    if(event.id){
        console.log('Has id');
    }

    console.log(process.env.USERS_TABLE);

    return {
        headers: {},
        body: JSON.stringify(event.id ? event.id : "Success"),
    };
}
