import awsLightsailApis, { ICreateInstance } from "@/apis/aws-lightsail.api";
import { regions } from "@/mocks/aws";
import { BlueprintType, BundleType, RegionType } from "@/types/aws.type";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import SelectRegion from "./components/select-region";
import SelectImageAndBundle from "./components/select-image-and-bundle";
import {
    Button,
    ModalFooter,
    Select,
    Selection,
    SelectItem,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import DownloadKeyPair from "./components/download-key-pair";

function BuyAwsLightsail() {
    const dispatch = useAppDispatch();
    const { teams } = useAppSelector((state) => state.teams);
    const [region, setRegion] = useState<RegionType>(regions?.[0]);
    const [zone, setZone] = useState(regions?.[0]?.availabilityZones?.[0]);
    const [blueprint, setBluesprint] = useState<BlueprintType | any>();
    const [bundle, setBundle] = useState<BundleType | any>();
    const [teamId, setTeamId] = useState<Selection>(new Set([]));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const fetchTeams = await dispatch(
                asyncThunkGetAllYourTeam()
            ).unwrap();

            setTeamId(
                fetchTeams[0]?._id ? new Set([fetchTeams[0]?._id]) : new Set([])
            );
        })();

        return () => {};
    }, []);

    const handleOpenModalDownloadKeyPair = (instance: any) => {
        dispatch(
            setModal({
                isOpen: true,
                placement: "default",
                title: `Download KeyPair`,
                body: <DownloadKeyPair instance={instance} />,
                footer: (
                    <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
                        <Button
                            variant="solid"
                            color="danger"
                            className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
                            onPress={() => dispatch(resetModal())}
                        >
                            Đóng
                        </Button>
                    </ModalFooter>
                ),
            })
        );
    };

    const handleCreate = async () => {
        try {
            setIsLoading(true);

            const [team] = [...teamId];

            const data: ICreateInstance = {
                teamId: team,
                region: region?.name,
                availabilityZone: zone?.name,
                blueprintId: blueprint?.blueprintId,
                bundleId: bundle?.bundleId,
            };

            const { data: result } = await awsLightsailApis.createInstance(
                data
            );
            if (result?.instance) {
                handleOpenModalDownloadKeyPair(result?.instance);

                showToast("Tạo VPS - AWS Lightsail thành công!", "success");
            }
        } catch (error: any) {
            console.log(error);

            showToast(error?.response?.data?.message || "Tạo VPS - AWS Lightsail thất bại!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 p-4">
                <div className="col-span-1 md:col-span-3">
                    <SelectRegion
                        region={region}
                        setRegion={setRegion}
                        zone={zone}
                        setZone={setZone}
                    />

                    <SelectImageAndBundle
                        bundle={bundle}
                        setBundle={setBundle}
                        blueprint={blueprint}
                        setBluesprint={setBluesprint}
                    />

                    <div className="mt-4 border-b pb-4">
                        <div className="text-[18px] tracking-wider font-semibold mb-2">
                            4. Chọn Team
                        </div>

                        <Select
                            aria-label="operating-system"
                            fullWidth
                            variant="bordered"
                            radius="sm"
                            selectionMode="single"
                            disallowEmptySelection
                            labelPlacement="outside"
                            classNames={{
                                label: "text-base font-bold left-0 group-data-[filled=true]:text-primary",
                                value: "text-base tracking-wide font-medium",
                                trigger:
                                    "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                                popoverContent: "rounded",
                            }}
                            selectedKeys={teamId}
                            onSelectionChange={setTeamId}
                            isInvalid={!teamId ? true : false}
                        >
                            {teams?.map((item: any) => {
                                return (
                                    <SelectItem
                                        key={item._id}
                                        textValue={item.name}
                                    >
                                        {item.name}
                                    </SelectItem>
                                );
                            })}
                        </Select>
                        {/* <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {PAYMENT_METHODS.map(
                                ({ object_id, name, ...rest }) => (
                                    <li key={object_id} className="w-full">
                                        <PaymentCard
                                            payment={{
                                                object_id,
                                                ...rest,
                                                name: tCommon(name as any),
                                            }}
                                            isActive={
                                                object_id === paymentMethod
                                            }
                                            onSelect={(e) =>
                                                setPaymentMethod(e)
                                            }
                                        />
                                    </li>
                                )
                            )}
                        </ul> */}
                    </div>

                    <div className="mt-8 text-center sticky bottom-0 bg-white py-4">
                        <Button
                            color="primary"
                            className="rounded-md uppercase font-bold px-10"
                            onPress={handleCreate}
                            isLoading={isLoading}
                        >
                            Khởi tạo ngay
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BuyAwsLightsail;
