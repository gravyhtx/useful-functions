import slugify from 'sluga';
import { getYears } from './siteFunctions';
import { hexIsValid, hslIsValid, isValidRgbArray, isValidRgbObject, rgbIsValid } from '../lib/colorize/colorValidation';
import useSWR from 'swr';
import axios from 'axios';

//* CHECK IF WINDOW EXISTS (!undefined)
export const windowExists = (elseDoThis) => {
  //? If undefined perform an action...
  if(typeof window === 'undefined' && elseDoThis) {
    elseDoThis();
  }
  //? Then return a boolean response...
  if(typeof window !== 'undefined') {
    return true;
  }
  return false;
}

//* CHECK ELEMENT TYPES
// Uses various methods to check if the given 'element' matches a 'type' (string)
export const checkTypeof = (variable, type) => {
  //? Set Output
  let output;

  //? Convert type to lowercase
  type = type ? type.toLowerCase().trim() : undefined;

  //? Perform checks...
  output =
    //? MULTIPLE ARRAYS
    type && (type === "arrays" || type === "arrayofarrays" || type === "array_of_arrays" || type === "multiarray"
    || type === "multi_array" || type === "multiple_arrays" || type === "multiplearrays")
    && Array.isArray(variable) && variable.length && variable[0]?.length

      ? output = {is: true, type: "arrays"}

    //? MULTIPLE ARRAYS
    : type && type === "object" && Array.isArray(variable) && variable.length && variable[0]?.length

      ? output = {is: true, type: "arrays"}

    //? ARRAY = TRUE
    : type && type === "array" && Array.isArray(variable)

      ? output = {is: true, type: "array"}

    //? ARRAY = FALSE (OBJECT)
    : type && type === "object" && Array.isArray(variable)

      ? output = {is: false, type: "array"}

    //? FUNCTION = TRUE
    : type && type === "function" && isFunction(variable)

      ? output = {is: true, type: "function"}

    //? REGEX = TRUE
    : (type && type === "regex" && variable instanceof RegExp)

      ? output = {is: true, type: "regex"}

    //? NUMBER = TRUE
    : type && type === 'number' && typeof variable === 'number' && !Number.isNaN(variable)

      ? output = {is: true, type: "number"}

    //? STRING = TRUE
    : type && type === 'string' && typeof variable === 'string'

      ? output = {is: true, type: 'string'}

    //? NUMBER STRING = TRUE
    : type && type === 'numberstring' && typeof variable === 'string'
      && typeof Number(variable) === 'number' && !Number.isNaN(Number(variable))

      ? output = {is: true, type: 'numberstring'}

    //? DATE = TRUE (new Date)
    : type && Object.prototype.toString.call(variable) === '[object Date]'

      ? output = {is: true, type: 'date'}

    //? NODE = TRUE
    : type && type === "node" && typeof variable === "object" && typeof variable.nodeType === "number"
      && typeof variable.nodeName==="string"

      ? output = {is: true, type: "node"}

    //? RGB = TRUE
    : type && type === "rgb" && rgbIsValid(variable)

      ? output = {is: true, type: "rgb"}

    //? RGB OBJECT = TRUE
    : type && type === "rgbobject" && isValidRgbObject(variable)

      ? output = {is: true, type: "rgbobject"}
      
    //? RGB ARRAY = TRUE
    : type && type === "rgbarray" && isValidRgbArray(variable)

    ? output = {is: true, type: "rgbarray"}

    //? HEX = TRUE
    : type && type === "hex" && hexIsValid(variable)

      ? output = {is: true, type: "hex"}

    //? HSL = TRUE
    : type && type === "hsl" && hslIsValid(variable)

      ? output = {is: true, type: "hsl"}

    //? JSON = TRUE
    : type && type === "json string" && isJsonString(variable)

    ? output = {is: true, type: "json string"}

    //? JSON = FALSE
    : type && type === "object" && isJsonString(variable)

    ? output = {is: true, type: "json"}
    
    //? NULL = TRUE
    : type && type === "null" && variable === null

      ? output = {is: true, type: "null"}
    
    //? NULL = FALSE (OBJECT)
    : type && type === 'object' && variable === null

      ? output = {is: false, type: 'null'}

    //? UNDEFINED = TRUE
    : type && type === "undefined" && variable === undefined

      ? output = {is: false, type: "undefined"}

    //? ELEMENT = TRUE
    : type && type === "element" && (React.isValidElement(variable) ||
      (typeof variable !== "object" && variable !== null
      && variable.nodeType === 1 && typeof variable.nodeName==="string"))

      ? output = {is: true, type: "element"}

    //? IMAGE = TRUE
    : type && type === 'image' && typeof variable === 'object' && "type" in variable && variable.type === 'img'

      ? output = {is: true, type: 'image'}

    //? PERCENTAGE = TRUE
    : type && type === 'percentage' && /^(\d+|(\.\d+))(\.\d+)?%$/.test(variable)

      ? output = {is: true, type: 'percentage'}

    //? REGEX = FALSE
    : (type && type !== "regex" && variable instanceof RegExp)

      ? output = {is: false, type: "regex"}
    
    //? OBJECT = TRUE
    : type && type === 'object' && typeof variable === 'object' && variable !== null && !Array.isArray(variable)

      ? output = {is: true, type: 'object'}

    //? ALL ELSE... TRUE
    : type && typeof variable === type

      ? output = {is: true, type: typeof variable}

    //? ALL ELSE... FALSE
    : type && typeof variable !== type

      ? output = {is: false, type: typeof variable}

    //? ALL ELSE... UNDEFINED
      : output = {is: undefined, type: typeof variable}

  return output;

}

