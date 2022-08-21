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
        const CookieJson = JSON.parse(
          CryptoJS.AES.decrypt(
            strCookieJson,
            'sd445bdjfdf9sdfds#hddd'
          ).toString(CryptoJS.enc.Utf8)
        );
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
      const CookieJson = JSON.parse(
        CryptoJS.AES.decrypt(strCookieJson, 'sd445bdjfdf9sdfds#hddd').toString(
          CryptoJS.enc.Utf8
        )
      );
      CookieJson[strName] = objPayload;
      storage.setItem(
        'cookie',
        CryptoJS.AES.encrypt(
          JSON.stringify(CookieJson),
          'sd445bdjfdf9sdfds#hddd'
        )
      );
    } else {
      const CookieJson = {};
      CookieJson[strName] = objPayload;
      storage.setItem(
        'cookie',
        CryptoJS.AES.encrypt(
          JSON.stringify(CookieJson),
          'sd445bdjfdf9sdfds#hddd'
        )
      );
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
      const CookieJson = JSON.parse(
        CryptoJS.AES.decrypt(strCookieJson, 'sd445bdjfdf9sdfds#hddd').toString(
          CryptoJS.enc.Utf8
        )
      );
      delete CookieJson[strName];
      storage.setItem(
        'cookie',
        CryptoJS.AES.encrypt(
          JSON.stringify(CookieJson),
          'sd445bdjfdf9sdfds#hddd'
        )
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
