import React from "react";
import {IoIosAddCircle} from "react-icons/io";

const DynamicFieldArray = ({label, onAdd, className, children}) => {
	return (
		<div className={className}>
			<div className="flex items-center text-sm font-semibold justify-between pb-2 gap-5">
				<label>{label}</label>
				<button
					className="text-primary inline-block"
					type="button"
					onClick={onAdd}
				>
					<IoIosAddCircle size={20} />
				</button>
			</div>
			<div className="space-y-2">{children}</div>
		</div>
	);
};

export default DynamicFieldArray;
