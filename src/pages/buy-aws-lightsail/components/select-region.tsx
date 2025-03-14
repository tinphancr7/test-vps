import { regions } from "@/mocks/aws";
import { RegionType, ZoneType } from "@/types/aws.type";

type Props = {
    region: RegionType;
    setRegion: (e: RegionType) => void;
    zone: ZoneType;
    setZone: (e: ZoneType) => void;
};

function SelectRegion({ region, setRegion, setZone, zone }: Props) {
    return (
        <div className="border-b pb-4">
            <div className="text-[18px] font-semibold tracking-wider">
                1. Chọn vị trí VPS của bạn
            </div>
            <div className="text-[16px] font-normal mt-1"> - Chọn khu vực</div>

            <div className="mt-2 grid grid-cols-3 gap-4 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
                {regions?.map((item: RegionType) => (
                    <div className="col col-span-1" key={item?.name}>
                        <button
                            className={`flex w-full border-slate-100 cursor-pointer items-center gap-2 rounded-[8px] border-[2px] p-2 text-left ${
                                region?.name === item?.name
                                    ? "!border-primary bg-primary-light"
                                    : "border-[transparent]"
                            }`}
                            onClick={() => {
                                setRegion(item);
                                setZone(item?.availabilityZones?.[0]);
                            }}
                        >
                            <img
                                src={`/imgs/aws/${item.icon}`}
                                className="w-[32px] lg:w-[48px]"
                                alt={region.displayName}
                            />
                            <div>
                                <div className="text-sm font-semibold">
                                    {item?.displayName}
                                </div>
                                <div className="text-xs">{item?.name}</div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <div className="text-[16px] font-normal mt-1">
                    {" "}
                    - Chọn 1 vùng khả dụng
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 gap-y-4 md:grid-cols-4 lg:grid-cols-5">
                    {region?.availabilityZones?.map((item) => (
                        <div className="col col-span-1" key={item?.name}>
                            <button
                                className={`flex w-full cursor-pointer items-center gap-2 rounded-[8px] border-[2px] p-2 text-left ${
                                    zone?.name === item?.name
                                        ? "border-primary bg-primary-light"
                                        : "border-[transparent]"
                                }`}
                                onClick={() => {
                                    setZone(item);
                                }}
                            >
                                <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-primary text-xl font-bold text-white md:h-[42px] md:w-[42px]">
                                    {item?.displayName?.split(" ")?.[1]}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">
                                        {item?.displayName}
                                    </div>
                                    <div className="text-xs">{item?.name}</div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SelectRegion;
