import {useAppDispatch, useAppSelector} from "@/stores";
import {setInstanceChargeType} from "@/stores/slices/alibaba-ecs.slice";
import {Button, Tooltip} from "@heroui/react";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {BILL_METHODS} from "./constants";

function BillMethodSelect() {
	const dispatch = useAppDispatch();
	const {instanceChargeType} = useAppSelector((state) => state.alibabaEcs);

	const billClassNames = (value: string) => {
		const items: string[] = [
			"bg-transparent cursor-pointer text-base tracking-wide min-w-[150px] p-2 border rounded-sm",
		];
		const activeInstanceChargeType =
			instanceChargeType === value
				? "border-primary font-medium"
				: "border-gray-300/80 font-normal";

		items.push(activeInstanceChargeType);

		const findOne = BILL_METHODS.find((bill) => bill?.value === value);
		const disableBillMethods = findOne?.isDisabled
			? "opacity-60"
			: "opacity-100";

		items.push(disableBillMethods);

		return items.join(" ");
	};

	const handleChangeInstanceChargeType = (value: string) => {
		const findOne = BILL_METHODS.find((bill) => bill?.value === value);

		if (!findOne?.isDisabled) {
			dispatch(setInstanceChargeType(value));
		}
	};

	const renderTooltip = (
		<div className="flex flex-col gap-2">
			<div>
				<h3 className="text-base tracking-wide font-medium min-w-[150px]">
					Subscription
				</h3>

				<div className="ml-5 list-disc list-inside flex flex-col gap-1 mt-1">
					<li>
						Phương thức thanh toán cho phép bạn trả trước để mua và gia hạn phiên bản ECS trong nhiều tháng hoặc nhiều năm.
					</li>
					<li>
						Để lưu trữ một trang web trên phiên bản ECS được triển khai ở Trung Quốc đại lục, bạn phải có hồ sơ ICP.
					</li>
					<li>
						Nếu phiên bản ECS của bạn được liên kết với phiên bản SLB, bạn chỉ cần mua một lượng băng thông nhỏ cho phiên bản ECS để kết nối và quản lý từ xa.
					</li>
				</div>
			</div>

			<div>
				<h3 className="text-base tracking-wide font-medium min-w-[150px]">
					Pay-as-you-go
				</h3>

				<div className="ml-5 list-disc list-inside flex flex-col gap-1 mt-1">
					<li>
						Phương thức thanh toán cho phép bạn sử dụng tài nguyên và thanh toán cho chúng sau đó. Bạn bị tính phí cho các tài nguyên trả theo mức sử dụng hàng giờ sau khi chúng được tạo. đối với phiên bản ECS để kết nối và quản lý từ xa.
					</li>
					<li>Không thể lấy hồ sơ ICP cho các trường hợp trả tiền theo nhu cầu.</li>
				</div>
			</div>
		</div>
	);

	return (
		<div className="grid grid-cols-7 gap-2">
			<div className="flex items-center gap-1">
				<h3 className="text-base tracking-wide font-medium">
					Phương thức thanh toán
				</h3>

				<Tooltip
					radius="sm"
					content={renderTooltip}
					classNames={{
						content: "max-w-80 overflow-auto scroll-main p-2",
					}}
				>
					<span className="text-gray-500">
						<RxQuestionMarkCircled />
					</span>
				</Tooltip>
			</div>

			<div className="col-span-6 grid grid-cols-4 gap-2">
				{BILL_METHODS?.map((bill) => (
					<Button
						key={bill?.value}
						className={billClassNames(bill?.value)}
						onPress={() => handleChangeInstanceChargeType(bill?.value)}
					>
						{bill?.label}
					</Button>
				))}
			</div>
		</div>
	);
}

export default BillMethodSelect;
