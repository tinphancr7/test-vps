import Container from "@/components/container";
import { useAppSelector } from "@/stores";
import { Snippet } from "@heroui/react";
import { useMemo } from "react";

function BasicInformationSecurityGroup() {
    const { instance } = useAppSelector(
        (state) => state.alibabaEcs
    );

    const ecsInfo = useMemo(() => {
        return [
            { 
                key: "SecurityGroupIds",
                label: "Security Group ID", 
                value: instance?.['vps_id']?.SecurityGroup?.SecurityGroupId
            },
            { 
                key: "SecurityGroupName",
                label: "Security Group Name", 
                value: instance?.['vps_id']?.SecurityGroup?.SecurityGroupName
            },
            { 
                key: "VpcId",
                label: "VPC", 
                value: instance?.['vps_id']?.VpcAttributes?.VpcId
            },
        ]
    }, [instance]);

    const renderValueInfo = (key: string, value: any) => {
        switch (key) {
            case "SecurityGroupIds":
            case "VpcId":
                return (
                    <div className="flex items-center gap-0">
                        <Snippet
                            size="sm" 
                            hideSymbol={true}
                            classNames={{
                                base: 'bg-transparent',
                                pre: 'text-base'
                            }}
                        >
                            {value}
                        </Snippet>
                    </div>
                )
            
            default:
                return (
                    <span className="text-base">{value}</span>
                )
        }
    };

    return (
        <Container className="p-4 grid grid-cols-3 gap-3">
            <p className="font-medium col-span-3">Basic Information</p>

            {ecsInfo?.map((it: any, index: number) => (
                <div key={index} className="col-span-1">
                    <p className="text-base tracking-wide font-semibold">{it?.label}</p>

                    {renderValueInfo(it?.key, it?.value)}
                </div>
            ))}
        </Container>
    )
}

export default BasicInformationSecurityGroup;