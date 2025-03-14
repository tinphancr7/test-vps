import { Image, Select, SelectItem, Tooltip } from "@heroui/react";
import { publicPlatform } from "./constants";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setMinSize, setPlatform, setSize, setVersionPlatform } from "@/stores/slices/alibaba-ecs.slice";
import { RxQuestionMarkCircled } from "react-icons/rx";

function ImageSelect() {
	const dispatch = useAppDispatch();
	const {imagesList, platform, versionPlatform} = useAppSelector(
		(state) => state.alibabaEcs
	);

	const getImagesListByPlatform = (os: string) => {
		return imagesList?.filter((img: any) => {
			const replacePlatform = img.Platform?.replace(/\d+/g, "").trim();

			return replacePlatform === os;
		});
	};

	const isDisabled = (os: string) => {
		const findOne = imagesList?.find((img: any) => {
			const replacePlatform = img.Platform?.replace(/\d+/g, "").trim();

			return replacePlatform === os;
		});

		return findOne ? false : true;
	};

	const isActiveOS = (os: string) => {
		const replacePlatform = os?.replace(/\d+/g, "").trim();

		return replacePlatform === platform ? true : false;
	};

	const handleChangePlatform = (os: string) => {
		if (!isDisabled(os)) {
			dispatch(setPlatform(os));
		}

		const image = imagesList?.find(
			(img: any) => img?.ImageId === versionPlatform[os]
		);

		if (image) {
			dispatch(setSize(image?.Size));
			dispatch(setMinSize(image?.Size));
		}
	};

    const handleChangeVersionPlatform = (img: string, value: any) => {
        const [ImageId] = [...value];

        dispatch(
            setVersionPlatform({
                platform: img,
                ImageId,
            })
        );

        const image = imagesList?.find((img: any) => img?.ImageId === ImageId);

		if (image) {
			dispatch(setSize(image?.Size));
			dispatch(setMinSize(image?.Size));
		}
	};

	const renderTooltip = (
		<p>
			Một hình ảnh hoạt động như một đĩa cài đặt và cung cấp thông tin cần thiết
			để tạo một phiên bản. Một hình ảnh chứa hệ điều hành, dữ liệu ứng dụng ban
			đầu và phần mềm được cài đặt sẵn.
		</p>
	);

	return (
		<div className="grid grid-cols-7 gap-2">
			<div className="flex items-center gap-1">
				<h3 className="text-base tracking-wide font-medium">Hệ điều hành</h3>

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

			<div className="col-span-6 grid grid-cols-3 gap-4">
				{Object.keys(publicPlatform)?.map((img: string) => (
					<div
						key={img}
						className={`${
							isActiveOS(img) ? "border-primary" : "border-gray-200"
						} text-dark border rounded-md p-3 flex flex-col gap-2 items-center justify-center ${
							isDisabled(img)
								? "bg-gray-100/80 opacity-50 cursor-not-allowed"
								: "bg-transparent opacity-100 hover:border-primary cursor-pointer"
						}
                        `}
						onClick={() => handleChangePlatform(img)}
					>
						<Image
							width={30}
							height={30}
							src={`/imgs/alibaba-ecs/${(publicPlatform as any)[img]?.icon}`}
						/>

						<h3 className="text-base font-medium tracking-wider capitalize select-none">
							{(publicPlatform as any)[img]?.name}
						</h3>

                        <Select
                            items={getImagesListByPlatform(img) || []}
                            placeholder="All Categories"
                            selectionMode="single"
                            classNames={{
                                base: "w-full",
                                label: "text-dark font-medium",
                                value: "text-center text-base",
                                trigger:
                                    "rounded-sm text-dark min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                            }}
                            disallowEmptySelection={false}
                            selectedKeys={new Set([versionPlatform?.[img] || ""])}
                            onSelectionChange={(value) => handleChangeVersionPlatform(img, value)}
                        >
                            {(item: any) => (
                                <SelectItem key={item?.ImageId} textValue={item?.OSNameEn}>
                                    {item?.OSNameEn}
                                </SelectItem>
                            )}
                        </Select>

                        {/* 
                            <Autocomplete
                                aria-label={'image-platform'}
                                fullWidth
                                defaultItems={getImagesListByPlatform(img) || []}
                                labelPlacement="outside"
                                placeholder={'Chọn version...'}
                                radius="sm"
                                variant="bordered"
                                inputProps={{
                                    classNames: {
                                        label: "text-dark font-medium",
                                        inputWrapper:
                                            "border border-slate-400 group-data-[open=true]:border-primary group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
                                    },
                                }}
                                scrollShadowProps={{
                                    isEnabled: false
                                }}
                                isDisabled={isDisabled(img)}
                                selectedKey={versionPlatform?.[img] || ""}
                                onSelectionChange={(value) => handleChangeVersionPlatform(img, value)}
                            >
                                {(item: any) => (
                                    <AutocompleteItem key={item.ImageId}>{item.OSNameEn}</AutocompleteItem>
                                )}
                            </Autocomplete>
                         */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageSelect;