//? Types:
//?   Array = "array"
//?   Undefined = "undefined"
//?   Null =	"object" (reason)
//?   Boolean = "boolean"
//?   Number = "number"
//?   BigInt = "bigint"
//?   String = "string"
//?   Symbol = "symbol"
//?   Function = "function" (implements [[Call]] in ECMA-262 terms; classes are functions as well)
//?   DOM Element = "element"
//?   DOM Node = "node"
//?   Any other object = "object"

//* CHECK VARIABLE TYPES -- SHORTCUT!!!
export const checkType = (variable, type) => {
  variable = !variable ? false : variable;
  type = !type ? false : type;
  //?  'Type' shortcuts
  if(type === 's' || type === 'str') {
    type = 'string'
  }
  if(type === 'o' || type === 'obj' || type ==='{}') {
    type = 'object'
  }
  if(type === 'a' || type === 'arr' || type === '[]') {
    type = 'array'
  }
  if(type === 'multiarr' || type === 'multiarray' || type === 'arrs' || type === '[[]]') {
    type = 'arrays'
  }
  if(type === 'f' || type === 'fun' || type === 'func') {
    type = 'function'
  }
  if(type === 'b' || type === 'bool' || type === '?') {
    type = 'boolean'
  }
  if(type === 'n' || type === 'num') {
    type = 'number'
  }
  if(type === 'ns' || type === 'numstr') {
    type = 'numberstring'
  }
  if(type === 'big') {
    type = 'bigint'
  }
  if(type === 'd') {
    type = 'date'
  }
  if(type === 'p' || type === 'percent' || type === '%') {
    type = 'percentage'
  }
  if(type === 'sym') {
    type = 'symbol'
  }
  if(type === 'u' || type === 'und' || type === 'ud') {
    type = 'undefined'
  }
  if(type === 'e' || type === 'el') {
    type = 'element'
  }
  if(type === '<>') {
    type = 'node'
  }
  if(type === 'img') {
    type = 'image'
  }

  return type !== false && variable !== false
    ? checkTypeof(variable, type).is
  : type === false && variable !== false
    ? checkTypeof(variable)
  : !type && !variable
    ? undefined
    : undefined;
}

//* CHECK IF INPUT IS VALID JSON STRING
export const isJsonString = (input) => {
  try {
      JSON.parse(input.toString());
  } catch (e) {
      return false;
  }
  return true;
}

//* CHECK IF INPUT IS A FUNCTION
export const isFunction = (input) => {
  return (typeof input === "function" || input instanceof Function)
          && typeof input.nodeType !== "number"
          && typeof input.item !== "function";
};

//* CHECK IF STRING HAS SPECIAL CHARACTERS
export const hasSpecialChars = (str) => {
  return patterns().specialChar.test(str);
}


