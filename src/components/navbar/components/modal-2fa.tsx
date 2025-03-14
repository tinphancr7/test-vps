import { useAppSelector } from "@/stores";
import { Tab, Tabs } from "@heroui/react";
import { useMemo, useState } from "react";
import Register2FA from "./register-2fa";
import Show2FAQR from "./show-2fa-qr";

function Modal2FA() {
    const { user } = useAppSelector(state => state.auth);
    const [tab, setTab] = useState<any>("register-2fa");

    const tabs = useMemo(() => {
        const defaultsTabs = [
            {
                key: "register-2fa",
                label: "Quét mã QR",
            },
        ];

        if (user?.secret_2fa) {
            defaultsTabs.push({
                key: "qr-2fa",
                label: "Bật/tắt xác thực 2 bước"
            });

            setTab('qr-2fa');
        }

        return defaultsTabs;
    }, [user]);

    const renderTab: any = {
        "register-2fa": <Register2FA setTab={setTab} />,
        "qr-2fa": <Show2FAQR />,
    };

    return (  
       <div>
            <Tabs
                aria-label="Options"
                color="primary"
                variant="underlined"
                classNames={{
                    base: "mb-5",
                    tabList: "gap-6 w-full relative rounded-none p-0 overflow-x-auto pb-0",
                    cursor: "w-full bg-primary",
                    tab: "px-2 h-10",
                    tabContent:
                        "group-data-[selected=true]:font-bold uppercase font-medium text-sm tracking-wider",
                }}
                selectedKey={tab}
                onSelectionChange={setTab}
            >
                {tabs?.map((item: any) => (
                    <Tab
                        key={item?.key}
                        title={
                            <div className="flex items-center space-x-2">
                                <span>{item?.label}</span>
                            </div>
                        }
                    />
                ))}
            </Tabs>

            {renderTab[tab]}
       </div>
    );
}

export default Modal2FA;