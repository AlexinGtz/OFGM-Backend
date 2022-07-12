export const isEmptyOrNull = (param: any) => {
    if(!param || param === "" || param === " "){
        return true;
    }
    return false;
}

export const isLocal = () => {
    return process.env.STAGE === 'local';
}

export const optionsRes = () => {
    return {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
        },
        statusCode: 200,
    };
}