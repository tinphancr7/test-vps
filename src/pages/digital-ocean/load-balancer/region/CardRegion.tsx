// import Image from "next/image";

import digitalOceanRegionApi from "@/apis/digital-ocean-region.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataRegion } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-region.slice";
import { setDataLBConnectVPSDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-connect-vps.slice";
import { Image, Tooltip, User } from "@heroui/react";
import { useEffect, useState } from "react";

function CardRegion({ region }: any) {
    const [listVPSInRegion, setListVPSInRegion] = useState([]);
    const dispatch = useAppDispatch();
    const { selectedRegion }: any = useAppSelector(
        (state) => state.digitalOceanRegion
    );
    const getAllVPSInRegion = async () => {
        const response = await digitalOceanRegionApi.getAllVPSInRegion(
            region?.slug
        );
        setListVPSInRegion(response?.data?.data);
    };

    const onClickRegion = async () => {
        dispatch(
            setDataRegion({
                selectedRegion: region,
                selectedDataCenter: new Set([region.data_centers[0]]),
            })
        );

        const response = await digitalOceanRegionApi.getAllVPSInRegion(
            region?.slug
        );
        const listConnect = response?.data?.data;
        dispatch(
            setDataLBConnectVPSDigitalOcean({
                listVPSInRegion: listConnect,
                selectedVPSInRegion: [],
            })
        );
        // setListVPSInRegion(selectedRegion?.slug);
    };
    useEffect(() => {
        getAllVPSInRegion();

        //get first list connect
       
    }, []);
    return (
        <>
            <div>
                <div
                    className={`p-4 flex items-center justify-between border hover:cursor-pointer hover:bg-[#F1F1F1]
      ${selectedRegion._id === region._id ? "border-primary bg-[#F1F1F1]" : ""} 
        `}
                    onClick={() => onClickRegion()}
                >
                    <Image
                        alt=""
                        src={`/digital-ocean-region/${region.flag}.png`}
                        width={50}
                        height={50}
                    />
                    {region.label}
                </div>
                <div className="text-center mt-2">
                    {listVPSInRegion.length > 0 && (
                        <div>
                            <Tooltip
                                radius="none"
                                showArrow={true}
                                size="lg"
                                classNames={{
                                    content: "p-0"
                                }}
                                content={
                                    <div className="min-w-80">
                                        <h2 className="shadow-container text-lg font-medium text-primary tracking-wider p-2">
                                            Các VPS có trong khu vực:
                                        </h2>

                                        <div className="p-2 max-h-96 overflow-auto scroll-main flex flex-col items-start gap-3">
                                            {listVPSInRegion.map((val: any) => {
                                                return (
                                                    <User
                                                        key={val?.idDOVPS}
                                                        name={val?.nameVPS}
                                                        description={
                                                            <>
                                                                <div className="flex gap-1 items-center">
                                                                    <span>Tạo bởi:</span>
                                                                    <span className="text-sm font-medium text-gray-500">
                                                                        {val?.created_by}
                                                                    </span>
                                                                </div>
                                                                <p>{val?.team}</p>
                                                            </>
                                                        }
                                                        avatarProps={{
                                                            className: "bg-gray-200/30",
                                                            src: "/public/icons/database-icon.png",
                                                            showFallback: false
                                                        }}
                                                        classNames={{
                                                            name: "text-lg font-semibold",
                                                        }}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                            >
                                <p className="text-center  hover:cursor-pointer text-blue-600 underline mt-2">
                                    Số lượng VPS có trong khu vực:{" "}
                                    {listVPSInRegion.length}
                                </p>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CardRegion;
