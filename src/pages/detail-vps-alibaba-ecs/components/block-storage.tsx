import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAlibabaEcsBlockStorageByInstanceId, asyncThunkGetBuCloudAlibabaEcsBlockStorageByInstanceId } from "@/stores/async-thunks/alibaba-ecs-thunk";
import { useEffect } from "react";
import BasicInformationBlockStorage from "./basic-information-block-storage";
import { useLocation } from "react-router-dom";

function BlockStorage() {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const { instance } = useAppSelector(state => state.alibabaEcs);

    useEffect(() => {
        const split = pathname?.split('/');

        if (instance) {
            if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                dispatch(
                    asyncThunkGetBuCloudAlibabaEcsBlockStorageByInstanceId(instance?.['vps_id']?.InstanceId )
                );
            } else {
                dispatch(
                    asyncThunkGetAlibabaEcsBlockStorageByInstanceId(instance?.['vps_id']?.InstanceId )
                );
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance, pathname]);

    return (
        <div className="flex flex-col gap-3">
            <BasicInformationBlockStorage />
        </div>
    )
}

export default BlockStorage;