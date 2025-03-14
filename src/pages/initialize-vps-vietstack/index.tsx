import Container from "@/components/container";
import paths from "@/routes/paths";
import { formatPrice } from "@/utils/format-price";
import { Button, Chip, Select, Selection, SelectItem } from "@heroui/react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { VPS_CONFIG, VPS_CONFIG_STEPS } from "@/constants/vps-configs";
import { CYCLE_TIME, cycleTime } from "@/constants/cycle-time";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetProductById } from "@/stores/async-thunks/prod-vietstack-thunk";
import { parseDesVpsVng } from "@/utils/parse-desc-vps-vng";
import { TbBrandCloudflare } from "react-icons/tb";
import { GrLocation } from "react-icons/gr";
import { RiRamLine } from "react-icons/ri";
import { LuCpu } from "react-icons/lu";
import { RiSignalWifi3Line } from "react-icons/ri";
import { RiRadarLine } from "react-icons/ri";
import { GrStorage } from "react-icons/gr";
import { osTemplate, getOsDefaultUbuntu } from "@/constants/os-templates";
import { FaWindows } from "react-icons/fa6";
import { IconType } from "react-icons";
import vpsApis, { VpsPayload } from "@/apis/vps-apis";
import {
	ActionEnum,
	ProviderIDEnum,
	SubjectEnum,
	VpsTypeEnum,
} from "@/constants/enum";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import showToast from "@/utils/toast";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import Access from "@/components/Access/access";
import Count from "@/components/count";
import { rateVAT } from "@/utils";
import orderApis from "@/apis/order.api";
import CreateOrder from "../order/component/CreateOrder";
import {
	setDomainLinkOrder,
	setIsOpenModal,
} from "@/stores/slices/order.slice";

