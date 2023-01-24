import CryptoJS from "crypto-js";
import { generateUID } from "../utils/hashSystem";
import useConsole from "./useConsole";

//* ENCRYPT/DECRYPT WITH ONE SIMPLE FUNCTION
//? Input data to be encrypted or an object with the 'hash' and 'iv' to be decrypted
//? Example use cases below!
const useCrypto = ( input: { hash: string, iv: string } | any | any[], secret?:string ) => {

  //? Use { hash: string, iv: string } format for decryption or if
  //? you wish to use your own IV for encryption.
  
  //? Parse strings with CryptoJS using UTF-8 encoding
  const cryptoParse = (str: string) => CryptoJS.enc.Utf8.parse(str);

  //? Get secrets for hashing operations to work
  const cryptoSecret = secret ? secret : process.env.CRYPTO_SECRET_KEY
    ?  process.env.CRYPTO_SECRET_KEY : "12345678901234567890123456789012";
  const uuid = generateUID(22);

  //? Get 'data', 'iv', and 'key'
  const data = input?.hash ? input.hash : input;
  const iv = input?.iv ? input.iv : uuid;
  const key = cryptoParse(cryptoSecret);

  //? Perform AES encryption/decryption using CryptoJS
  const encrypt = () => {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify({data}), key, { iv: cryptoParse(iv) }).toString()
    }
    catch(e) {
      return false;
    }
  }
  const decrypt = () => {
    if(input?.hash && input?.iv ) { // Checks there is an input object with 'hash' and 'iv' before atttempting decryption
      try {
        return JSON.parse(CryptoJS.AES.decrypt(input.hash.toString(), key, { iv: cryptoParse(input.iv) }).toString(CryptoJS.enc.Utf8)).data
      }
      catch(e) {
        const message = 'Decryption failed. Check to see if IV is correct first before proceeding with troubleshooting.'
        useConsole(message, 'logError');
        return false;
      }
    }
  }


  //? If encryption/decryption is successful return data, otherwise return null
  const encrypted = encrypt() ? { hash: encrypt(), iv: uuid } : null;
  const decrypted = decrypt() ? decrypt() : null;

  //? Error check...
  if(!encrypted && !decrypted) {
    // Throw error if both encryption and decryption fail
    useConsole(`'useCrypto' failed. Unable to read data.`, 'logError');
  }

  //? Output data as an object to access with dot notation or destructuring
  return {
    encrypt: encrypted, // Outputs object with hashed 'data' and 'iv'
    decrypt: decrypted, // Outputs decrypted hash
  }
}

export default useCrypto;

//! NOTE: Be sure to use a complex secret key stored in your .env and never give it out. It is also best practice to secure
//! the IV generated from encryption separate from the hash for extra precaution. it may not be necessary in your case but
//! just use discretion as these practices can greatly reduce your risk of having sensitive data breached.


//! EXAMPLES
//? const crpt = 'This means war!'
//? const { encrypt } = useCrypto(crpt)
//? console.log(encrypt)  // Outputs the 'hash' and 'iv'
//? const hashedObj = { hash: 'f9I4cdmtig8bdywMABb9/rQ2tHjsEksBQ1PQOLYH3Lg=', iv: 'xws49msvy3x705zua0lhdc'}
//? const { decrypt } = useCrypto(hashedObj)
//? console.log(decrypt) // Outputs 'This means war!'