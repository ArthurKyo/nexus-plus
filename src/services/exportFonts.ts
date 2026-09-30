import montserrat from "@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?inline";
import fira400 from "@fontsource/fira-sans/files/fira-sans-latin-400-normal.woff2?inline";
import fira500 from "@fontsource/fira-sans/files/fira-sans-latin-500-normal.woff2?inline";
import fira600 from "@fontsource/fira-sans/files/fira-sans-latin-600-normal.woff2?inline";
import fira700 from "@fontsource/fira-sans/files/fira-sans-latin-700-normal.woff2?inline";
// Lazy-loaded only for HTML export; embedded assets keep the file self-contained.
export const exportFontCss =
  `@font-face{font-family:"Montserrat Variable";font-style:normal;font-weight:100 900;font-display:swap;src:url("${montserrat}") format("woff2");}` +
  [
    [400, fira400],
    [500, fira500],
    [600, fira600],
    [700, fira700],
  ]
    .map(
      ([weight, url]) =>
        `@font-face{font-family:"Fira Sans";font-style:normal;font-weight:${weight};font-display:swap;src:url("${url}") format("woff2");}`,
    )
    .join("");
