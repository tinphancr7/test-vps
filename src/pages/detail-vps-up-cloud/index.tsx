/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import SelectServerAction from "./components/select-server-action";
import { useEffect, useState } from "react";
import cloudApi from "@/apis/upcloud-client.api";
import { Snippet, Spinner } from "@heroui/react";

export default function DetailVPSUpCloud() {
    const { id } = useParams();
    const [server, setServer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    useEffect(() => {
        const fetchServerDetails = async () => {
            try {
                const response: any = await cloudApi.getDetailServer(id || "");
                setServer(response.data.server.server);
            } catch (error) {
                console.log("errror: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchServerDetails();
        }
    }, [id]);
    if (loading || !server) {
        return (
            <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3">
                <Spinner />
                <p className="text-base font-semibold">Đang tải...</p>
            </div>
        );
    }
    const handleUpdateServer = (updatedServer: any) => {
        setServer(updatedServer);
    };
    const publicIPv4 =
        server?.ip_addresses?.ip_address?.find(
            (ip: any) => ip.family === "IPv4" && ip.access === "public"
        )?.address ?? "-";
    const osType = server.storage_devices?.storage_device[0]?.labels?.find(
        (label: any) => label.key === "_os_price_suffix"
    )?.value;

    return (
        <div className="flex h-full w-full flex-col gap-4 px-4">
            <div className="flex w-full flex-col rounded border-[1px] border-gray-300">
                <div className="flex w-full items-center justify-between gap-3 border-b-[1px] border-b-gray-300 px-4 py-5">
                    <div className="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            style={{ color: "#FF9900" }}
                        >
                            <path
                                fill="#FF9900"
                                fillRule="nonzero"
                                d="M32 21H6V6h28v11h-2V8H8v11h26v15H6V23h2v9h24zm-20-6v-2h8v2zm10 0v-2h2v2zm4 0v-2h2v2zM12 27v-2h2v2zm4 0v-2h12v2z"
                            ></path>
                        </svg>
                        <p className="text-[22px] min-w-[10vw]">Tổng quan</p>
                    </div>

                    <SelectServerAction
                        id={id}
                        onUpdateServer={handleUpdateServer}
                        status={server?.state}
                    />
                </div>
                <div className="flex w-full items-center justify-between border-b-[1px] border-gray-300 px-4">
                    <div className="flex w-full flex-col gap-3 border-r-[1px] border-r-gray-300 px-2 py-3">
                        <p className="text-sm font-medium text-gray-400">
                            Tên máy chủ
                        </p>
                        <p className="text-lg font-bold">{server?.title}</p>
                    </div>
                    <div className="flex w-full flex-col gap-3 px-4 py-3">
                        <p className="text-sm font-medium text-gray-400">
                            Tên miền
                        </p>
                        <p className="text-lg font-bold">{server?.hostname}</p>
                    </div>
                </div>
                <div className="flex w-full flex-col items-center justify-between gap-6 px-4 py-4">
                    <div className="flex w-full flex-row items-center gap-10">
                        <div className="custom-paragraph flex items-center justify-center gap-2">
                            <p className="text-sm font-bold">IP:</p>
                            <Snippet symbol="">{publicIPv4}</Snippet>
                        </div>
                        <div className="custom-paragraph flex items-center justify-center gap-2">
                            <p className="text-sm font-bold">UUID:</p>
                            <Snippet symbol="">{server?.uuid}</Snippet>
                        </div>
                    </div>
                    {osType?.toLowerCase() === "windows" && (
                        <div className="flex w-full flex-row items-center gap-10">
                            <div className="custom-paragraph flex items-center justify-center gap-2">
                                <p className="text-sm font-bold">
                                    TÊN ĐĂNG NHẬP:
                                </p>
                                <Snippet symbol="">{server?.username}</Snippet>
                            </div>
                            <div className="custom-paragraph flex items-center justify-center gap-2">
                                <p className="text-sm font-bold">MẬT KHẨU:</p>
                                <div className="flex items-center gap-2">
                                    <Snippet
                                        onClick={() => togglePasswordVisibility}
                                        onCopy={() =>
                                            navigator.clipboard.writeText(
                                                server.password
                                            )
                                        }
                                        symbol=""
                                    >
                                        {isPasswordVisible
                                            ? server?.password
                                            : "*".repeat(
                                                  server?.password?.length || 8
                                              )}
                                    </Snippet>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex w-full flex-row items-center gap-10">
                        <div className="custom-paragraph flex items-center justify-center gap-2">
                            <p className="text-sm font-bold">Hệ điều hành:</p>
                            <p className="!mb-0 text-sm font-medium">
                                {
                                    server?.storage_devices?.storage_device[0]?.labels?.find(
                                        (label: any) =>
                                            label?.key === "_os_brand_name"
                                    )?.value
                                }{" "}
                                {
                                    server?.storage_devices?.storage_device[0]?.labels?.find(
                                        (label: any) =>
                                            label?.key === "_os_brand_version"
                                    )?.value
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col rounded border-[1px] border-gray-300">
                <div className="flex w-full items-center justify-between gap-3 border-b-[1px] border-b-gray-300 px-4 py-5">
                    <div className="flex items-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            style={{ color: "#FF9900" }}
                        >
                            <g fill="#FF9900" fillRule="nonzero">
                                <path d="M20.5 36C11.395 36 4 28.844 4 20S11.395 4 20.5 4 37 11.156 37 20s-7.395 16-16.5 16m0-2C28.515 34 35 27.725 35 20S28.515 6 20.5 6 6 12.275 6 20s6.485 14 14.5 14"></path>
                                <path d="M32 20h-2a9 9 0 0 0-9-9 9 9 0 0 0-9 9h-2c0-6.075 4.925-11 11-11s11 4.925 11 11M18.131 25.778c-1.089-1.089-1.053-2.866.052-3.97s2.881-1.14 3.97-.052c1.089 1.089 1.053 2.866-.052 3.97s-2.881 1.14-3.97.052m1.414-1.414c.295.294.806.284 1.142-.052s.346-.847.052-1.142c-.295-.294-.806-.284-1.142.052s-.346.847-.052 1.142"></path>
                                <path d="m21.967 23.281-1.414-1.414 4.503-4.503 1.414 1.414z"></path>
                            </g>
                        </svg>
                        <p className="text-[22px]">Cấu hình</p>
                    </div>
                </div>
                <div className="flex w-full items-center justify-start gap-3">
                    <div className="flex w-full flex-col gap-7 border-r-[1px] border-r-gray-300 px-5 py-3">
                        <p className="text-center text-sm font-bold uppercase text-gray-400">
                            CPU
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-lg font-bold">
                                {server?.core_number}
                            </p>
                            <p className="text-lg font-normal">cores</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-7 border-r-[1px] border-r-gray-300 px-5 py-3">
                        <p className="text-center text-sm font-bold uppercase text-gray-400">
                            Bộ nhớ
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-lg font-bold">
                                {server?.memory_amount / 1024}
                            </p>
                            <p className="text-lg font-normal">GB</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-7 border-r-[1px] border-r-gray-300 px-5 py-3">
                        <p className="text-center text-sm font-bold uppercase text-gray-400">
                            Ổ cứng
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-lg font-bold">
                                {server?.storage_devices?.storage_device[0]
                                    ?.storage_size ?? "-"}
                            </p>
                            <p className="text-lg font-normal">GB</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-7 px-5 py-3">
                        <p className="text-center text-sm font-bold uppercase text-gray-400">
                            Khu vực
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-lg font-bold">{server?.zone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
