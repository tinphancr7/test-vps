import invoiceApi from "@/apis/invoice.api";
import MyCurrencyInput from "@/components/form-data/currency-input";
import MyDateRangePicker from "@/components/form-data/my-date-range-picker";
import MySelectNoValidate from "@/components/form-data/my-select-no-validate";

import {Button, Divider, SelectItem} from "@heroui/react";
import {useEffect, useState} from "react";
import {BiFilter} from "react-icons/bi";
import {IoIosRefresh} from "react-icons/io";

interface IProps {
	topFilter: any;
	onChangeTopFilter: (key: any, value: any) => void;
	onClearTopFilter?: () => void;
	onClickTopFilter: () => void;
}
const TopFilter = ({
	topFilter,
	onChangeTopFilter,
	onClearTopFilter,
	onClickTopFilter,
}: IProps) => {
	const [providers, setProviders] = useState([]);

	useEffect(() => {
		// Fetch providers
		const fetchProvider = async () => {
			const response = await invoiceApi.callFetchProvider({
				search: "",
				page: 1,
				limit: 100,
			});

			if (response?.data?.data?.data?.length > 0) {
				setProviders(response?.data?.data?.data);
			}
		};
		fetchProvider();
	}, []);
	return (
		<>
			<div className="flex items-center w-full gap-10">
				<div className="w-1/3">
					<label htmlFor="" className="inline-block pb-1">
						Thời gian thực hiện :
					</label>
					<MyDateRangePicker
						value={topFilter?.time}
						name="time"
						onChangeSelect={onChangeTopFilter}
					/>
				</div>
				<div className="w-1/3">
					<label htmlFor="" className="inline-block pb-1">
						Nhà cung cấp :
					</label>
					<MySelectNoValidate
						value={topFilter?.provider}
						name="provider"
						onChangeSelect={onChangeTopFilter}
					>
						{providers.map((item: any) => (
							<SelectItem key={item?._id}>{item.name}</SelectItem>
						))}
					</MySelectNoValidate>
				</div>
				<div className="w-1/3">
					<div className="flex items-center  gap-5">
						<div className="flex flex-col ">
							<label htmlFor="" className="inline-block pb-1">
								Từ :
							</label>
							<MyCurrencyInput
								className="h-10"
								name="from"
								value={topFilter?.from}
								onChange={onChangeTopFilter}
							/>
						</div>
						<span className="pt-5">-</span>
						<div className="flex flex-col ">
							<label htmlFor="" className="inline-block pb-1">
								Đến :
							</label>
							<MyCurrencyInput
								className="h-10"
								name="to"
								value={topFilter?.to}
								onChange={onChangeTopFilter}
							/>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-4 mt-7 cursor-pointer">
					<Button
						startContent={<BiFilter size={20} />}
						className="bg-primary text-white"
						onClick={onClickTopFilter}
					>
						Lọc
					</Button>
					<div className="cursor-pointer" onClick={onClearTopFilter}>
						<IoIosRefresh size={20} />
					</div>
				</div>
			</div>
			<Divider className="my-4" />
		</>
	);
};

export default TopFilter;
