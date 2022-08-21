import { throttle } from "lodash";
import { getDeviceConfig } from ".";

export const includeBp = (arrayVar) => {
  var currentBp = '';

  if (currentBp === '') {
    currentBp = getDeviceConfig(window.innerWidth);
  }

  // Calculate BP
  const calcInnerWidth = throttle(function () {
    currentBp = getDeviceConfig(window.innerWidth);
  }, 200);
  window.addEventListener("resize", calcInnerWidth);

  var returnValue = false;

  if (typeof arrayVar === "object" && Array.isArray(arrayVar)) {
    arrayVar.forEach((bp) => {
      if (currentBp === bp) {
        returnValue = true;
        return;
      }
    });
  }
  return returnValue;
};