//* CHECK SIZE FORMAT
export const sizeFormat = (input, allowNumberOutput, outputOnly, forceOutput, widthOnly) => {

  let output;

  outputOnly = outputOnly === false ? false : true;
  forceOutput = forceOutput === false ? false : true;

  allowNumberOutput = allowNumberOutput === true ? true : false;
  widthOnly = widthOnly === true ? true : false;

  const suffixes = ['px','rem','em','%','vw', 'ch'];
  const allowedHeights = ['vh', 'ex'];

  const allowedFormats = widthOnly === false ? [...suffixes, ...allowedHeights] : suffixes;
  
  if (checkType(input, 'number') && allowNumberOutput === true) {
    output = {is: true, size: input};
  }

  else if (checkType(Number(input), 'number') && allowNumberOutput === false) {
    output = {is: true, size: input+'px'}
  }

  else if (checkType(input, 'string')) {
    for(let i=0; i < allowedFormats.length; i++) {
      if(!input.endsWith(allowedFormats[i])) {
        output = {is: false, size: input};
      }
      if(checkType(Number(input.replace(allowedFormats[i], '')), 'number')) {
        output = {is: true, size: input};
      }
    }
  }

  const allElseFails = () => {
    if(checkType(input, 'string')) {
      return input.endsWith('w')
        ? 'vw'
      : input.endsWith('h')
        ? 'vh'
      : input.endsWith('p')
        ? 'px'
      : input.endsWith('r')
        ? 'rem'
      : input.endsWith('re')
        ? 'rem'
      : input.endsWith('e')
        ? 'em'
        : false
      }
      return false;
  }

  return outputOnly && output.is === true
      ? output.size
    : outputOnly && output.is === false && forceOutput === true && allElseFails !== false
      ? output.size.replace(/\D/g,'') + allElseFails
    : outputOnly && output.is === false && forceOutput === true && allElseFails === false
      ? output.size.replace(/\D/g,'') + 'px'
    : outputOnly && output.is === false
      ? false
      : output
  
}


export const checkSizeFormat = (input, allowNumberOutput) => {
  allowNumberOutput = allowNumberOutput === true ?  true : false;
  return sizeFormat(input, allowNumberOutput, false, false)
}


//* VALIDATE EMAIL ADDRESSES
//? API -- https://apilayer.com/marketplace/email_verification-api
export const validEmail = (email) => {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const successMessage = "Email is valid."

  let errors = [];

  const errorMessage = errors.length > 0 ? errors.join(' ') : "";

  if (!email.match(emailFormat)) {
    errors.push("Please enter a valid email address.")
  }

  if (!errors.length && email.match(emailFormat)) {
    return { is: true, msg: successMessage }
  } else {
    return { is: false, msg: errorMessage }
  }
}

