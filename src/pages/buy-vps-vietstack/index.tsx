import { useAppDispatch, useAppSelector } from "@/stores";
import CardVpsVietStack from "./components/card-vps-vietstack";
import { useEffect } from "react";
import { asyncThunkGetAllProducts } from "@/stores/async-thunks/prod-vietstack-thunk";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function BuyVpsVietStack() {
    const dispatch = useAppDispatch();
    const { products } = useAppSelector(state => state.prodVietStack);

    useEffect(() => {
        dispatch(asyncThunkGetAllProducts());

        return () => {};
    }, []);

    return (
		<Access subject={SubjectEnum.VPS} action={ActionEnum.CREATE}>
            <div className="overflow-hidden shadow-container rounded-xl">
                <div className="h-full p-4 grid grid-cols-12 gap-x-4 gap-y-6 overflow-y-auto scroll-main">
                    {products?.map((prod, index: number) => (
                        <CardVpsVietStack key={index} vps={prod} />
                    ))}
                </div>
            </div>
        </Access>
    );
}

export default BuyVpsVietStack;