function InitializeVpsVietStack() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

	const { product }: any = useAppSelector((state) => state.prodVietStack);
	const { teams }: any = useAppSelector((state) => state.teams);
	const { orderDomainLink, paymentSelected } = useAppSelector(
		(state) => state.order
	);

	console.log(paymentSelected);
	const [biCycSelected, setBiCycSelected] = useState<Selection>(
		new Set([cycleTime[0]?.id])
	);
	const defaultOs: any = getOsDefaultUbuntu();
	const [osSelected, setOsSelected] = useState<Selection>(
		new Set([defaultOs?.name])
	);
	const [team, setTeam] = useState<Selection>(new Set([]));
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [quantity, setQuantity] = useState<number>(1);

	useEffect(() => {
		(async () => {
			const fetchTeams = await dispatch(asyncThunkGetAllYourTeam()).unwrap();

			setTeam(fetchTeams[0]?._id ? new Set([fetchTeams[0]?._id]) : new Set([]));
		})();

		return () => {};
	}, []);

	useEffect(() => {
		(async () => {
			const { status, data } = await dispatch(
				asyncThunkGetProductById(id as string)
			).unwrap();
			console.log(data);
			if (status === 1) {
				document.title = `VietStack: Khởi tạo VPS - ${data?.name}`;
			}
		})();

		return () => {};
	}, [id]);

	const configInfo: any = useMemo(() => {
		if (!product?.description) return {};

		const prodInfo = parseDesVpsVng(product?.description);

		return {
			cloud: {
				label: "CLOUD",
				icon: TbBrandCloudflare,
				value: product?.name,
			},
			cpu: {
				label: "CPU",
				icon: LuCpu,
				value: prodInfo?.CPU,
			},
			ram: {
				label: "RAM - Mặc định",
				icon: RiRamLine,
				value: prodInfo?.Ram,
			},
			ipv4: {
				label: "IPV4",
				icon: GrLocation,
				value: "1 IPV4",
			},
			bwVn: {
				label: "Băng thông VN",
				icon: RiSignalWifi3Line,
				value: " 1 Gbps",
			},
			bwInt: {
				label: "Băng thông quốc tế",
				icon: RiRadarLine,
				value: "150Mbps",
			},
			storage: {
				label: "Ổ cứng",
				icon: GrStorage,
				value: prodInfo?.Storage,
			},
		};
	}, [product]);

	const renderRowVpsConfig = useCallback(
		(key: VPS_CONFIG) => {
			const IconOs: IconType =
				osTemplate.find((it) => {
					if (osSelected) {
						return it.name === [...osSelected][0];
					}
				})?.icon || FaWindows;

			switch (key) {
				case VPS_CONFIG.CYCLE_TIME:
					return (
						<Select
							aria-label="Payment"
							fullWidth
							variant="underlined"
							radius="sm"
							selectionMode="single"
							disallowEmptySelection
							labelPlacement="outside"
							classNames={{
								label:
									"text-base font-bold text-[#757575] left-0 group-data-[filled=true]:text-primary",
								value: "text-base font-semibold text-[#495057]",
								trigger: "!pl-0 border-b after:bg-primary",
								popoverContent: "rounded",
							}}
							selectedKeys={biCycSelected}
							onSelectionChange={setBiCycSelected}
							// onChange={(e) =>
							//     onChangeSelectedPeriod(e.target.value as CYCLE_TIME)
							// }
							// isInvalid={!selectedPeriod ? true : false}
						>
							{cycleTime?.map((item: any) => (
								<SelectItem key={item?.id} value={item?.id}>
									{item?.name}
								</SelectItem>
							))}
						</Select>
					);

				case VPS_CONFIG.CONFIG:
					return (
						<div className="grid grid-cols-12 items-center gap-x-5 gap-y-2">
							{Object.keys(configInfo)?.map((key: string) => {
								const Icon = configInfo[key].icon;
								const configValue = configInfo[key];

								return (
									<Fragment key={key}>
										<div className="col-span-3 flex items-center gap-3 text-left">
											<Icon className="w-6 h-6 text-primary" />
											<span className="text-lg tracking-wide font-semibold">
												{configValue?.label}:
											</span>
										</div>
										<div className="col-span-3">
											<Chip
												variant="flat"
												color="primary"
												classNames={{
													content: "font-semibold text-base tracking-wider",
												}}
											>
												{configValue?.value}
											</Chip>
										</div>
									</Fragment>
								);
							})}
						</div>
					);

				case VPS_CONFIG.OS:
					return (
						<Select
							aria-label="operating-system"
							fullWidth
							variant="underlined"
							disallowEmptySelection
							radius="sm"
							selectionMode="single"
							labelPlacement="outside"
							classNames={{
								label:
									"text-base font-bold left-0 group-data-[filled=true]:text-primary",
								value: "text-base tracking-wide font-medium",
								trigger: "!pl-0, border-b after:bg-primary",
								popoverContent: "rounded",
							}}
							selectedKeys={osSelected}
							startContent={<IconOs />}
							onSelectionChange={setOsSelected}
							isInvalid={!osSelected ? true : false}
						>
							{osTemplate?.map((item) => {
								const Icon = item.icon;

								return (
									<SelectItem key={item.name} textValue={item.name}>
										<div className="flex items-center gap-2">
											<Icon />
											{item.name}
										</div>
									</SelectItem>
								);
							})}
						</Select>
					);

				case VPS_CONFIG.TEAM:
					return (
						<Select
							aria-label="operating-system"
							fullWidth
							variant="underlined"
							radius="sm"
							selectionMode="single"
							disallowEmptySelection
							labelPlacement="outside"
							classNames={{
								label:
									"text-base font-bold left-0 group-data-[filled=true]:text-primary",
								value: "text-base tracking-wide font-medium",
								trigger: "!pl-0, border-b after:bg-primary",
								popoverContent: "rounded",
							}}
							selectedKeys={team}
							onSelectionChange={setTeam}
							isInvalid={!team ? true : false}
						>
							{teams?.map((item: any) => {
								return (
									<SelectItem key={item._id} textValue={item.name}>
										{item.name}
									</SelectItem>
								);
							})}
						</Select>
					);

				default:
					return <></>;
			}
		},
		[biCycSelected, configInfo, osSelected, team, teams]
	);

	const cyclePay = useMemo(() => {
		if (biCycSelected) {
			const [cycle] = [...biCycSelected];

			const findCycle = cycleTime?.find((it) => it?.id === cycle);

			return findCycle?.extra;
		}

		return "tháng";
	}, [biCycSelected]);

	const price = useMemo(() => {
		if (biCycSelected) {
			const [cycle] = [...biCycSelected];

			return product[cycle];
		}

		return product?.m;
	}, [product, biCycSelected]);
	const totalPrice = useMemo(() => {
		if (biCycSelected) {
			const [cycle] = [...biCycSelected];

			return Number(product[cycle]) * Number(quantity);
		}

		return Number(product?.m) * Number(quantity);
	}, [product, biCycSelected, quantity]);
	const totalPriceVAT: any = (totalPrice * 0.1).toFixed(2);
	const totalPriceOriginal: any = totalPrice;
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const handleCreateOrder = async () => {
		setLoadingSubmit(true);
		const cycle = [...biCycSelected][0] as CYCLE_TIME;
		const os = [...osSelected][0] as string;
		const product_id = product?.product_id as string;
		const getValueTeam = [...team][0] as string;
		const payload = {
			cycle,
			os,
			vpsType: VpsTypeEnum.VIET_STACK,
			product_id,
			quanlity: Number(quantity),
			orderTeamId: getValueTeam,
			description: { ...parseDesVpsVng(product.description), price: product.m },
			orderService: "buy_vps",
			orderTotalPrice: product.m * Number(quantity),
			orderDomainLink,
			productName: product?.name,
			paymentSelected,
		};
		const { data: result } = await orderApis.createOrder(payload);
		if (!result?.status) {
			if (result?.message === "client_id_not_found") {
				showToast("Vui lòng tạo tài khoản", "info");
			}
			if (result?.message === "create_order_fail") {
				showToast("Tạo đơn hàng thất bại", "info");
			}
			return;
		}
		showToast("Tạo đơn hàng thành công", "success");
		setLoadingSubmit(false);
		dispatch(setIsOpenModal(false));
		dispatch(setDomainLinkOrder(new Set([""])));
	};

	const handleSubmit = async () => {
		try {
			setIsLoading(true);

			const cycle = [...biCycSelected][0] as CYCLE_TIME;
			const os = [...osSelected][0] as string;
			const product_id = product?.product_id as string;
			const getValueTeam = [...team][0] as string;

			const payload: VpsPayload = {
				cycle,
				os,
				vpsType: VpsTypeEnum.VIET_STACK,
				product_id,
				quanlity: Number(quantity),
				teamId: getValueTeam,
			};

			const { data } = await vpsApis.createNewVps(payload);

			if (data?.status === 1) {
				showToast("Tạo VPS - VietStack thành công!", "success");
				console.log(data);
				// navigate(paths.invoices_vietstack_detail, {
				//     state: { id: data?.data?.invoice_id },
				//     replace: true,
				// });
			}
		} catch (error: any) {
			console.log("error: ", error);

			switch (error?.response?.data?.status) {
				case 18:
					showToast("Vui lòng tạo tài khoản VPS!", "info");
					break;

				case 21:
					showToast(
						"Tài khoản VPS của Api Key này đã hết hạn. Vui lòng liên hệ với Admin để cung cấp Api Key mới!",
						"info"
					);
					break;

				case 27:
					showToast(
						"Tài khoản VPS của Team này không đủ số dư thể thanh toán!",
						"info"
					);
					break;

				default:
					showToast("Tạo VPS - VietStack thất bại!", "error");
					break;
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Access subject={SubjectEnum.VPS} action={ActionEnum.CREATE}>
			<div className="overflow-hidden grid grid-cols-12 p-2">
				<Container className="col-span-3 sticky top-0 h-max flex flex-col gap-5">
					{/* Header */}
					<div className="flex items-center justify-between gap-4">
						{/* Back to VPS VietStack Page */}
						<Button
							color="primary"
							className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg"
							onPress={() => navigate(paths.vps_vietstack)}
						>
							<HiOutlineArrowLeft />
						</Button>

						<h3 className="text-base font-bold tracking-wide uppercase text-center text-gray-600">
							Tóm tắt đơn hàng
						</h3>
					</div>

					{/* Product Info */}
					<div className="pt-t pb-6 px-2 rounded-md flex flex-col gap-2 shadow-container">
						<h2 className="text-2xl font-extrabold tracking-wide uppercase text-left text-primary">
							{product?.name}
						</h2>

						<div className="mt-1 before:block before:absolute before:-inset-1 before:-skew-y-6 before:bg-primary relative inline-block">
							<div className="text-2xl font-bold tracking-wide text-right text-white -rotate-6">
								<b className="relative">
									{formatPrice(convertVnToUsd(product?.m))}
									<span className="absolute top-0 -right-3 text-base">$</span>
								</b>

								<span className="ml-4 font-normal">/</span>

								<span className="text-sm text-white">tháng</span>
							</div>
						</div>
					</div>

					<div className="shadow-container py-2 px-4 rounded-md">
						{/* Quantity */}
						<div className="flex items-center justify-between gap-4">
							<h3 className="min-w-max text-base font-bold tracking-wide uppercase text-left text-gray-600">
								Số lượng:
							</h3>

							<Count value={quantity} setValue={setQuantity} />
						</div>

						{/* Price */}
						<div className="flex items-center justify-between gap-3 mt-5">
							<h3 className="text-base font-bold tracking-wide uppercase text-left text-gray-600">
								Thành tiền:
							</h3>

							<div className="text-lg font-semibold tracking-wide text-center text-primary">
								<b className="relative">
									{formatPrice(convertVnToUsd(price))}
									<span className="absolute top-0 -right-3 text-sm">$</span>
								</b>
								<span className="ml-4 font-normal">/ </span>
								<span className="text-sm text-primary">{cyclePay}</span>
							</div>
						</div>
						<div className="flex items-center justify-between gap-3 mt-5">
							<h3 className="text-base font-bold tracking-wide uppercase text-left text-gray-600">
								VAT ({rateVAT}%):
							</h3>

							<div className="text-lg font-semibold tracking-wide text-center text-primary">
								<div className="flex gap-5">
									<b className="relative">
										{formatPrice(convertVnToUsd(totalPrice * (rateVAT / 100)))}
										<span className="absolute top-0 -right-3 text-sm">$</span>
									</b>
								</div>
							</div>
						</div>
					</div>

					{/* Total Price */}
					<div className="flex items-center justify-between gap-3 px-4 py-2 shadow-container rounded-md">
						<h3 className="text-base font-bold tracking-wide uppercase text-left text-gray-600">
							Tổng tiền:
						</h3>

						<div className="text-lg font-semibold tracking-wide text-center text-primary mr-3">
							<b className="relative">
								{formatPrice(
									convertVnToUsd(totalPriceVAT, "VST") +
										convertVnToUsd(totalPriceOriginal, "VST")
								)}
								<span className="absolute top-0 -right-3 text-sm">$</span>
							</b>
						</div>
					</div>

					<Button
						fullWidth
						color="primary"
						className="pr-2 rounded-md uppercase font-bold bg-[#ff990026] text-primary"
						onPress={handleSubmit}
						isLoading={isLoading}
					>
						Khởi tạo ngay
					</Button>
					{/* <Button
            fullWidth
            color="primary"
            className="pr-2 rounded-md uppercase font-bold bg-[#ff990026] text-primary"
            onPress={handleCreateOrder}
            isLoading={isLoading}
          >
            Tạo đơn hàng
          </Button> */}
					<CreateOrder
						teamId={team}
						handleCreateOrder={handleCreateOrder}
						providerId={ProviderIDEnum.VIET_STACK}
						loadingSubmit={loadingSubmit}
					/>
				</Container>

				<div className="col-span-9 flex flex-col gap-y-3 pl-4 justify-between">
					{VPS_CONFIG_STEPS?.map((step) => {
						const Icon = step?.icon;

						return (
							<div key={step?.key} className="p-0 shadow-container rounded-md">
								<div className="rounded-tl-md rounded-tr-md flex items-center gap-3 bg-primary px-2 py-1">
									<Icon className="text-white w-5 h-5" />

									<h3 className="text-lg font-bold uppercase tracking-wide text-white">
										{step?.label}
									</h3>
								</div>

								<div className="p-2">{renderRowVpsConfig(step?.key)}</div>
							</div>
						);
					})}
				</div>
			</div>
		</Access>
	);
}

export default InitializeVpsVietStack;