//* VALIDATE PASSWORDS
export const validPassword = (
  password,
  reEnterPassword,
  passwordMatch,
  complexPassword,
  specialCharacters,
  min,
  max,
  consecutiveLimit,

) => {
  
  // Ensure password is a string
  password = password.toString();

  // Determine if user must re-enter passwords. Defaults to 'false'. May enter 'false'
  // in 'reEnterPassword' and/or 'passwordMatch'
  passwordMatch = passwordMatch === false || reEnterPassword === false ? false : true;
  // Determine if it must be a complex password. Defaults 'false'.
  complexPassword = complexPassword === false ? false : true;

  // MIN & MAX DO NOT WORK RIGHT NOW
  min = checkType(min, 'number') ? min : min === false ? 1 : 6;
  max = checkType(max, 'number') ? max : max === false ? 200 : 20;

  consecutiveLimit = checkType(Number(consecutiveLimit), 'number') && Number(consecutiveLimit) > 1 ?
    Number(consecutiveLimit) : 2;

  // No white space
  const pwFormatSpaces = /^\S*$/;
  // 6 to 20 characters with at least one numeric digit, one uppercase an one lowercase letter
  const pwFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
  // Special characters
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  
  let errors = [];
  let successMessage = "Password is valid!";

  // let pwStrength = useRef(0);

  if (passwordMatch === true && password.toString() !== reEnterPassword.toString()) {
    errors.push("Password fields do not match.");
  }

  if (complexPassword === false && (password.length < min || password.length > max
    || (passwordMatch && reEnterPassword.length < min)
    || (passwordMatch && reEnterPassword.length > max))) {
    errors.push(`Password must be between ${min} to ${max} characters.`);
  }
  
  if (complexPassword
    && ((pwFormat.test(password) === false || (passwordMatch && pwFormat.test(reEnterPassword) === false))
    || (password.length < min || password.length > max)
    || (passwordMatch && reEnterPassword.length < min)
    || (passwordMatch && reEnterPassword.length > max))) {
    errors.push(`Password must be between 6 to 20 characters with at least one numeric digit, one uppercase,
                 and one lowercase letter.`);
  }

  if (specialCharacters === true
    && (specialChars.test(password) === false
    || (passwordMatch && specialChars.test(reEnterPassword) === false))) {
    errors.push("Must have at least one special character.");
  }

  if (pwFormatSpaces.test(password) === false
    || (passwordMatch && pwFormatSpaces.test(reEnterPassword) === false)) {
    errors.push("Password cannot contain spaces.");
  }

  if (consecutiveChars(password, consecutiveLimit) === true
    || (passwordMatch && consecutiveChars(reEnterPassword, consecutiveLimit) === true)) {
    errors.push(`Password cannot have the same character repeated more than ${consecutiveLimit} times.`);
  }
  errors = errors ? errors.join(' ').replace(/\s+/g, ' ').trim() : '';
  
  // STRENGTH
  let strength = 0;

  // Pasword is at least minimum
  if(password.length < min && password.length > 8) {
    strength += 1;
  }
  // Pasword is more than minimum plus 4 (up to 32) and at least 12
  if(((min + (min / 2)) >= 12 && password.length >= (min / 2))
    || ((min + (min / 2)) <= 12 && password.length >= 12)
    || (password.length >= 32)) {
    strength += 1;
  }

  // Password has an uppercase and lowercase
  if(/^(?=.*[a-z])(?=.*[A-Z]).*$/.test(password)) {
    strength += 1;
  }
  // Pasword has a number
  if(/^(?=.*[0-9]).*$/.test(password)) {
    strength += 1;
  }
  // Password has a special character
  if(specialChars.test(password)) {
    strength += 1;
  }

  // Handle errors
  if (errors.length) {
    return { is: false, pw: undefined, msg: errors }
  }
  // Handle pass
  else {
    return { is: true, pw: password.toString(), msg: successMessage }
  }
}

export const passwordsMatch = (password, reEnterPassword) => {

  const errorMessage = "Password fields do not match.";
  const successMessage = "Password fields match.";

  if (password !== reEnterPassword) {
    return { is: false, pw: password.toString(), msg: errorMessage }
  } else {
    return { is: true, pw: password.toString(), msg: successMessage }
  }
}

//* CHECK FOR VAIL PHONE NUMBER
//? API -- https://apilayer.com/marketplace/number_verification-api
export const validPhoneNumber = (phoneNumber) => {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return regex.test(phoneNumber);
}


//* CHECK FOR CONSECUTIVE CHARACTERS
//?  Default max consecutive characters is 2 in a row -- 3+ will return 'true'
export const consecutiveChars = (string, checkCasing, limit) => {

  string = checkCasing === false ? string : string.toLowerCase();  
  //  If 'checkCasing' is false then repeats of the same character in
  //  different cases will be ignored. Defaults to 'true'.

  limit = checkType(Number(limit), 'number') && limit > 0 ? Number(limit) : 2;
  //   Limit must be at least 1
  const pattern = checkCasing === false ? /([a-zA-Z0-9])\1+/g : /([a-z0-9])\1+/g; 
  const matches = string.match(pattern);

  if(string && matches) {
    for(let i = 0; i < matches.length; i++) {
      let split = matches[i].split('');
      if(split.length && split.length > limit) {
        return true;
      }
    }
  }

  return false;
}

// export const makeRegex = (pattern, flags) => {
//// FLAGS
//   //  g	= Search globally
//   //  i	= Case-insensitive search
//   //  m	= Allows for ^ and $ to check for newline character matches
//   //  s	= Allows . to match newline characters.
// }

