import CryptoJS from 'crypto-js';
// universal module
export const loadState = () => {
  try {
    const jsonStr = sessionStorage.getItem('state');
    if (jsonStr === null) {
      return undefined;
    }
    return JSON.parse(jsonStr);
  } catch (e) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const json = JSON.stringify(state);
    sessionStorage.setItem('state', json);
  } catch (e) {}
};

/**
 * @summary fetch and return decrpted data from local storage.
 * @param {*} strName key to be fetched from localstorage and decrypted.
 */
export const retrieveData = (strName, useSession = false) => {
  try {
    const storage = useSession ? localStorage : sessionStorage;
    
    if (typeof storage !== 'undefined' && storage.getItem('cookie')) {
      const strCookieJson = storage.getItem('cookie');
      
      if (strCookieJson && strCookieJson !== '') {
        const CookieJson = JSON.parse(strCookieJson);
        if (CookieJson && CookieJson[strName]) {
          return CookieJson[strName];
        }
      }
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

/**
 * @summary This function is used to encrypt and add Data to localstorage
 * @param {*} strName keyname to be saved
 * @param {*} objPayload the actual data to be cached
 */
export const persistData = (strName, objPayload, useSession = true) => {
  const storage = useSession ? sessionStorage : localStorage;
  if (typeof storage !== 'undefined') {
    const strCookieJson = storage.getItem('cookie');
    if (strCookieJson) {
      const CookieJson = JSON.parse(strCookieJson);
      CookieJson[strName] = objPayload;
    } else {
      const CookieJson = {};
      CookieJson[strName] = objPayload;
    }
  }
};

/**
 * @summary This function is used to encrypt and add Data to localstorage
 * @param {*} strName keyname to be saved
 * @param {*} objPayload the actual data to be cached
 */
export const removeData = (strName, useSession = true) => {
  const storage = useSession ? sessionStorage : localStorage;
  if (typeof storage !== 'undefined') {
    const strCookieJson = storage.getItem('cookie');
    if (strCookieJson) {
      const CookieJson = JSON.parse(strCookieJson);
      delete CookieJson[strName];
      storage.setItem(
        'cookie',
        JSON.stringify(CookieJson)
      );
    }
  }
};

export const clearCookie = (useSession = true) => {
  const storage = useSession ? sessionStorage : localStorage;
  if (typeof storage !== 'undefined') {
    storage.clear();
  }
};
