export const isEmptyOrNull = (param: any) => {
    if(!param || param === "" || param === " "){
        return true;
    }
    return false;
}