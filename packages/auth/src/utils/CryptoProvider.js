import CryptoJS from 'crypto-js';

const initVectorHsm = '0000000000000000';

const rightPadding = (rawString, paddingCharacter, maxLength) => {
  const tmpString =
    rawString + paddingCharacter.repeat(maxLength - rawString.length);
  return tmpString;
};

const pinBlockFormation = rawString => {
  const hexConvertedString = encodeHexa(rawString);
  return rightPadding(hexConvertedString, 'F', 32);
};

const cardPinBlockFormation = rawString => {
  const hexConvertedString = encodeHexa(rawString);
  return rightPadding(hexConvertedString, 'F', 16);
};

let encodeHexa = rawString => {
  let hex;
  let i;
  let result = '';

  for (i = 0; i < rawString.length; i += 1) {
    hex = rawString.charCodeAt(i).toString(16);
    result += hex;
  }
  /* AD team was unsure if there is a need for us to uppercase the resulting converted HEX,
      but given the locic of encryption, I believe we need to ensure strict case sensitivity
    */
  return result.toUpperCase();
};

export const decryptHsm = (masterKey, encrypted) => {
  const firstTwoBytes = masterKey.substring(0, 16);
  const masterKeyPadded = masterKey.concat(firstTwoBytes);

  const dataHex = CryptoJS.enc.Hex.parse(encrypted);
  const keyHex = CryptoJS.enc.Hex.parse(masterKeyPadded);
  const decryptedData = CryptoJS.TripleDES.decrypt(
    { ciphertext: dataHex },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    }
  );
  return decryptedData.toString().toUpperCase();
};

export const encryptDataHsm = (masterKey, data) => {
  const firstTwoBytes = masterKey.toString().substring(0, 16);
  const masterKeyPadded = masterKey.concat(firstTwoBytes);

  const dataHex = CryptoJS.enc.Hex.parse(data);
  const keyHex = CryptoJS.enc.Hex.parse(masterKeyPadded);
  const ivHex = CryptoJS.enc.Hex.parse(initVectorHsm);
  const encryptedData = CryptoJS.TripleDES.encrypt(dataHex, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding
  });
  return encryptedData.ciphertext.toString().toUpperCase();
};

export const encryptHsmCardPin = (masterKey, data) => {
  let encryptedValue = '';
  try {
    const firstTwoBytes = masterKey.toString().substring(0, 16);
    const masterKeyPadded = masterKey.concat(firstTwoBytes);
    const keyHex = CryptoJS.enc.Hex.parse(masterKeyPadded);
    const dataHex = CryptoJS.enc.Hex.parse(data.toUpperCase());
    const encryptedData = CryptoJS.TripleDES.encrypt(dataHex, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding
    });
    encryptedValue = encryptedData.ciphertext.toString().toUpperCase();
  } catch (err) {
    console.log(err);
  }
  return encryptedValue;
};

export const constructPWPadding = (pwd, coexistance) => {
  let passwordOne;
  let passwordTwo;
  const passwordArray = [];

  const pwdLength = pwd.length;
  // [Updated 25-Jun]
  if (pwdLength > 12) {
    // split into two. if 13 characters, first half = 7, second half = 6
    const firstHalfLength = Math.round(pwdLength / 2);
    passwordOne = pwd.substr(0, firstHalfLength); // extract up to length = firstHalfLength
    passwordTwo = pwd.substr(firstHalfLength); // extract from index firstHalfLength

    // Scenario below likely not possible anymore?
    if (passwordTwo.length < 6) {
      const paddingCharacter = coexistance ? '$' : 'F';
      passwordTwo = rightPadding(passwordTwo, paddingCharacter, 6);
    }
    passwordTwo = pinBlockFormation(passwordTwo);
  } else {
    passwordOne = pwd;
  }

  passwordOne = pinBlockFormation(passwordOne);
  passwordArray.push(passwordOne);
  if (passwordTwo) passwordArray.push(passwordTwo);

  return passwordArray;
};

export const constructPINPadding = pwd => {
  const passwordArray = [];
  const passwordOne = cardPinBlockFormation(pwd);
  passwordArray.push(passwordOne);

  return passwordArray;
};

// Card Pin Encryption starts
const PIN_MAXLENGTH = 16;
const ZERO_PREFIX = '0';

/** formats card pin
    ie: cardNo: 321456 formats to 06321456FFFFFFFF
    where 1st char is '0', 2nd char is the length of PIN
    followed by the inputted card pin and right padded by 'F' * */
export const formattedCardPinUsingFormat0 = (
  cardPinLength,
  cardPinInput,
  paddingChar
) => {
  const value =
    ZERO_PREFIX +
    cardPinLength +
    cardPinInput +
    paddingChar.repeat(PIN_MAXLENGTH - cardPinLength - 2);
  return value;
};

/** formats card number
     ie: cardNo: 1122 3344 5566 7788 = 0000233445566778
     where 1st 4 characters is '0'
     followed by the 12-digits inputted card number  excluding the last digit * */
export const formattedCardNoUsingFormat0 = cardNoInput => {
  const cardNoWithoutLastDigit = cardNoInput.slice(0, -1);
  const value = `0000${cardNoWithoutLastDigit.slice(-12)}`;
  return value;
};

/** pin block formation using ISO format 0
     formatted pin using ISO format 0 XOR formatted card no using ISO format 0 * */
export const pinBlockFormationUsingISOFormat0 = (param1, param2) => {
  const xorString = xorStrings(param1, param2);
  return xorString;
};

export const retrieveCardZpkKey = cardZpk => {
  let cardZpkKey;
  const storedKey = cardZpk;
  const zpkComponents = storedKey.split('|');
  if (zpkComponents.length === 2) {
    cardZpkKey = xorStrings(zpkComponents[0], zpkComponents[1]);
  }
  return cardZpkKey;
};

const xorStrings = (param1, param2) => {
  const xorArray = [];
  let xorString = '';
  try {
    if (param1 && param1 !== '' && param2 !== '') {
      if (param1.length > param2.length) {
        const buffer = param1.length - param2.length;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < param1.length; i++) {
          if (i < buffer) {
            xorArray.push(param1[i]);
          } else {
            const hexVal =
              // eslint-disable-next-line no-bitwise
              parseInt(param1[i], 16) ^ parseInt(param2[i - buffer], 16);
            xorArray.push(hexVal.toString(16));
          }
        }
      } else {
        const buffer = param2.length - param1.length;
        // eslint-disable-next-line no-plusplus
        for (let j = 0; j < param2.length; j++) {
          if (j < buffer) {
            xorArray.push(param2[j]);
          } else {
            const hexVal =
              // eslint-disable-next-line no-bitwise
              parseInt(param2[j], 16) ^ parseInt(param1[j - buffer], 16);
            xorArray.push(hexVal.toString(16));
          }
        }
      }
      // eslint-disable-next-line no-plusplus
      for (let k = 0; k < xorArray.length; k++) {
        xorString += xorArray[k];
      }
    }
  } catch (err) {
    console.log(err);
  }
  return xorString;
};
// Card Pin Encryption Ends
