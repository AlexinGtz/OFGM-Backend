export const handler = (event) => {
    console.log("Hello");
    return {
        headers: {},
        body: JSON.stringify("Succesful"),
    };
}