//* SEARCH AND REPLACE
export const stringReplace = (input, searchFor, replaceWith, flags, caseSensitive) => {

  input = checkType(input, 'string') || checkType(input, 'regex') ? input : false;
  searchFor = checkType(searchFor, 'string') ? searchFor : false;
    if((input || conditions) === false) { return input }
  
  replaceWith = checkType(replaceWith, 'string') ? replaceWith : '';

  caseSensitive = caseSensitive === true ? true : false;

  flags = flags === true && caseSensitive === true
      ? 'gi'
    : replaceWith === ('g' || 'i' || 'gi' || 'gm' || 's')
      ? replaceWith
      : 'g'

  const regex = new RegExp(input, searchFor)
  return input.replace(regex, flags);
}


//* ONLY ALLOW ALPHANUMERIC CHARACTERS IN A STRING
export const alphaNumOnly = (input, exceptions, alphaOnly) => {
  const conditions = alphaOnly === true ? '^a-z' : '^a-z0-9';
  const allow = checkType(exceptions, 'string') ? exceptions : '';
  const regex = new RegExp(conditions+allow, 'gi');
  return input.replaceAll(regex, '');
}


//* TURN A STRING INTO A FILENAME
export const fileName = (string, sluga) => {
  let str = '';
  sluga = sluga === true ? true : false;

  if(string !== undefined && checkType(string, 'string')) {
    str = string.replace(/\s+/g, ' ').trim().toLowerCase();
  }
  const output = str ? str.replace(/ /g, "_").replace(/[^a-z0-9_]/gmi, "-") : string;
  return sluga ? slugify(string) : output;
}


//* TURN FILENAME STRING INTO A STRING (w/ spaces instead of underscores/dashes)
export const unFileName = (string, caps) => {

  caps = caps === false ? false : caps !== true && caps !== undefined ? caps : true; 

  if(string !== undefined && checkType(string, 'string')) {
    string = string.replaceAll(/_+/g, ' ').trim().toLowerCase();
    string = string.replaceAll(/-/g, ' - ');
    return caps === 'titlecase'
        ? titleCase(string)
      : caps === true
        ? capitalizeWords(string)
        : string;
  }
  return undefined;
}


//* CHECK FOR DUPLICATES IN AN ARRAY
export const checkDuplicates = (array, showDetails) => {
  const occurences = array.filter((item, index) => arr.indexOf(item) !== index);
  const hasDupes = occurences.length > 0 ? true : false;
  return showDetails ? { hasDupes, occurences } : hasDupes;
}


//* CHECK FOR DUPLICATE OBJECT VALUES IN AN ARRAY
export const checkObjectDupes = (array, key, showDetails) => {
  let details = [];
  let occurences = false;

  array.forEach((x)=>{

    // Checking if there is any object in details
    // which contains the key value
    if(details.some((val)=>{ return val[key] == x[key] })){
      // If has occurence increase the occurrence by 1
      details.forEach((k)=>{
        if(k[key] === x[key]){
          k["occurrence"]++
        }})
        if(k.occurence > 1) {
          occurences = true;
        }
    } else{
      // If not, create a new object initialize it
      // with the present iteration key's value and 
      // set the occurrence to 1
      let a = {}
      a[key] = x[key]
      a["occurrence"] = 1
      details.push(a);
    }
  })
  return showDetails === true ? { occurences, details } : occurences;
}


