import Container from "@/components/container";
import { useEffect } from "react";
import BillMethodSelect from "./components/bill-method-select";
import RegionSelect from "./components/region-select";
import ZoneSelect from "./components/zone-select";
import InstanceTypeSelect from "./components/instance-type-select";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
    asyncThunkGetImagesAlibabaEcs,
    asyncThunkGetInstanceTypesAlibabaEcs,
    asyncThunkGetRegionsAlibabaEcs,
    asyncThunkGetZonesByRegionIdAlibabaEcs,
} from "@/stores/async-thunks/alibaba-ecs-thunk";
import { setInstanceType, setZone } from "@/stores/slices/alibaba-ecs.slice";
import ImageSelect from "./components/image-select";
import DiskSelect from "./components/disk-select";
import BandwidthBillingMethodSelect from "./components/bandwidth-billing-method-select";
import LogonSelect from "./components/logon-select";
import Billing from "./components/billing";
import TeamSelect from "./components/team-select";

function BuyVpsAlibabaEcs() {
    const dispatch = useAppDispatch();
    const { region } = useAppSelector((state) => state.alibabaEcs);

    useEffect(() => {
        dispatch(asyncThunkGetRegionsAlibabaEcs());

        (async () => {
            const { zones } = await dispatch(
                asyncThunkGetZonesByRegionIdAlibabaEcs(region)
            ).unwrap();

            if (zones) {
                dispatch(setZone(zones[0]?.ZoneId));

                const { instanceTypes } = await dispatch(
                    asyncThunkGetInstanceTypesAlibabaEcs({
                        RegionId: region,
                        ZoneId: zones[0]?.ZoneId,
                        PageNumber: 1,
                    })
                ).unwrap();

                dispatch(setInstanceType(instanceTypes[0]?.InstanceTypeId));
                dispatch(
                    asyncThunkGetImagesAlibabaEcs({
                        RegionId: region,
                        InstanceType: instanceTypes[0]?.InstanceTypeId,
                    })
                );
            }
        })();
    }, []);

    return (
        <div className="grid grid-cols-12 gap-3 h-full overflow-hidden py-2">
            <div className="p-1 col-span-9 flex flex-col gap-8 scroll-main overflow-y-auto overflow-x-hidden pb-20">
                <Container className="flex flex-col gap-8">
                    <TeamSelect />

                    <BillMethodSelect />

                    <RegionSelect />

                    <ZoneSelect />
                </Container>

                <Container className="flex flex-col gap-8">
                    <InstanceTypeSelect />

                    <ImageSelect />
                </Container>

                <DiskSelect />

                <BandwidthBillingMethodSelect />

                <LogonSelect />
            </div>

            {/* <Container className="col-span-3 sticky top-0">
                <Billing />
            </Container> */}

            <div className="col-span-3 shadow-container rounded-md sticky top-0">
                <Billing />
            </div>
        </div>
    );
}

export default BuyVpsAlibabaEcs;
