import {AppDispatch} from "@/stores";
import {setInstance} from "@/stores/slices/vps-scaleway-slice";
import {useDispatch, useSelector} from "react-redux";

const ZoneItem = ({item}: any) => {
	const {instance} = useSelector((state: any) => state?.scaleway);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div
			className={`flex items-center border bg-white ${
				instance?.zone?.value === item?.value
					? "border-primary"
					: "border-gray-600"
			} cursor-pointer gap-4 rounded-lg bg-transparent p-4`}
			onClick={() => {
				dispatch(setInstance({zone: item}));
			}}
		>
			<img src={`${item.url}`} className="h-[24px] w-[24px]" alt="" />
			<p
				className={`flex-1 text-[16px] uppercase ${
					instance?.zone?.value === item?.value
						? "font-semibold text-primary"
						: ""
				}`}
			>
				{item.label}
			</p>
			{item.subicon}
		</div>
	);
};

export default ZoneItem;
