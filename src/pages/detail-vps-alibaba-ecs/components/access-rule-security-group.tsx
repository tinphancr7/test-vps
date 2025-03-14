import Container from "@/components/container";
import { FaCheckCircle } from "react-icons/fa";

export enum NicTypePermissionsSecurityGroup {
    INTERNET = "internet",
    INTRANET = "intranet",
}

enum PolicyPermissionsSecurityGroup {
    ACCEPT = "accept",
    DROP = "drop",
}

enum IpProtocolPermissionsSecurityGroup {
    TCP = "TCP",
    UDP = "UDP",
    ICMP = "ICMP",
    ICMPv6 = "ICMPv6",
    GRE = "GRE",
    ALL = "ALL",
}

const DEFAULT_PERMISSIONS = [
    // ICMP
    {
        Policy: PolicyPermissionsSecurityGroup.ACCEPT,
        Priority: "1",
        IpProtocol: `All ${IpProtocolPermissionsSecurityGroup.ICMP} (IPv4)`,
        PortRange: "-1/-1",
        SourceCidrIp: "0.0.0.0/0",
        NicType: NicTypePermissionsSecurityGroup.INTERNET,
    },
    // RDP
    {
        Policy: PolicyPermissionsSecurityGroup.ACCEPT,
        Priority: "1",
        IpProtocol: `Custom ${IpProtocolPermissionsSecurityGroup.TCP}`,
        PortRange: "3389/3389",
        SourceCidrIp: "0.0.0.0/0",
        NicType: NicTypePermissionsSecurityGroup.INTERNET,
    },
    // HTTPS
    {
        Policy: PolicyPermissionsSecurityGroup.ACCEPT,
        Priority: "1",
        IpProtocol: `Custom ${IpProtocolPermissionsSecurityGroup.TCP}`,
        PortRange: "443/443",
        SourceCidrIp: "0.0.0.0/0",
        NicType: NicTypePermissionsSecurityGroup.INTERNET,
    },
    // SSH
    {
        Policy: PolicyPermissionsSecurityGroup.ACCEPT,
        Priority: "1",
        IpProtocol: `Custom ${IpProtocolPermissionsSecurityGroup.TCP}`,
        PortRange: "22/22",
        SourceCidrIp: "0.0.0.0/0",
        NicType: NicTypePermissionsSecurityGroup.INTERNET,
    },
    // HTTP
    {
        Policy: PolicyPermissionsSecurityGroup.ACCEPT,
        Priority: "1",
        IpProtocol: `Custom ${IpProtocolPermissionsSecurityGroup.TCP}`,
        PortRange: "80/80",
        SourceCidrIp: "0.0.0.0/0",
        NicType: NicTypePermissionsSecurityGroup.INTERNET,
    },
];

function AccessRuleSecurityGroup() {
    const columns = [
        { _id: "Policy", name: "Action", classes: "col-span-1" },
        { _id: "Priority", name: "Priority", classes: "col-span-1" },
        { _id: "IpProtocol", name: "Protocol Type", classes: "col-span-2" },
        { _id: "PortRange", name: "Port Range", classes: "col-span-3" },
        { _id: "SourceCidrIp", name: "Authorization Object", classes: "col-span-3" },
    ];

    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];
        
        switch (columnKey) {
            case "Policy":
                return (
                    <div className="flex items-center justify-start gap-2">
                        <FaCheckCircle className="text-success text-base" />

                        <span className="text-base">Allow</span>
                    </div>
                );

            case "PortRange":
                return (
                    <div className="flex flex-col gap-1">  
                        {item['IpProtocol'] === IpProtocolPermissionsSecurityGroup.ICMP && (
                            <span>Source -1/-1</span>
                        )}
                        <span>Destination: {cellValue}</span>
                    </div>
                )

            case "SourceCidrIp":
                return "Source All IPv4 Addresses (0.0.0.0/0)"

            default:
                return (
                    <span>{cellValue}</span>
                )
        }
    };

    return (
        <Container className="p-4">
            <div className="grid grid-cols-10 items-center p-2 bg-primary rounded-tl-md rounded-tr-md">
                {columns?.map((col) => (
                    <div
                        key={col?._id}
                        className={`text-left font-medium text-white text-base px-3 bg-primary ${col?.classes}`}
                    >
                        <h3>{col?.name}</h3>
                    </div>
                ))}
            </div>

            <Container className="rounded-tl-none rounded-tr-none divide-y-1 !p-0">
                {DEFAULT_PERMISSIONS?.map(
                    (ps, index: number) => (
                        <div key={index} className="grid grid-cols-10 items-center">
                            {columns?.map((col) => (
                                <div
                                    key={col?._id}
                                    className={`text-left text-base p-4 ${col?.classes}`}
                                >
                                    {renderCell(ps, col?._id)}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </Container>
        </Container>
    );
}

export default AccessRuleSecurityGroup;
