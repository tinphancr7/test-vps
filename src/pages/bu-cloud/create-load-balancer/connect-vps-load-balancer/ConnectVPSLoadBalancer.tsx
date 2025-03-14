import digitalOceanRegionApi from "@/apis/digital-ocean-region.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataLBConnectVPSDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-connect-vps.slice";
import { Select, SelectItem, Chip } from "@heroui/react";
import { useEffect } from "react";

function ConnectVPSLoadBalancer() {
    const dispatch = useAppDispatch();
    const { listVPSInRegion, selectedVPSInRegion } = useAppSelector(
        (state) => state.digitalOceanLBConnectVPS
    );
    const { selectedRegion }: any = useAppSelector(
        (state) => state.digitalOceanRegion
    );
    const handleSelectionChange = (value: any) => {
        dispatch(
            setDataLBConnectVPSDigitalOcean({ selectedVPSInRegion: value })
        );
    };
    const getFirst = async () => {
        const response = await digitalOceanRegionApi.getAllVPSInRegionBuCloud(
          selectedRegion?.slug
        );
        dispatch(
            setDataLBConnectVPSDigitalOcean({
                listVPSInRegion: response?.data?.data,
            })
        );
    };
    
    useEffect(() => {
        getFirst();
    }, [selectedRegion]);

    useEffect(() => {
        dispatch(
            setDataLBConnectVPSDigitalOcean({
                listVPSInRegion: [],
                selectedVPSInRegion: [],
            })
        );
    }, []);
    return (
        <div className="connectBalancerDroplet mt-5">
            <h2 className="text-[20px] font-bold">Kết nối các VPS</h2>
            <p>
                Hãy chọn ra những VPS bạn muốn kết hợp và sử dụng Load Balancer
            </p>
            <p>Bạn có thể tạo Load Balancer trước và sau đó sẽ thêm các VPS </p>
            <p>Lưu ý: Chỉ chọn những VPS có cùng chung 1 Khu vực</p>

            <Select
                aria-label="drop-let"
                items={listVPSInRegion}
                radius="none"
                variant="bordered"
                isMultiline={true}
                selectionMode="multiple"
                placeholder="Chọn VPS"
                labelPlacement="outside"
                className="mt-4"
                classNames={{
                    trigger: "min-h-12 py-2",
                    mainWrapper: "border-black",
                }}
                onSelectionChange={handleSelectionChange}
                selectedKeys={selectedVPSInRegion}
                renderValue={(items) => {
                    return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item: any) => (
                                <Chip radius="none" key={item?.data?.idDOVPS}>
                                    {item?.data?.nameVPS} -{item?.data?.team} -
                                    {item?.data?.created_by}
                                </Chip>
                            ))}
                        </div>
                    );
                }}
            >
                {(listVPS: any) => (
                    <SelectItem
                        key={listVPS?.idDOVPS}
                        textValue={listVPS?.nameVPS}
                    >
                        <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {listVPS?.nameVPS} - {listVPS?.team} -
                                    {listVPS?.created_by}
                                </span>
                            </div>
                        </div>
                    </SelectItem>
                )}
            </Select>
        </div>
    );
}

export default ConnectVPSLoadBalancer;
