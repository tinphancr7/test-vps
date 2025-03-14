import cartApis, {PayloadAddToCart} from "@/apis/cart-api";
import suppliesDomainApi from "@/apis/supplies-domain.api";
import {useAppDispatch, useAppSelector} from "@/stores";
import {addToCart} from "@/stores/slices/cart-slice";
import showToast from "@/utils/toast";
import {Button, Chip} from "@heroui/react";
import {useState} from "react";
import {BiSolidError} from "react-icons/bi";
import {BsCartPlus} from "react-icons/bs";
import {IoIosArrowDown} from "react-icons/io";
import {IoClose} from "react-icons/io5";
import {MdErrorOutline, MdOutlineDone} from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";

const MAX_SIZE_DATA = 5;

function GnameList({domains, error, name, index, isActive}: any) {
	const dispatch = useAppDispatch();
	const {domains: domainsInCart} = useAppSelector((state) => state.cart);
	const [domainsList, setDomainsList] = useState(domains);
	const [tldIndex, setTldIndex] = useState<number>(index);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(domains?.length === 5);

	const getMessageError = (error: string) => {
		switch (error) {
			case "domain_is_not_emty":
				return "Tên miền không được để trống!";

			case "domain_name_not_valid":
				return "Tên miền không hợp lệ!";
			default:
				return "Lỗi máy chủ vui lòng thử lại sau!";
		}
	};

	const handleLoadMore = async () => {
        if (!name) {
            showToast('Vui lòng nhập tên domain!', 'info');
            return;
        }
        
		try {
			setIsLoading(true);

			const {data} = await suppliesDomainApi.loadMoreGname({
				domain_name: name.trim(),
				index: tldIndex + 1,
			});

			if (data?.status === 1) {
				setDomainsList((prev: any) => [...prev, ...(data?.domains || [])]);
				setTldIndex(data?.index);

				setHasMore(data?.domains?.length >= MAX_SIZE_DATA);
			}
		} catch (error) {
			console.log("error: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isExistingInCart = (info: any) =>
		domainsInCart?.find(
			(it: any) =>
				it?.domainProvider === info?.supplier && it?.domain === info?.domainName
		);

	const handleAddToCart = async (info: any) => {
		const payload: PayloadAddToCart = {
			domainProvider: info?.supplier,
			domain: info?.domainName,
			price: info?.priceUSD,
			renewal: info?.renewalUSD,
		};

		const isExisting = !domainsInCart?.length ? false : isExistingInCart(info);

		let cartItems = [];

		if (!isExisting) {
			// Add to Cart
			cartItems = [payload, ...domainsInCart];
		} else {
			// Remove To Cart
			cartItems = domainsInCart?.filter(
				(it: any) =>
					it?.domainProvider === info?.supplier &&
					it?.domain !== info?.domainName
			);
		}

		try {
			dispatch(addToCart(cartItems));

			const {data} = await cartApis.addToCart(cartItems);

			if (data?.status === 1) {
				showToast("Cập nhật giỏ hảng thành công!", "success");
			}
		} catch (error) {
			console.log("error: ", error);
		}
	};

	return (
		<div className="flex flex-col gap-6 rounded border-gray-100 border-1 p-4 shadow-lg">
			<div
				className={`py-4 flex items-center gap-2 text-gray-800 font-semibold text-[15px] ${
					isActive ? "sticky top-0 bg-white" : ""
				}`}
			>
				<img
					src="/imgs/gname.jpg"
					alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
					className="w-6 rounded-md"
				/>
				<span>Gname</span>
			</div>

			{!domainsList?.length ? (
				<div className="flex items-center justify-center gap-4">
					<TbFaceIdError size={50} color="orange" />
					<p className="py-4 text-lg text-center tracking-wider font-medium">
						Không tìm thấy tên miền!
					</p>
				</div>
			) : domainsList?.map((domain: any, index: number) => (
					<div key={index} className="flex flex-col gap-3 w-full">
						{error ? (
							<div className="py-2 w-full flex justify-center items-center  text-[15px] font-medium gap-2 pb-6">
								<MdErrorOutline color="red" size={18} />
								{getMessageError(error)}
							</div>
						) : (
							<div className="flex justify-between items-center w-full px-3 border-[1.5px]  border-gray-100 py-4 rounded">
								<div className="flex gap-2 items-center justify-center">
									{!domain?.available || domain?.available === "no" ? (
										<BiSolidError color="#F68727" size={28} />
									) : (
										<div className="w-6 h-6 rounded-full border-1 border-green-500 flex justify-center items-center mt-1">
											<MdOutlineDone color="#4ade80" />
										</div>
									)}
									<p className="text-black text-lg font-semibold tracking-wider">
										{domain?.domainName}
									</p>
								</div>
								<div className="flex gap-8 items-center justify-center">
									<div className="flex flex-col gap-2 justify-end items-end">
										{!domain?.available || domain?.available === "no" ? (
											<>
												<Chip
													color="primary"
													radius="sm"
													classNames={{
														content: "tracking-wider font-medium",
													}}
												>
													Whois
												</Chip>
												<p className="text-black text-base tracking-wide">
													Tên miền đã được đăng kí
												</p>
											</>
										) : (
											<>
												<p className="text-black text-md font-semibold tracking-wider">
													{domain?.priceUSD} $
												</p>

												<p className="text-black text-base tracking-wide">
													Gia hạn với giá {domain?.renewalUSD} $
												</p>
											</>
										)}
									</div>

									{domain?.available === "yes" && (
										<Button
											color="primary"
											variant="solid"
											className={`rounded-full w-8 min-w-0 h-8 ${
												isExistingInCart(domain) ? "bg-danger" : "bg-primary-500"
											}`}
											onPress={() => handleAddToCart(domain)}
										>
											{isExistingInCart(domain) ? (
												<IoClose className="min-w-max w-5 h-5" />
											) : (
												<BsCartPlus className="min-w-max w-5 h-5" />
											)}
										</Button>
									)}
								</div>
							</div>
						)}
					</div>
				)
			)}

			{hasMore && (
				<div className="flex justify-center">
					<Button
						color="primary"
						variant="solid"
						className="rounded-sm min-h-0 h-7 text-base"
						endContent={<IoIosArrowDown className="w-4 h-4" />}
						onPress={handleLoadMore}
						// isDisabled={!hasMore}
						isLoading={isLoading}
					>
						Xem thêm
					</Button>
				</div>
			)}
		</div>
	);
}

export default GnameList;
