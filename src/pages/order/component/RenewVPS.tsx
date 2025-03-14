import { Button } from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/stores";
import { actionOrder } from "@/stores/slices/order.slice";
import showToast from "@/utils/toast";
import { useMemo, useState } from "react";

function RenewVPS({ type, itemOrder }: { type: string; itemOrder: any }) {
	const dispatch = useAppDispatch();
	const [flag, setFlag] = useState(false);
	const { isLoadingActionOrder } = useAppSelector((state) => state.order);
	const strType = useMemo(() => {
		if (type === "renew_vps") {
			return "Gia hạn";
		}
		return "Mua mới";
	}, [type]);

	const onActionOrder = async () => {
		const result = await dispatch(
			actionOrder({ orderId: itemOrder.orderId, type: type })
		).unwrap();
		if (!result?.status) {
			switch (result?.message) {
				case "account_not_enogh_money": {
					showToast("Tài khoản không đủ tiền để thanh toán", "error");
					break;
				}
				default: {
					if (type === "buy_vps") {
						showToast("Mua mới không thành công", "error");
						break;
					}
					showToast("Dịch vụ gia hạn không thành công", "error");
					break;
				}
			}
			return;
		}
		setFlag(true);
	};

	if (itemOrder?.isAction || flag) {
		return <></>;
	}
	return (
		<>
			<Button
				isLoading={isLoadingActionOrder}
				onPress={onActionOrder}
				className="bg-primary text-white"
			>
				{strType}
			</Button>
		</>
	);
}

export default RenewVPS;
