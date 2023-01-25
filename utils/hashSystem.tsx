import * as crypto from 'crypto';
import { shuffleStr, } from './generator';
import { windowExists } from "../utils/validation";

//! //============\\ !//
//! || THE BASICS || !//
//! \\============// !//

//* RANDOMIZE SHORTCUT USING CRYPTO
export const cryptoRando = (
  num: number | [ min:number, max:number ],
  shift?: number
) => {
  let max: number;
  let min: number;
  if(Array.isArray(num)) {
    min = num[0] && num[1] && num[0] > 0 && num[0] < num[1] ? num[0] : 0;
    max = num[0] && num[1] && num[1] > num[0] ? num[1] : 1;
  } else {
    min = 0;
    max = num && num > 0 ? num : 1;
  }
  const range = max - min + 1;
  const bytes = crypto.randomBytes(4);
  const rand = (bytes.readUInt32BE() / 0xffffffff) * range + min;
  const shiftNum  = shift ? min + shift : min;
  return Math.floor(rand) + shiftNum;
}


//* CONVERT STRING TO 8-BIT CHARACTERS
export const toBinary = (string: string) => {
  const codeUnits = Uint16Array.from(
    { length: string.length },
    (element, index) => string.charCodeAt(index)
  );
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = "";
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}


//* CONVERT STRING FROM 8-BIT CHARACTERS
export const fromBinary = (binary: string) => {
  const bytes = Uint8Array.from(
    { length: binary.length },
    (element, index) => binary.charCodeAt(index)
  );
  const charCodes = new Uint16Array(bytes.buffer);
  let result = "";
  charCodes.forEach((char) => {
    result += String.fromCharCode(char);
  });
  return result;
}


//! //==============\\ !//
//! || THE HASHINGS || !//
//! \\==============// !//


//* SIMPLE ENCRYPT/DECRYPT FUNCTION
//? Uses 'crypto' package to encrypt/decrypt data strings
export const simpleCrypto = (data: string | {hash: string, iv: string | Buffer}, key?: string | Buffer) => {
  const isString = typeof data === 'string';
  const dataIv = !isString && data?.iv && !Buffer.isBuffer(data?.iv)
      ? Buffer.from(data?.iv, 'hex')
    : !isString && data?.iv && !Buffer.isBuffer(data?.iv)
      ? data?.iv
      : null;
  let cryptiIv = dataIv !== null ? dataIv : crypto.randomBytes(16);
  key = process.env.CRYPTO_SECRET_KEY ? Buffer.from(process.env.CRYPTO_SECRET_KEY) :
  !Buffer.isBuffer(key) && key ? Buffer.from(key) : key;

  let cipher = isString && key ? crypto.createCipheriv('aes-256-cbc', key, cryptiIv) : null;
  let decipher = !isString && key && data.hash && data.iv ? crypto.createDecipheriv('aes-256-cbc', key, cryptiIv) : null;
  let hash = isString && cipher ? cipher.update(data, 'utf8', 'base64') : '';
    hash += isString && cipher ? cipher.final('base64') : null;
  let decrypted = !isString && data.hash && data.iv && decipher ? decipher.update(data.hash, 'base64', 'utf8') : '';
    decrypted += !isString && decipher && data.hash && data.iv ? decipher.final('utf8') : null;

  return {
    encrypt: isString ? { iv: cryptiIv.toString('hex'), hash } : null,
    decrypt: decrypted ? decrypted : null
  };
}

//* BASE 64 ENCRYPTION (NOT SECURE)
//? Converts input into only 8-bit characters and encodes
//? string and decodes from 8-bit string to ASCII
export const baseEncrypt = (str: string) => {
  if(windowExists()) {
    const encrypt = () => {
      try {
        return window.btoa(toBinary(str))
      } catch(e) {
        return undefined
      }
    }
    const decrypt = () => {
      try {
        return fromBinary(window.atob(str))
      } catch(e) {
        return undefined;
      }
    }
    return {
      encrypt: encrypt(),
      decrypt: decrypt(),
    }
  }
}


