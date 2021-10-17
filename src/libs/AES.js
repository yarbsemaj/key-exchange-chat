import CryptoES from "crypto-es";

export function encryptMessage (message, key){
    return CryptoES.AES.encrypt(message, key).toString()
}

export function decryptMessage (cyperText, key){
    return CryptoES.enc.Latin1.stringify(CryptoES.AES.decrypt(cyperText, key))
}
