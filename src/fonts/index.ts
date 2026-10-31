import localFont from "next/font/local";

export const fontSerif = localFont({
  src: [
    { path: "./cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./cormorant-garamond-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = localFont({
  src: [
    { path: "./montserrat-latin-wght-normal.woff2", style: "normal" },
    { path: "./montserrat-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});
