export const handler = async (event) => {
    console.log("Hello");
    return {
        headers: {},
        body: JSON.stringify("Sucess"),
    };
}
