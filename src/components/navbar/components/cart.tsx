import cartApis from "@/apis/cart-api";
import ordersDomainApis from "@/apis/order-domain-api";
import { classNamesAutoComplete, initPropsAutoComplete } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { asyncThunkGetAllBrands } from "@/stores/slices/brand-slice";
import {
  addToCart,
  asyncThunkGetCartInfo,
  DomainProviderNameEnum,
} from "@/stores/slices/cart-slice";
import { resetModal } from "@/stores/slices/modal-slice";
import { asyncThunkGetPaginationOrdersDomain } from "@/stores/slices/orders-domain-slice";
import showToast from "@/utils/toast";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Divider,
	Input,
	ModalFooter,
} from "@heroui/react";
import {useEffect, useMemo, useState} from "react";
import {IoClose} from "react-icons/io5";
import {SiGodaddy} from "react-icons/si";
import { TbFaceIdError } from "react-icons/tb";

function Cart() {
  const dispatch = useAppDispatch();
  const { domains } = useAppSelector((state) => state.cart);
  console.log("domains", domains);
  const { teams } = useAppSelector((state) => state.teams);
  const { brands } = useAppSelector((state) => state.brand);
  const tableOrderDomain = useAppSelector((state) => state.table["ordersDomain"]);
  const { teamSelected, brandSelected, searchByCode } = useAppSelector(
    (state) => state.ordersDomain,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<any>("");
  const [brand, setBrand] = useState<any>("");
  const [name, setName] = useState<any>("");

  useEffect(() => {
    dispatch(asyncThunkGetAllYourTeam());
    dispatch(asyncThunkGetAllBrands());

    return () => {};
  }, []);

  const columns = [
    { _id: "domain", name: "Domain", classes: "col-span-5" },
    { _id: "expiration", name: "Thời gian", classes: "col-span-3 text-center" },
    { _id: "price", name: "Thành tiền", classes: "col-span-3 text-center" },
    { _id: "actions", name: "", classes: "col-span-1 text-center" },
  ];

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

		switch (columnKey) {
			case "domain":
				return <span className="pl-8">{cellValue}</span>;

      case "expiration":
        return "1 năm";

      case "price":
        return `${cellValue} $`;

      case "actions":
        return (
          <Button
            color="danger"
            variant="solid"
            className={`rounded-full w-5 min-w-0 h-5 p-2`}
            onPress={() => handleRemoveItem(item)}
          >
            <IoClose className="min-w-max w-4 h-4" />
          </Button>
        );

      default:
        return cellValue;
    }
  };

  const dynadotDomains = useMemo(() => {
    return domains?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.DYNADOT);
  }, [domains]);

  const godaddyDomains = useMemo(() => {
    return domains?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.GODADDY);
  }, [domains]);

  const gnameDomains = useMemo(() => {
    return domains?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.GNAME);
  }, [domains]);

  const nameDomains = useMemo(() => {
    return domains?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.NAME);
  }, [domains]);

  const epikDomains = useMemo(() => {
    return domains?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.EPIK);
  }, [domains]);

  const nameCheapDomains = useMemo(() => {
    return domains?.filter((it: any) => it?.domainProvider === DomainProviderNameEnum.NAME_CHEAP);
  }, [domains]);

  const totalPrice = useMemo(() => {
    const calculator =
      domains?.reduce((total: number, item: any) => (total += parseFloat(item?.price)), 0) || 0;
    if (calculator) {
      return calculator?.toFixed(2);
    }

    return calculator;
  }, [domains]);

  const handleRemoveItem = async (domain: any) => {
    const newItems = domains?.filter(
      (it: any) => it?.domain !== domain?.domain || it?.domainProvider !== domain?.domainProvider,
    );

    try {
      dispatch(addToCart(newItems));

      const { data } = await cartApis.addToCart(newItems);

      if (data?.status === 1) {
        showToast("Cập nhật giỏ hảng thành công!", "success");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const onSubmit = async () => {
    if (!name) {
      return showToast("Vui lòng nhâp tên đơn hàng!", "info");
    }

    if (!team) {
      return showToast("Vui lòng chọn Team!", "info");
    }

    if (!brand) {
      return showToast("Vui lòng chọn thương hiệu!", "info");
    }

    try {
      setIsLoading(true);

      const { data } = await ordersDomainApis.create({
        name,
        team,
        brand,
      });

      if (data?.status === 1) {
        showToast("Đặt hàng thành công!", "success");
        dispatch(asyncThunkGetCartInfo());
        dispatch(resetModal());

        const query: any = {};

        if (searchByCode !== undefined) {
          query.search = searchByCode;
        }

        if (teamSelected) {
          query.team = teamSelected;
        }

        if (brandSelected) {
          query.brand = brandSelected;
        }

        if (tableOrderDomain) {
          const cPageSize = tableOrderDomain?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...tableOrderDomain?.pageSize][0]
            : 10;

          query.pageIndex = tableOrderDomain?.pageIndex || 1;
          query.pageSize = cPageSize;

          dispatch(asyncThunkGetPaginationOrdersDomain(query));
        }
      }
    } catch (error: any) {
      console.log("error: ", error);
      showToast(error?.response?.data?.message || "Đặt hàng thất bại!", "error");
    } finally {
      setIsLoading(false);
    }
  };

	return (
		<div className="h-full flex flex-col items-stretch">
			{!!domains?.length && (
				<div className="flex flex-col gap-4">
					<Input
						radius="none"
						color="primary"
						variant="bordered"
						labelPlacement="outside"
						classNames={{
							inputWrapper:
								"h-10 data-[hover=true]:border-primary border border-slate-400",
							label: "text-dark font-medium",
						}}
						type={"text"}
						placeholder={"Tên đơn hàng..."}
						value={name}
						onValueChange={setName}
						onKeyDown={(event) => event.key === "Enter" && onSubmit()}
						isInvalid={!name}
						errorMessage={!name ? "Vui lòng nhập tên đơn hàng!" : ""}
					/>

					<Autocomplete
						defaultItems={teams}
						placeholder="Team"
						radius="none"
						variant="bordered"
						inputProps={initPropsAutoComplete}
						classNames={classNamesAutoComplete}
						selectedKey={team}
						onSelectionChange={setTeam}
						isInvalid={!team}
						errorMessage={!team ? "Vui lòng chọn Team!" : ""}
					>
						{(item: any) => (
							<AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
						)}
					</Autocomplete>

					<Autocomplete
						defaultItems={brands}
						placeholder="Thương hiệu"
						radius="none"
						variant="bordered"
						inputProps={initPropsAutoComplete}
						classNames={classNamesAutoComplete}
						selectedKey={brand}
						onSelectionChange={setBrand}
						isInvalid={!brand}
						errorMessage={!brand ? "Vui lòng chọn thương hiệu!" : ""}
					>
						{(item: any) => (
							<AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
						)}
					</Autocomplete>
				</div>
			)}

      <div className="grow overflow-auto scroll-main mt-4">
        <div className="grid grid-cols-12 bg-primary">
          {columns?.map((col) => (
            <div
              key={col?._id}
              className={`${col?.classes} p-2 text-base uppercase text-light font-semibold tracking-wider`}
            >
              {col?.name}
            </div>
          ))}
        </div>

				{domains?.length ? (
					<>
						{/* Godaddy */}
						<div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
							<SiGodaddy className="text-[#54CBD2] text-[20px]" />

							<span>Godaddy</span>
						</div>

						{godaddyDomains?.map((domain: any, index: number) => (
							<div key={index} className="grid grid-cols-12">
								{columns?.map((col) => (
									<div
										key={col?._id}
										className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
									>
										{renderCell(domain, col?._id)}
									</div>
								))}
							</div>
						))}

						{/* Dynadot */}
						<div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
							<img
								src="/imgs/dynadot.png"
								alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
								className="w-5 rounded-md"
							/>
							<span>Dynadot</span>
						</div>

						<div className="divide-y-1">
							{dynadotDomains?.map((domain: any, index: number) => (
								<div key={index} className="grid grid-cols-12">
									{columns?.map((col) => (
										<div
											key={col?._id}
											className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
										>
											{renderCell(domain, col?._id)}
										</div>
									))}
								</div>
							))}
						</div>

						{/* Gname */}
						<div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
							<img
								src="/imgs/gname.jpg"
								alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
								className="w-5 rounded-md"
							/>
							<span>Gname</span>
						</div>

						<div className="divide-y-1">
							{gnameDomains?.map((domain: any, index: number) => (
								<div key={index} className="grid grid-cols-12">
									{columns?.map((col) => (
										<div
											key={col?._id}
											className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
										>
											{renderCell(domain, col?._id)}
										</div>
									))}
								</div>
							))}
						</div>

						{/* Name */}
						<div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
							<img
								src="/imgs/name.png"
								alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
								className="w-5 rounded-md"
							/>
							<span>Name</span>
						</div>

						<div className="divide-y-1">
							{nameDomains?.map((domain: any, index: number) => (
								<div key={index} className="grid grid-cols-12">
									{columns?.map((col) => (
										<div
											key={col?._id}
											className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
										>
											{renderCell(domain, col?._id)}
										</div>
									))}
								</div>
							))}
						</div>
						{/* Epik */}
						<div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
							<img
								src="/imgs/epik.png"
								alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
								className="w-5 rounded-md"
							/>
							<span>Epik</span>
						</div>

						<div className="divide-y-1">
							{epikDomains?.map((domain: any, index: number) => (
								<div key={index} className="grid grid-cols-12">
									{columns?.map((col) => (
										<div
											key={col?._id}
											className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
										>
											{renderCell(domain, col?._id)}
										</div>
									))}
								</div>
							))}
						</div>

            {/* Name Cheap */}
        <div className="p-2 flex items-center gap-2 text-gray-800 font-semibold text-base">
          <img
            src="/imgs/namecheap.png"
            alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
            className="w-5 rounded-md"
          />
          <span>Name Cheap</span>
        </div>

        <div className="divide-y-1 pl-8">
          {nameCheapDomains?.map((domain: any, index: number) => (
            <div key={index} className="grid grid-cols-12">
              {columns?.map((col) => (
                <div
                  key={col?._id}
                  className={`${col?.classes} p-2 text-base font-semibold tracking-wider`}
                >
                  {renderCell(domain, col?._id)}
                </div>
              ))}
            </div>
          ))}
        </div>
					</>
				) : (
					<div className="flex items-center justify-center gap-4 mt-4">
						<TbFaceIdError size={40} color="orange" />
						<p className="py-4 text-base text-center tracking-wider font-medium">
							Giỏ hàng trống
						</p>
					</div>
				)}


        <Divider className="my-5" />

        <div className="flex items-center justify-start gap-4">
          <p className="tracking-wider font-medium text-base">Tổng số tiền:</p>
          <b className="tracking-wider text-base">{totalPrice} $</b>
        </div>
      </div>

      <ModalFooter className="px-2 sticky bottom-0 border-t gap-4 bg-white mt-5">
        <Button
          variant="solid"
          color="danger"
          className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
          onPress={() => dispatch(resetModal())}
        >
          Hủy
        </Button>
        <Button
          variant="solid"
          className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
          isLoading={isLoading}
          onPress={onSubmit}
          // eslint-disable-next-line no-extra-boolean-cast
          isDisabled={!!domains?.length ? false : true}
        >
          Đặt hàng
        </Button>
      </ModalFooter>
    </div>
  );
}

export default Cart;
