import CurrencyInput from "react-currency-input-field";
import {twMerge} from "tailwind-merge";

interface IProps {
	className?: string;
	prefix?: string;
	name?: string;
	defaultValue?: string;
	value?: string;
	onChange?: (key: any, value: any) => void;
}

const MyCurrencyInput = ({
	className = "",
	prefix = "$",
	name = "",
	defaultValue = "",
	value = "",
	onChange = () => {},
}: IProps) => {
	return (
		<CurrencyInput
			className={twMerge("border border-gray-300 rounded-lg p-2", className)}
			id="input-example"
			name={name}
			// suffix={suffix}
			allowDecimals={true}
			// intlConfig={{locale: "vi-VN", currency: "VND"}}
			intlConfig={{locale: "en-US", currency: "USD"}}
			prefix={prefix}
			placeholder="Nhập dữ liệu"
			defaultValue={defaultValue}
			value={value}
			decimalsLimit={2}
			decimalSeparator="."
			groupSeparator=","
			onValueChange={(value, name) => {
				onChange(name, value || "");
			}}
		/>
	);
};

export default MyCurrencyInput;
