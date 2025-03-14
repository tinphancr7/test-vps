import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataSizeDigitalOcean } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-size.slice";
import {
  handleDisplayDiskTransfer,
  handleDisplayMemory,
} from "@/utils/digital-ocean";
import { clsx } from "@heroui/shared-utils";
import { useEffect, useMemo } from "react";

// hanle cai fedora min disk size
//handle cai datacenter

function CardCPUOptions({ dataCPUOptions }: any) {
  //   const { setDataCreateDoplet, dataCenter, selectImage, selectCPU } =
  //     useCreateDropletStore();
  const { selectedImage }: any = useAppSelector(
    (state) => state.digitalOceanImage
  );
  const { selectedDataCenter }: any = useAppSelector(
    (state) => state.digitalOceanRegion
  );

  const { selectedSize }: any = useAppSelector(
    (state) => state.digitalOceanSize
  );

  const dispatch = useAppDispatch();
  const nameOfImage = selectedImage?._id;
  const [strDataCenter] = selectedDataCenter;
  /*Kiểm tra nếu image là fedora thì | item.disk < 20 || item.memory < 2048 | -> return null
   * Fedora requires a minimum of 20GB disk, 2GB RAM, to install and run successfully. Double those amounts is recommended.
   */
  const convertDataCPUOptions = useMemo(() => {
    const data = dataCPUOptions.map((item: any) => {
      let isAvailable = true;
      if (
        !item.regions.includes(strDataCenter) ||
        ((item.disk < 20 || item.memory < 2048) && nameOfImage === "Fedora")
      ) {
        isAvailable = false;
      }
      return { ...item, isAvailable };
    });
    return data;
  }, [dataCPUOptions, selectedImage, selectedDataCenter]);

  const findFirstCPU = convertDataCPUOptions.find((item: any) => {
    return item.isAvailable === true;
  });
  //set phần tử đầu tiên của dataCPUOption
  useEffect(() => {
    dispatch(setDataSizeDigitalOcean({ selectedSize: findFirstCPU }));
  }, [convertDataCPUOptions]);

  const handleChangeDetailedSize = (size: any) => {
    dispatch(setDataSizeDigitalOcean({ selectedSize: size }));
  };
  //only select cpu option first

  return (
    <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 xl:grid-cols-6 my-4 gap-4">
      {convertDataCPUOptions.map((item: any, index: any) => {
        const isActive: boolean = selectedSize?.slug === item.slug;
        return (
          <div
            onClick={
              item.isAvailable
                ? () => {
                    handleChangeDetailedSize(item);
                  }
                : undefined
            }
            key={item.slug + index}
            className={clsx(
              `sizeDetail flex flex-col text-center border-solid border  ${
                item.isAvailable
                  ? "cursor-pointer "
                  : "cursor-not-allowed opacity-40"
              }`,
              {
                "border-primary isActive": isActive,
                "border-[#dfdfdf]": !isActive,
              }
            )}
          >
            <div
              className={clsx(
                "title flex flex-col border-solid border-b-1 py-2",
                {
                  "border-primary bg-[#f5f9ff] text-primary": isActive,
                  "border-[#dfdfdf]": !isActive,
                }
              )}
            >
              <span>
                <sup>$</sup>
                <span className="text-3xl font-semibold">
                  {item.price_monthly}
                </span>
                / <span>tháng</span>
              </span>
            </div>
            <div className="conent p-2 text-sm">
              <span className="block">
                {handleDisplayMemory(item.memory)}
                <span className="text-[#bbb]">
                  / {item.vcpus}{" "}
                  {/* {cpuOptionSelected.key.includes(TypeCPUOption.REGULAR) ||
                    cpuOptionSelected.key.includes(TypeCPUOption.PREMIUM)
                      ? ''
                      : cpuOptionSelected.key}{' '} */}
                  CPU
                </span>
              </span>
              <span className="block">
                {item.disk} GB{" "}
                <span className="text-[#bbb]">
                  {/* {cpuOptionSelected.type === TypeCPUOption.PREMIUM
                      ? 'NVMe SSDs'
                      : 'SSD Disk'} */}
                </span>
              </span>
              <span className="block">
                {handleDisplayDiskTransfer(item.transfer)}{" "}
                <span className="text-[#bbb]">Transfer</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CardCPUOptions;
