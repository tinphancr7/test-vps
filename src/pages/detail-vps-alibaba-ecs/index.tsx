import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { useAppDispatch } from "@/stores";
import { asyncThunkGetAlibabaEcsInstanceByVpsId, asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId } from "@/stores/async-thunks/alibaba-ecs-thunk";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "./components/header";
import TabsList from "./components/tabs-list";

function DetailVpsAlibabaEcs() {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const { pathname } = useLocation();

    useEffect(() => {
        const split = pathname?.split('/');

        if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
            dispatch(asyncThunkGetBuCloudAlibabaEcsInstanceByVpsId(id as string));
        } else {
            dispatch(asyncThunkGetAlibabaEcsInstanceByVpsId(id as string));
        }

        return () => {};
    }, []);

    return (
        <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
            <div className="h-full overflow-auto scroll-main">
                <Header />
                
                <TabsList />
            </div>
        </Access>
    );
}

export default DetailVpsAlibabaEcs;
