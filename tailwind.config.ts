/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/*.{js,jsx,ts,tsx}",
    "./app/**/**/**/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./pages/**/**/*.{js,jsx,ts,tsx}",
    "./pages/**/**/**/*.{js,jsx,ts,tsx}",
    "./pages/**/**/**/**/*.{js,jsx,ts,tsx}",
    "./pages/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      mms: { min: "1430px" },
      mst: { max: "1230px" },
      mmst: { max: "1230px" },
      sst: { max: "780px" },
      srt: { min: "780px" },
      st: { max: "750px" },
      mmdd: { max: "630px" },
      mmd: { max: "640px" },
      md: { max: "427px" },
      "2usm": { max: "505px" },
      "2sm": { max: "975px" },
      usm: { max: "940px" },

      // homepage780
      mmsm: { max: "1030px" },
      mmsst: { max: "830px" },
    },
    extend: {
      backgroundImage: {
        heroimg: "url('../public/images/heroimg.svg')",
      },
    },
  },
  plugins: [],
};

// #ff5555