//* MULTIPLE CHECKS USING THE ARRAY METHOD, 'EVERY'
//?  Simple code that checks if a target variable is equal to Multiplee Values
export const multiCheck = (valuesToCheck, targetVariable, checkToPerfrom) => {
  if(checkType(valuesToCheck,'array') && valuesToCheck.length <= 1) {
    console.warn(`Please include more than one value to check. (Value: ${valuesToCheck})`);
  }
  if(!checkType(valuesToCheck,'array') && checkType(valuesToCheck,'string')) {
    valuesToCheck = valuesToCheck.indexOf(" ") != -1
        ? valuesToCheck.split(' ')
      : valuesToCheck.indexOf(",") != -1
        ? valuesToCheck.split(',')
        : [valuesToCheck];
    console.warn(`Values should be in an array... value(s) being used: [${valuesToCheck}]`);
  }

  const isEqual = valuesToCheck.every(value => {
    return value === targetVariable
  });

  const isThreshold = valuesToCheck.every(value => {
    return checkToPerfrom === '>'
        ? value > targetVariable
      : checkToPerfrom === '>='
        ? value >= targetVariable
      : checkToPerfrom === '<'
        ? value < targetVariable
        : value <= targetVariable
  });

  const isSubset = valuesToCheck.every(value => {
    return targetVariable.includes(value)
  });

  const includes = valuesToCheck.includes(targetVariable);

  switch(checkToPerfrom) {
    case '=':
    case 'equal':
      return isEqual;
    case '<':
    case '<=':
    case '>':
    case '>=':
      return isThreshold;
    case 'subset':
      return isSubset;
    case 'includes':
      return includes;
  }
}


//* CHECK STRING FOR WORDS
export const checkForWords = (string, wordsList, booleanOutput) => {
  let isTrue = false;
  //? Use an array with a list of words to check string for instances
  const checks = wordsList ? string.match( new RegExp("\\b(" + wordsList.join('|') + ")\\b", "ig") ) : undefined;

  // Check if string is included in "Words List"
  isTrue = wordsList ? wordsList.includes(string) : false;

  return booleanOutput === true || !checks ? isTrue : checks;
}

//* It's just a bunch of useful words...
//? Well, it will be...
export const listOfWords = (type, wordCount) => {
  const list = fileName(type.toLowerCase());

  //? TITLECASE WORDS
  // Used to check for non-capitalized words in titles
  const titleCase = [  // (See 'titleCase' function in 'generator.js')
    "a", "an", "and", "at", "but", "by", "to", "for", "is", "of", "the",
  ];
  let numerals = [];
  for(let i=0; i < 30; i++) {
    const year = getYears()
    romanNumerals = [...romanNumerals, Math.floor(Math.random())]
  }
  switch(list) {
    case "numerals":
    case "romannumerals":
    case "roman_numerals":
      return romanNumerals;
    case 'title':
    case 'titlecase':
    default:
      return titleCase;
  }
}

