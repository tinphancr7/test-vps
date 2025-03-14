import {Button, Select} from "@heroui/react";

import {IoIosClose} from "react-icons/io";
interface IProps {
	value: string;
	children: any;
	name: string;
	onChangeSelect: (name: string, value: string) => void;
}
const MySelectNoValidate = ({
	value,
	children,
	name,
	onChangeSelect,
}: IProps) => {
	return (
		<Select
			label=""
			variant={"bordered"}
			placeholder="--- Chọn ---"
			labelPlacement="outside"
			disableSelectorIconRotation
			selectedKeys={[value]}
			onChange={(e) => onChangeSelect(name, e.target.value)}
			classNames={{
				trigger: "border p-2 rounded-lg",
			}}
			startContent={
				value && (
					<Button
						className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
						variant="solid"
						color="danger"
						onPress={() => onChangeSelect(name, "")}
					>
						<IoIosClose className="text-xl min-w-max" />
					</Button>
				)
			}
		>
			{children}
		</Select>
	);
};

export default MySelectNoValidate;
