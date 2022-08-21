import { createTheme } from "@mui/material/styles";
import { defaultTheme } from "../themes";

const { breakpoints } = createTheme(defaultTheme);

// const screenSize = (bp) => {
//   if(bp === 'dt') {
//     return breakpoints.up('lg');
//   } else if(bp === 'tl') {
//     return breakpoints.between('md', 'lg');
//   } else if(bp === 'tp') {
//     return breakpoints.between('sm', 'md');
//   } else if(bp === 'mo') {
//     return breakpoints.between('xs', 'sm');
//   } else {
//     return breakpoints.up('lg');
//   }
// }

// export { screenSize, breakpoints };
export { breakpoints };