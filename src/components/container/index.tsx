import { ChildrenProps } from "@/interfaces/children-props";

interface ContainerProp extends ChildrenProps {
	className?: string;
}

function Container({ children, className }: ContainerProp) {
	return (
		<div className={`shadow-container p-2 rounded-md ${className || ""}`}>
			{children}
		</div>
	);
}

export default Container;
