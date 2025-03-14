import { useAppDispatch, useAppSelector } from "@/stores";
import CardVpsVng from "./components/card-vps-vng";
import { useEffect } from "react";
import { asyncThunkGetAllProducts } from "@/stores/async-thunks/prod-vietserver-thunk";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function BuyVpsVng() {
    const dispatch = useAppDispatch();
    const { products } = useAppSelector(state => state.prodVServer);

    useEffect(() => {
        dispatch(asyncThunkGetAllProducts());

        return () => {};
    }, []);

    return (
		<Access subject={SubjectEnum.VPS} action={ActionEnum.CREATE}>
            <div className="overflow-hidden shadow-container rounded-xl">
                <div className="h-full p-4 grid grid-cols-12 gap-x-4 gap-y-6 overflow-y-auto scroll-main">
                    {products?.map((prod, index: number) => (
                        <CardVpsVng key={index} vps={prod} />
                    ))}
                </div>
            </div>
        </Access>
    );
}

export default BuyVpsVng;