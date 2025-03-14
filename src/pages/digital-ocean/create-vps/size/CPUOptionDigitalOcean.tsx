"use client";

import { cn, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useState } from "react";
import CardCPUOptions from "./CardCPUOptions";

function CPUOptionsDigitalOcean({ keyData, dataOfCPUByKey }: any) {
  const [typeCPU, setTypeCPU] = useState("");
  const [listDataOption, setListDataOption] = useState([]);
  useEffect(() => {
    if (dataOfCPUByKey) {
      setTypeCPU(Object.keys(dataOfCPUByKey)[0]);
      setListDataOption(dataOfCPUByKey[Object.keys(dataOfCPUByKey)[0]]);
    }
  }, [keyData, dataOfCPUByKey]);
  const CPUOption: any = {
    Basic: {
      regular: {
        title: "Regular",
        desc: "Disk type: SSD",
      },
      intel: {
        title: "Premium Intel",
        desc: "Disk: NVMe SSD",
      },
      amd: {
        title: "Premium AMD",
        desc: "Disk: NVMe SSD",
      },
    },
    "General Purpose": {
      regular: {
        title: "Regular Intel",
        desc: "Disk type: SSD / Network: Up to 2 Gbps",
      },
      intel: {
        title: "Premium Intel",
        desc: "Disk: NVMe SSD / Network: Up to 10 Gbps",
      },
    },
    "CPU-Optimized": {
      regular: {
        title: "Regular Intel",
        desc: "Disk type: SSD / Network: Up to 2 Gbps",
      },
      intel: {
        title: "Premium Intel",
        desc: "Disk: NVMe SSD / Network: Up to 10 Gbps",
      },
    },
    "Memory-Optimized": {
      regular: {
        title: "Regular Intel",
        desc: "Disk: NVMe SSD / Network: Up to 2 Gbps",
      },
      intel: {
        title: "Premium Intel",
        desc: "Disk: NVMe SSD / Network: Up to 10 Gbps",
      },
    },
    "Storage-Optimized": {
      regular: {
        title: "Regular Intel",
        desc: "Disk: NVMe SSD / Network: Up to 2 Gbps",
      },
      intel: {
        title: "Premium Intel",
        desc: "Disk: NVMe SSD / Network: Up to 10 Gbps",
      },
    },
  };
  const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;
    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "max-w-full w-full inline-flex m-0 bg-content1 hover:bg-content2 items-center ",
            "flex-row cursor-pointer rounded-lg gap-4 p-4 border-2 ",
            "data-[selected=true]:border-primary"
          ),
        }}
      >
        {children}
      </Radio>
    );
  };
  if (typeCPU === "" || listDataOption.length === 0) {
    return <div>Loading...</div>; // Hoặc bất kỳ thông báo tải nào bạn muốn
  }
  return (
    <div className="my-4">
      <h1 className="font-bold mb-2">CPU Options</h1>
      <RadioGroup
        classNames={{
          wrapper: `grid grid-cols-1 ${
            keyData === "Basic" ? " md:grid-cols-3" : " md:grid-cols-2"
          }`,
        }}
        value={typeCPU}
        onValueChange={(value) => {
          setTypeCPU(value);
          setListDataOption(dataOfCPUByKey[value]);
        }}
      >
        {Object.keys(dataOfCPUByKey).map((item: any) => {
          return (
            <div key={item}>
              <CustomRadio
                description={CPUOption[keyData][item].desc}
                value={item} // regular, intel, amd  || intel regular
              >
                {CPUOption[keyData][item]?.title}
              </CustomRadio>
            </div>
          );
        })}
      </RadioGroup>
      <CardCPUOptions dataCPUOptions={listDataOption} />
    </div>
  );
}

export default CPUOptionsDigitalOcean;
