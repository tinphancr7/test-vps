import { AWS_INSTANCE_STATUS } from "@/enums/aws.enum";
import { useAppSelector } from "@/stores";
import { BiLinkExternal } from "react-icons/bi";

function NetworkingTab() {
    const { instance } = useAppSelector((state) => state.awsLightsail);

    return (
        <div>
            <div className="text-2xl">IPv4 networking</div>
            <div>
                The public IP address of your instance is accessible to the
                internet. The private IP address is accessible only to other
                resources in your Lightsail account.
            </div>

            <div className="mt-4 flex w-full items-center gap-4">
                <div className="w-full lg:w-[60%]">
                    <div className="text-gray-400">PUBLIC IPV4</div>
                    <div className="mt-2 rounded-[12px] border p-4">
                        <div className="text-[20px] font-semibold">
                            {instance?.['vps_id']?.publicIpAddress ||
                            instance?.['vps_id']?.state?.name ===
                                AWS_INSTANCE_STATUS.RUNNING ? (
                                <>{instance?.['vps_id']?.publicIpAddress}</>
                            ) : (
                                "-"
                            )}
                        </div>
                        <div className="text-gray-500 tracking-wide">Attach static IP</div>
                    </div>
                </div>

                <div className="w-full lg:w-[40%]">
                    <div className="text-gray-400">PUBLIC IPV4</div>
                    <div className="mt-2 rounded-[12px] border p-4">
                        <div className="text-[20px] font-semibold">{instance?.['vps_id']?.privateIpAddress}</div>

                        <a
                            href={
                                "https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-public-ip-and-private-ip-addresses-in-amazon-lightsail"
                            }
                            target="_blank"
                            className="flex items-center gap-2 text-primary-500 tracking-wide"
                        >
                            What is this for?
                            <BiLinkExternal className="text-primary-500" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-2xl">IPv4 Firewall</div>
            <div>
                Create rules to open ports to the internet, or to a specific
                IPv4 address or range.
            </div>
            <div className="mt-4 flex items-center gap-4 border-t py-1 font-semibold text-gray-500">
                <div className="w-[20%] px-2">Application</div>
                <div className="w-[20%] px-2">Protocol</div>
                <div className="w-[20%] px-2">Port or range / Code</div>
                <div className="w-[40%] px-2">Restricted</div>
            </div>
            {instance?.['vps_id']?.networking?.ports?.map((item: any) => (
                <div
                    className="flex items-center gap-4 border-b border-t border-dashed py-1 font-semibold text-gray-500"
                    key={item?.fromPort}
                >
                    <div className="w-[20%] px-2">
                        {item?.fromPort === 22
                            ? "SSH"
                            : item?.fromPort === 80
                            ? "HTTP"
                            : item?.fromPort}
                    </div>
                    <div className="w-[20%] px-2">
                        {item?.protocol?.toUpperCase()}
                    </div>
                    <div className="w-[20%] px-2">{item?.fromPort}</div>
                    <div className="w-[40%] px-2">
                        {item?.accessFrom?.includes("Anywhere")
                            ? "Any IPv4 address"
                            : ""}
                    </div>
                </div>
            ))}

            <div className="mt-4 text-2xl">IPv6 Firewall</div>
            <div>
                Create rules to open ports to the internet, or to a specific
                IPv6 address or range.
            </div>
            <div className="mt-4 flex items-center gap-4 border-t py-1 font-semibold text-gray-500">
                <div className="w-[20%] px-2">Application</div>
                <div className="w-[20%] px-2">Protocol</div>
                <div className="w-[20%] px-2">Port or range / Code</div>
                <div className="w-[40%] px-2">Restricted</div>
            </div>
            {instance?.['vps_id']?.networking?.ports?.map((item: any) => (
                <div
                    className="flex items-center gap-4 border-b border-t border-dashed py-1 font-semibold text-gray-500"
                    key={item?.fromPort}
                >
                    <div className="w-[20%] px-2">
                        {item?.fromPort === 22
                            ? "SSH"
                            : item?.fromPort === 80
                            ? "HTTP"
                            : item?.fromPort}
                    </div>
                    <div className="w-[20%] px-2">
                        {item?.protocol?.toUpperCase()}
                    </div>
                    <div className="w-[20%] px-2">{item?.fromPort}</div>
                    <div className="w-[40%] px-2">
                        {item?.accessFrom?.includes("Anywhere")
                            ? "Any IPv6 address"
                            : ""}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default NetworkingTab;
