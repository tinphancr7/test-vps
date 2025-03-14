import digitalOceanApi from "@/apis/digital-ocean.api";
import showToast from "@/utils/toast";
import { Button, Divider } from "@heroui/react";
import { useState } from "react";
import { IoWarning } from "react-icons/io5";
function PowerDigitalOcean({ info, setRender }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOn, setIsLoadingOn] = useState(false);
    const [isLoadingRef, setIsLoadingRef] = useState(false);

    const isDisable =
        info?.status === "terminated" ||
        info?.status === "off" ||
        info?.status === "in-progress";
    const isDisablePowerOn =
        info?.status === "active" ||
        info?.status === "in-progress" ||
        info?.status === "terminated";

    const handlePowerOffVPSDigitalOcean = async () => {
        setIsLoading(true);
        const resultZ = await digitalOceanApi.createActionBuCloudDigitalOcean({
            key: "shutdown",
            item: info,
        });
        setIsLoading(false);

        if (!resultZ?.status) {
            showToast("Lỗi khi tắt VPS", "error");
            return;
        }
        showToast("Đang tắt  VPS", "info");
        setRender((prev: any) => !prev);
    };

    const handlePowerOnVPSDigitalOcean = async () => {
        setIsLoadingOn(true);

        const resultZ = await digitalOceanApi.createActionBuCloudDigitalOcean({
            key: "power_on",
            item: info,
        });
        setIsLoadingOn(false);

        if (!resultZ?.status) {
            showToast("Lỗi khi bật VPS", "error");
            return;
        }
        showToast("Đang bật  VPS", "info");
        setRender((prev: any) => !prev);
    };

    const handlePowerCyleVPSDigitalOcean = async () => {
        setIsLoadingRef(true);

        const resultZ = await digitalOceanApi.createActionBuCloudDigitalOcean({
            key: "power_cycle",
            item: info,
        });
        setIsLoadingRef(false);

        if (!resultZ?.status) {
            showToast("Lỗi khi khởi động lại VPS", "error");
            return;
        }
        showToast("Đang khởi động lại  VPS", "info");
        setRender((prev: any) => !prev);
    };
    return (
        <div className="p-4">
            <div className="my-4">
                <p className="text-2xl my-4">Tắt VPS</p>
                <div>
                    <p>
                        Khi tắt VPS, Dữ liệu, Địa chỉ IP , Ổ cứng, CPU và RAM
                        của VPS được giữ lại.
                    </p>
                    <div className="flex gap-2">
                        <IoWarning className="my-auto " color="red" size={25} />
                        <p>
                            Cảnh báo: Bạn vẫn sẽ bị tính phí cho VPS đã tắt. Để
                            kết thúc việc tính phí, hãy hủy VPS.
                        </p>
                    </div>
                </div>
                <Button
                    className="bg-primary font-bold mt-4"
                    isDisabled={isDisable}
                    onPress={() => handlePowerOffVPSDigitalOcean()}
                    isLoading={isLoading}
                >
                    Tắt VPS
                </Button>
            </div>

            <div className="my-4">
                <p className="text-2xl my-4">Bật VPS</p>
                <Button
                    className="bg-primary font-bold mt-4"
                    isDisabled={isDisablePowerOn}
                    onPress={() => handlePowerOnVPSDigitalOcean()}
                    isLoading={isLoadingOn}
                >
                    Bật VPS
                </Button>
            </div>
            <Divider />
            <div className="my-4">
                <p className="text-2xl my-4">Khởi động lại VPS</p>
                <div>
                    <p>
                        Bạn chỉ nên chọn tùy chọn này khi bạn không thể khởi
                        động lại VPS từ dòng lệnh.
                    </p>
                </div>
                <Button
                    className="bg-primary font-bold mt-4"
                    isDisabled={isDisable}
                    onPress={() => handlePowerCyleVPSDigitalOcean()}
                    isLoading={isLoadingRef}
                >
                    Khởi động lại VPS
                </Button>
            </div>
        </div>
    );
}
export default PowerDigitalOcean;
