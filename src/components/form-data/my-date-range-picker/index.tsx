import {Button, DateRangePicker} from "@heroui/react";

import {IoIosClose} from "react-icons/io";
interface IProps {
	value: any;
	name: string;
	onChangeSelect: (name: any, value: any) => void;
}
const MyDateRangePicker = ({value, name, onChangeSelect}: IProps) => {
	return (
		<DateRangePicker
			calendarProps={{
				className: "!w-full !max-w-full",
				content: "!w-full !max-w-full",
			}}
			id="nextui-date-range-picker"
			radius="sm"
			variant={"bordered"}
			classNames={{
				inputWrapper: "border p-2 rounded-lg",
			}}
			startContent={
				value && (
					<Button
						className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
						variant="solid"
						color="danger"
						onPress={() => onChangeSelect("time", null)}
					>
						<IoIosClose className="text-xl min-w-max" />
					</Button>
				)
			}
			value={value}
			onChange={(value) => onChangeSelect(name, value)}
		/>
	);
};

export default MyDateRangePicker;