//* THE "MODULO CYPHER"
//? Simple substitution cypher with key
export const moduloCypher = (text: string, key: string) => {
  key = key ? key : process.env.CRYPTO_SECRET_KEY ? process.env.CRYPTO_SECRET_KEY : "tk2W8JG1rt5k1cs2Dc69ymiDUoIQs0La";
  const encryptText = (): string => {
    let encStr = "";
    for (let i = 0, j = 0; i < text.length; i++, j++) {
      if (j >= key.length) {
        j = 0;
      }
      encStr += String.fromCharCode(
        (text.charCodeAt(i) + key.charCodeAt(j)) % 256
      );
    }
    return encStr;
  }
  const decryptText = () => {
    let decStr = "";
    for (let i = 0, j = 0; i < text.length; i++, j++) {
      if (j >= key.length) {
        j = 0;
      }
  
      decStr += String.fromCharCode(
        (text.charCodeAt(i) + 256 - key.charCodeAt(j)) % 256
      );
    }
    return decStr;
  }

  return {
    encrypt: baseEncrypt(encryptText())?.encrypt,
    decrypt: baseEncrypt(decryptText())?.decrypt
  };
}


//* RETURN A SHORTENED NUMERIC HASH
export const shortenHash = (string: string) => {
  for (var h = 0, i = 0; i < string.length; h &= h) // 'h &= h' makes the number reset to 0 if exceeds 'max safe integer'
    h = 31 * h + string.charCodeAt(i++);            // (Number.MAX_SAFE_INTEGER or +/-9007199254740992)
  return h;
}


//* SIMPLE HASH
//? Generates hash between 6-12 characters
export const simpleHash = (string: string, length?: number, lowercase?: boolean) => {
  const lc = lowercase === true ? true : false;
  let hash = 0;
  const outputLength = length && length >= 6 && length <= 12
      ? length
    : length && length > 12
      ? 12
    : length && length < 6
      ? 6
      : 6

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
      // '<<' is "left shift operator", used to shift the bits of the hash variable to the left by 5 places
      // Multiplies 'hash' value by 32
    hash &= hash; // Convert to 32bit integer
  }

  let output = new Uint32Array([hash])[0].toString(36);

  while (output.length < outputLength) {
    const randomNum = Math.floor(Math.random()*10).toString();
    output += randomNum;
  }
  output = lc ? output : output.toUpperCase();
  return length === undefined && lowercase === undefined ? output: shuffleStr(output);
};

//* GENERATE CRYPTOGRAPHIC RANDOM NUMBER VALUES IN AN ARRAY
export const cryptoNumberArray = (length: number, maxNum: number) => {
  const randomNum = cryptoRando(maxNum) + 1
  if (length < 1) {
    return [];
  }
  return Array.from({length: length}, () => randomNum);
}

//* GENERATE UUID W/ SET CHARACTER LENGTH
export const generateUID = (length?: number, uppercase?: boolean) => {
  let arr: string[] = [];
  length = length && length > 0 ? length : 6;
  const loop = length < 6 ? 1 : Math.ceil(length / 6);
  for(let i=0; i < loop; i++) {
    let firstHalf = ((Math.random() * 46656) | 0).toString();
    let secondHalf = ((Math.random() * 46656) | 0).toString();
    firstHalf = ("000" + parseInt(firstHalf, 10).toString(36)).slice(-3);
    secondHalf = ("000" + parseInt(secondHalf, 10).toString(36)).slice(-3);
    arr.push(firstHalf + secondHalf);
  }
  const output = arr.join('').slice(0, length);
  return uppercase ? output.toUpperCase() : output;
}

//* RANDOM 14 CHARACTER STRING
export const randomString = (length?: number, uppercase?: boolean)  => {
  let arr: string[] = [];
  length = length && length > 0 ? length : 14;
  const loop = length < 6 ? 1 : Math.ceil(length / 6);
  for(let i=0; i < loop; i++) {
    // Output a random 14 character string with uppercase/lowercase letters and numbers 
    arr.push(Math.floor((Math.random()*Math.pow(10,16))).toString(16))
  }
  const output = arr.join('').slice(0, length);
  return uppercase ? output.toUpperCase() : output;
}


//* ROT13 CYPHER (AKA "CAESAR CYPHER") - Same to encode and decode
export const rot13 = (str: string) => str.split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13)))
    .join('');