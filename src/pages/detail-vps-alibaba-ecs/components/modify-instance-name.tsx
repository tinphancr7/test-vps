import alibabaEcsApis from "@/apis/alibaba-ecs.api";
import buCloudAlibabaEcsApis from "@/apis/bu-cloud-alibaba-ecs.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setInstanceName as setStateInstanceName } from "@/stores/slices/alibaba-ecs.slice";
import showToast from "@/utils/toast";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    Input,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { useLocation } from "react-router-dom";

function ModifyInstanceName() {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();

    const { instance } = useAppSelector(state => state.alibabaEcs);
    const [instanceName, setInstanceName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (instance) {
            setInstanceName(instance?.["vps_id"]?.InstanceName || "");
        }
    }, [instance]);

    const handleClosePopup = () => {
        setIsOpen(false);
        setInstanceName("");
    };

    const handleChangeInstanceName = async () => {
        if (instanceName?.length < 2 || instanceName?.length > 128) {
            setErrorMessage('Instance Name is invalid!');
        } else {
            setErrorMessage('');
        }

        try {
            setIsLoading(true);

            const split = pathname?.split('/');
            let api: any = alibabaEcsApis;

            if (split?.includes('bucloud') || split?.includes('bu-cloud')) {
                api = buCloudAlibabaEcsApis;
            }

            const { data } = await api.modifyInstanceAttribute({
                InstanceId: instance?.["vps_id"]?.InstanceId,
                InstanceName: instanceName.trim(),
            });

            if (data?.status === 1) {
                showToast('Modify Instance Name Success!', 'success');
                dispatch(
                    setStateInstanceName(instanceName.trim())
                );
            }
        } catch (error: any) {
            showToast(error?.response?.data?.message || "Modify Instance Name Error!", "error");
            console.log('error: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover
            showArrow
            backdrop="transparent"
            classNames={{
                content: [
                    "px-3 py-4 border border-default-200 shadow-container rounded-sm min-w-96",
                ],
            }}
            placement="right"
            isOpen={isOpen} 
            onOpenChange={(open) => setIsOpen(open)}
        >
            <PopoverTrigger>
                <Button
                    variant="solid"
                    radius="full"
                    className={`bg-transparent min-w-0 w-max p-[6px] h-max min-h-max data-[hover=true]:bg-gray-100 data-[hover=true]:text-primary-600`}
                >
                    <RiEdit2Fill className="min-w-max text-base w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="items-start">
                <h3 className="text-lg text-gray-500 font-semibold">
                    Modify Instance Name
                </h3>

                <Input
                    fullWidth
                    color="primary"
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{
                        base: "py-1",
                        inputWrapper:
                            "data-[hover=true]:border-primary border px-0 rounded-sm",
                        input: "text-left text-base px-2",
                        label: "text-dark",
                    }}
                    type={"text"}
                    value={String(instanceName)}
                    onValueChange={setInstanceName}
                    isInvalid={!!errorMessage}
                    errorMessage={errorMessage}
                />

                <p className="text-sm text-gray-500">
                    The instance name must be 2 to 128 characters in length
                </p>

                <div className="flex gap-2 mt-3">
                    <Button
                        color="primary"
                        className="bg-primary-500 rounded-sm text-lg min-h-max h-8 font-medium"
                        onPress={handleChangeInstanceName}
                        isDisabled={!!errorMessage}
                        isLoading={isLoading}
                    >
                        Confirm
                    </Button>

                    <Button
                        variant="bordered"
                        className="border rounded-sm bg-transparent text-lg min-h-max h-8 font-medium"
                        onPress={handleClosePopup}
                    >
                        Cancel
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ModifyInstanceName;