import { randomBytes } from "crypto";


export function generateRandomString(length: number){
    return randomBytes(Math.ceil(length/2)).toString("hex").slice(0,length);

}

