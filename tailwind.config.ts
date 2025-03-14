import {heroui} from "@heroui/react";
import type {Config} from "tailwindcss";

const config: Config = {
	variants: {
		textColor: ["group-hover", "hover"],
	},
	darkMode: "class", // or 'media' if you prefer to use the user's system preference
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		fontSize: {
			sm: "12px",
			base: "14px",
			lg: "16px",
			xl: "1rem",
			"2xl": "1.563rem",
			"3xl": "1.953rem",
			"4xl": "2.441rem",
			"5xl": "3.052rem",
		},
		fontFamily: {
			poppins: ["Poppins", "sans-serif"],
		},
		extend: {
			colors: {
				"up-cloud-primary": "#FF9900",
				light: "#FFFFFF",
				dark: "#000000",
				primary: "#FF9900",
				primaryDf: "#006fee",
				success: "#17C964",
			},
			backgroundColor: {
				primary: "#FF9900",
				primaryDf: "#006fee",
				success: "#17C964",
			},
			boxShadow: {
				navbar: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
				container:
					"rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
				rightPartOperation: "0 -15px 35px 0 #0000000d",
				billingQuantity: "rgba(0, 0, 0, 0.05) 0px -15px 35px 0px",
			},
			height: {
				page: "calc(100dvh - 66px)",
			},
			width: {
				"1/7": "calc(100% / 7)",
				sidebar: "calc(((2 / 12) * 100%) - 8px)",
			},
			minWidth: {
				"1/7": "calc(100% / 7)",
			},
			maxHeight: {
				page: "calc(100dvh - 66px)",
			},
		},
	},
	plugins: [heroui()],
};
export default config;
