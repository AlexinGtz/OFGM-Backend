export const handleError = (message: string, key: string, code: number) => {

    console.log(message)
    
    const error = {
        message,
        key,
    }
    
    return {
        statusCode: code,
        body: JSON.stringify(error),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    }
}