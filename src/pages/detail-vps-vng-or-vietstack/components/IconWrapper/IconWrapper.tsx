import React from "react";
import {twMerge} from "tailwind-merge";
const IconWrapper = ({children, bgColor, textColor, className = ""}: any) => (
	<div
		className={twMerge(
			`w-10 h-10 cursor-pointer rounded-lg ${bgColor} flex items-center justify-center`,
			className
		)}
	>
		{React.cloneElement(children, {className: textColor})}
	</div>
);
export default IconWrapper;
