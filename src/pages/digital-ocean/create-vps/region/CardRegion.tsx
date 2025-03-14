// import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataRegion } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-region.slice";
import { Image } from "@heroui/react";

function CardRegion({ region }: any) {
  const dispatch = useAppDispatch();
  const { selectedRegion } = useAppSelector(
    (state) => state.digitalOceanRegion
  );
  return (
    <>
      <div
        className={`p-4 flex items-center justify-between border hover:cursor-pointer hover:bg-[#F1F1F1]
      ${selectedRegion._id === region._id ? "border-primary bg-[#F1F1F1]" : ""} 
        `}
        onClick={() =>
          dispatch(
            setDataRegion({
              selectedRegion: region,
              selectedDataCenter: new Set([region.data_centers[0]]),
            })
          )
        }
      >
        <Image
          alt=""
          src={`/digital-ocean-region/${region.flag}.png`}
          width={50}
          height={50}
        />
        {region.label}
      </div>
    </>
  );
}

export default CardRegion;
