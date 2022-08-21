import {useState, useEffect} from 'react';
import throttle from 'lodash/throttle';

export const getDeviceConfig = (width) => {
  if(width < 578) {
    return 'xs';
  } else if(width >= 578 && width < 972 ) {
    return 'sm';
  } else if(width >= 972 && width < 1196) {
    return 'md';
  } else if(width >= 1196 && width < 1425) {
    return 'lg';
  } else if(width >= 1425) {
    return 'xl';
  }
};

export const getBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(() => getDeviceConfig(window.innerWidth));
  
  useEffect(() => {
    const calcInnerWidth = throttle(function() {
      setBrkPnt(getDeviceConfig(window.innerWidth))
    }, 200); 
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return brkPnt;
}