//* REGEX PATTERNS
export const patterns = (str, pattern, method) => {

  const ptrn = ['specChar', 'numerals'];
  const mthd = ['test', 'match'];

  const specChar = /[?!@#$%^&*(),.":{}|<>`~@#$^&*()=：”“'。，、？|{}':;'%,\\.\[\]<>\/~！@#￥……&*（）&;—|{}【】‘；]/g;
  const numerals = /^(\d{4}|(?=[IVX])(X{0,3}I{0,3}|X{0,2}VI{0,3}|X{0,2}I?[VX])-[A-Z]{2})$/i;

  const match = (regex) => checkType(regex, 'regex') ? str.match(regex) : null;
  const test = (regex) => checkType(regex, 'regex') ? regex.test(str) : null;

  const checkPtrn = ptrn.includes(pattern) ? `Patterns do not include "${pattern}".` : false;
  const checkMthd = mthd.includes(method) ? `Methods do not include "${method}".` : false;

  const patternCheck = (inclPtrnBool, inclMthdBool) => {
    if(ptrn.includes(pattern) === inclPtrnBool && mthd.includes(method) === inclMthdBool && !checkType(pattern, 'regex')) {
      return true;
    }
    return false
  }

  if(str && pattern && method) {
    switch(method) {
      case 'test':
        if(pattern === 'specialChar') {
          return test(specChar);
        }
        else if(pattern === 'numerals') {
          return test(numerals);
        }
        else if (checkType(pattern, 'regex')) {
          return test(pattern)
        }
        else {
          return null;
        }
      case 'match':
        if(pattern === 'specialChar') {
          return match(specChar);
        }
        else if(pattern === 'numerals') {
          return match(numerals);
        }
        else if (checkType(pattern, 'regex')) {
          return match(pattern)
        }
        else {

          return ptrn.includes(pattern) === true && mthd.includes(method) === false && !checkType(pattern, 'regex')
              ? checkPtrn + ` Available patterns: ${ptrn.join(', ')}`
            : ptrn.includes(pattern) === false && mthd.includes(method) === true && !checkType(pattern, 'regex')
              ? checkMthd + ` Available methods: ${mthd.join(', ')}.`
            : ptrn.includes(pattern) === false && mthd.includes(method) === false && !checkType(pattern, 'regex')
              ? checkPtrn + ' ' + checkMthd
              : null;
        }
      default:
        return undefined;
    }
  }

  if(str && pattern && !method) {
    switch(pattern) {
      case 'specialChar':
        return {
          match: str.match(specChar),
          test: specChar.test(str)
        }
      case 'numerals':
        return {
          match: str.match(numerals),
          test: numerals.test(str)
        }
    }
  }

  if(str && !pattern && !method) {
    return {
      specialChar: {
        match: str.match(specChar),
        test: specChar.test(str)
      },
      numerals: {
        match: str.match(numerals),
        test: numerals.test(str)
      }
    }
  }
  return {
    specialChar: specChar,
    numerals: numerals
  }
}


//* IMPORT NEXT IMAGE OR SIZE TO CREATE PROPER WIDTH/HEIGHT OBJECTS
export const imageSizeObj = ( obj ) => {
  //? Must be a Next image object, array of sizes, number, or string
  //? Array -- [width, height] -- both must be numbers or strings
  //?                          -- if one contains 'px', both must contain 'px' (will be removed)
  //? String -- "100"/"100px"  -- must be number only or can have number + 'px' (will be be removed)

  //? Perform checks...
  let sizeObj;

  if ((!obj || obj === true)
    || (obj?.width === true && (obj?.height === true || !obj?.height))
    || (obj?.height === true && (obj?.width === true || !obj?.width))) {
    return { width: 1000, height: 1000 };
  } else if ((!obj || obj === false)
    || (obj?.width === false && (obj?.height === false || !obj?.height))
    || (obj?.height === false && (obj?.width === false || !obj?.width))) {
    return { sizes: '100vw' };
  } else if (checkType(obj?.height, 'number') && obj?.width === undefined) {
    return { width: obj?.height, height: obj?.height };
  } else if (checkType(obj?.width, 'number') && obj?.height === undefined) {
    return { width: obj?.width, height: obj?.width };
  } else if (checkType(Number(obj), 'number')) {
    return { width: Number(obj), height: Number(obj) }
  }

  if (obj && obj?.width && obj?.height) {

    return { width: obj?.height, height: obj?.width };
  
  } else if ((checkType(obj, 'number') && !checkType(obj, 'string'))
    || (checkType(obj, 'string') && !isNaN(obj))) {

    return { width: Number(obj), height: Number(obj) };
    
  }  else if (checkType(obj, 'string') && !isNaN(obj)){

    return { width: Number(obj), height: Number(obj) };
    
  } else if (!checkType(obj, 'array') && checkType(obj, 'string') && obj?.toString().includes("px",1)) {

    let size = obj?.replace('px','');
    return { width: Number(size), height: Number(size) };
    
  } else if (checkType(obj, 'string')
    && !checkType(obj, 'array') && obj?.toString().includes("px",1)) {

    return { width: Number(obj?.replace('px','')), height: Number(obj?.replace('px','')) }
    
  } else if (checkType(obj, 'array')
  && !obj[0].toString().includes("px",1) && !obj[1].toString().includes("px",1)
  && checkType(obj[0], 'number') && checkType(obj[1], 'number')) {

    return { width: Number(obj[0]), height: Number(obj[1]) }
    
  } else if (checkType(obj, 'array')
    &&  obj[0].toString().includes("px",1) && obj[1].toString().includes("px",1)) {

    return { width: Number(obj[0].replace('px','')), height: Number(obj[1].replace('px','')) }
    
  } else if (checkType(obj, 'array')
    && checkType(obj[0], 'string') && !isNaN(obj[0])
    && checkType(obj[1], 'string') && !isNaN(obj[1])) {

    return { width: Number(obj[0]), height: Number(obj[1]) }

  } else {
    
    return undefined;
    
  }
}


//* CHECK IF IMAGE EXISTS
export const imageExists = (src) => {
  const fetch = async () => axios.get(src).then(res => res.data);
  const { data, error } = useSWR(src, fetch);
  return data || !error ? true : error || !data ? false : null;
}