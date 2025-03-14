"use client";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getAllListSize } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-size.slice";
import { clsx } from "@heroui/shared-utils";
import { useEffect, useState } from "react";
import CPUOptionsDigitalOcean from "./CPUOptionDigitalOcean";

function SizeDigitalOcean() {
  const dispatch = useAppDispatch();
  const { listSizes }: any = useAppSelector((state) => state.digitalOceanSize);
  useEffect(() => {
    dispatch(getAllListSize());
  }, []);

  enum DESCRIPT_DROPLET_TYPE {
    BASIC = "Basic virtual machines with a mix of memory and compute resources. Best for small projects that can handle variable levels of CPU performance, like blogs, web apps and dev/test environments.",
    GENERAL_PURPOSE = "High performance virtual machines with a good balance of memory and dedicated hyper-threads from best in class Intel processors. A great choice for a wide range of mainstream, production workloads, like web app hosting, e-commerce sites, medium-sized databases, and enterprise applications.",
    CPU_OPTIMIZED = "Compute-optimized virtual machines with dedicated hyper-threads from best in class Intel processors. Best for CPU-intensive applications like CI/CD, video encoding and transcoding, machine learning, ad serving, batch processing, and active front-end web and application servers. For AI/ML workloads, such as training or inferencing,",
    MEMORY_OPTIMIZED = "Memory-rich virtual machines with super fast NVMe storage, 8GB of RAM per vCPU and dedicated hyper-threads from best-in-class Intel processors. Ideal for RAM-intensive applications like high-performance databases, web scale in-memory caches, and real-time big data processing.",
    STORAGE_OPTIMIZED = "Droplets with large amounts of super fast NVMe storage, suitable for large NoSQL databases (e.g. MongoDB, Elasticsearch), time series databases, and other data warehouses.",
  }
  enum DROPLET_TYPE {
    BASIC = "Basic",
    GENERAL_PURPOSE = "General Purpose",
    CPU_OPTIMIZED = "CPU-Optimized",
    MEMORY_OPTIMIZED = "Memory-Optimized",
    STORAGE_OPTIMIZED = "Storage-Optimized",
  }
  const LIST_DESC_SIZE: any = {
    [DROPLET_TYPE.BASIC]: "Basic",
    [DROPLET_TYPE.GENERAL_PURPOSE]: "General Purpose",
    [DROPLET_TYPE.CPU_OPTIMIZED]: "CPU-Optimized",
    [DROPLET_TYPE.MEMORY_OPTIMIZED]: "Memory-Optimized",
    [DROPLET_TYPE.STORAGE_OPTIMIZED]: "Storage-Optimized",
  };
  const dataByKey: any = {
    Basic: listSizes?.basic,
    "General Purpose": listSizes?.generalPurpose,
    "CPU-Optimized": listSizes?.cpuOptimized,
    "Memory-Optimized": listSizes?.memoryOptimized,
    "Storage-Optimized": listSizes?.storageOptimized,
  };

  const [selectDropletType, setSelectDropletType] = useState<any>({
    key: DROPLET_TYPE.BASIC,
    name: DROPLET_TYPE.BASIC,
    desc: DESCRIPT_DROPLET_TYPE.BASIC,
  });

  const handleChangeDropletType = ({ key, desc, name }: any) => {
    setSelectDropletType({
      name,
      key,
      desc,
    });
  };
  return (
    <div>
      <h1 className="font-bold mb-2">Chọn cấu hình</h1>
      <h1 className="font-bold mb-2">Loại VPS</h1>
      <div className="grid md:grid-cols-12  gap-2">
        <div className="md:col-span-2 text-center">
          <h4 className="px-2 py-2 bg-[#F1F1F1] border border-[#dfdfdf] border-b-0 font-bold text-xs lg:text-sm">
            Dùng chung CPU
          </h4>
          <div
            onClick={() =>
              handleChangeDropletType({
                key: DROPLET_TYPE.BASIC,
                desc: DESCRIPT_DROPLET_TYPE.BASIC,
                name: DROPLET_TYPE.BASIC,
              })
            }
            className={clsx(
              "p-4 content flex flex-col cursor-pointer relative border-solid  border-1 ",
              {
                " border-primary bg-[#f5f9ff]":
                  selectDropletType.key === DROPLET_TYPE.BASIC,
                "after:hidden md:after:block after:content-['']  after:absolute after:w-4 after:h-4 after:bg-[#ffffff] after:rotate-45 after:-translate-x-2/4 after:bottom-[-50px] after:border-r-0 after:border-b-0 after:border-2 after:border-solid after:border-[#dfdfdf] after:left-[50%]":
                  selectDropletType.key === DROPLET_TYPE.BASIC,
                "border-[#dfdfdf] border-t-1":
                  selectDropletType.key !== DROPLET_TYPE.BASIC,
              }
            )}
          >
            <span className="text-xs lg:text-sm font-bold">Cơ bản</span>
            {/* <span>(Plan selected)</span> */}
          </div>
        </div>

        <div className="md:col-span-10  text-center flex flex-col">
          <h4 className="px-2 py-2 bg-[#F1F1F1] border border-[#dfdfdf] border-b-0 font-bold text-xs lg:text-sm">
            CPU Riêng
          </h4>
          <div className="flex h-full">
            {Object.keys(DROPLET_TYPE).map((key: string, index: number) => {
              const isLastItem: boolean =
                Object.values(DROPLET_TYPE).length - 1 === index;
              const isSelected: boolean =
                selectDropletType.key ===
                DROPLET_TYPE[key as keyof typeof DROPLET_TYPE];

              if (index > 0) {
                return (
                  <span
                    key={index}
                    onClick={() =>
                      handleChangeDropletType({
                        key: DROPLET_TYPE[key as keyof typeof DROPLET_TYPE],
                        desc: DESCRIPT_DROPLET_TYPE[
                          key as keyof typeof DESCRIPT_DROPLET_TYPE
                        ],
                        name: DROPLET_TYPE[key as keyof typeof DROPLET_TYPE],
                      })
                    }
                    className={clsx(
                      "flex items-center justify-center w-1/4 border-solid cursor-pointer relative border-1 text-xs lg:text-sm font-bold lg:font-normal",

                      {
                        "border-primary border-r-1 bg-[#f5f9ff]": isSelected,

                        "after:hidden md:after:block after:content-['']  after:absolute after:w-4 after:h-4 after:bg-[#ffffff] after:rotate-45 after:-translate-x-2/4 after:bottom-[-50px] after:border-r-0 after:border-b-0 after:border-2 after:border-solid after:border-[#dfdfdf] after:left-[50%]":
                          isSelected,
                        "border-[#dfdfdf] border-r-1": !isSelected,
                      },
                      {
                        "border-r-0": !isLastItem,
                      }
                    )}
                  >
                    {DROPLET_TYPE[key as keyof typeof DROPLET_TYPE]}
                  </span>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div>
        <div className="line border-1 border-[#dfdfdf] md:my-10 my-4 "></div>
        <div className="text-[#676767]"></div>
        {/* {LIST_DESC_SIZE[selectDropletType.key]} */}
        {selectDropletType.desc}
      </div>
      <CPUOptionsDigitalOcean
        keyData={LIST_DESC_SIZE[selectDropletType.key]}
        dataOfCPUByKey={dataByKey[selectDropletType.key]}
      />
    </div>
  );
}

export default SizeDigitalOcean;
