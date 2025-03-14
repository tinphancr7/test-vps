import { useAppDispatch, useAppSelector } from "@/stores";
import {
  setDataSettingLoadBalancer,
  updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting-bu-cloud.slice";
import {
    Button,
    Input,
    Select,
    SelectItem,
    SelectSection,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import ButtonEdit from "./ButtonEdit";
import showToast from "@/utils/toast";
import { cloneDeep } from "lodash";
import { FaArrowRight } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import digitalOceanApi from "@/apis/digital-ocean.api";
import ModalCreateCertificate from "@/pages/digital-ocean/load-balancer/forwarding-rule/ModalCreateCertificate";
const loadBalancerProtocol = [
    {
        valueName: "http",
        valuePort: "80",
    },
    {
        valueName: "tcp",
        valuePort: "80",
    },
    {
        valueName: "udp",
        valuePort: "80",
    },
    {
        valueName: "https",
        valuePort: "443",
    },
    {
        valueName: "http2",
        valuePort: "443",
    },
    {
        valueName: "http3",
        valuePort: "443",
    },
];
function ForwardingRules({ info, setRender }: any) {
    const [enableEdit, setEnableEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
      detailSettingLoadBalancer,
      dataChangeSetting,
      result,
      hiddenButtonEditSetting,
    }: any = useAppSelector(
      (state) => state.loadBalancerEditDigitalOceanBuCloud
    );
    const handleChangeSelectProtocolOfLoadBalancer = (data: any) => {
        if (data === "udp") {
            return [
                {
                    valueName: "udp",
                    valuePort: "80",
                },
            ];
        }
        if (data === "tcp") {
            return [
                {
                    valueName: "tcp",
                    valuePort: "80",
                },
            ];
        }
        if (data === "http" || data === "https") {
            return [
                {
                    valueName: "http",
                    valuePort: "80",
                },
                {
                    valueName: "https",
                    valuePort: "80",
                },
            ];
        }
        if (data === "http2") {
            return [
                {
                    valueName: "http",
                    valuePort: "80",
                },
                {
                    valueName: "http2",
                    valuePort: "80",
                },
            ];
        }
        if (data === "http3") {
            return [
                {
                    valueName: "http",
                    valuePort: "80",
                },
                {
                    valueName: "https",
                    valuePort: "80",
                },
                {
                    valueName: "http2",
                    valuePort: "80",
                },
            ];
        }
    };
    const [dataSource, setDataSource] = useState<any>([]);

    const dispatch = useAppDispatch();

    const handleChangeProtocolLoadBalancer = useCallback(
        (dataSelect: any, dataOfRecord: any) => {
            const arrayNewAdd: any =
                handleChangeSelectProtocolOfLoadBalancer(dataSelect);
            const idFind = dataOfRecord?.id;
            const foundObject = dataSource.find(
                (obj: any) => obj.id === idFind
            );
            if (foundObject) {
                const setPortLB =
                    dataSelect === "https" ||
                    dataSelect === "http2" ||
                    dataSelect === "http3"
                        ? "443"
                        : "80";
                const updatedObject = {
                    ...foundObject,
                    protocolLoadBalancer: dataSelect,
                    portLoadBalancer: setPortLB,
                    dropletProtocol: arrayNewAdd,
                    protocolDroplet: arrayNewAdd[0].valueName,
                };
                setDataSource((prev: any) => {
                    const cloneData = prev;
                    const index = cloneData?.indexOf(foundObject);
                    const newData = cloneData?.map((it: any, idx: any) => {
                        if (index === idx) {
                            return updatedObject;
                        }
                        return it;
                    });
                    return newData;
                });
            }
        },
        [dataSource]
    );

    const handleChangeInputPortLoadBalancer = useCallback(
        (record: any, event: any) => {
            const cloneDataSource = cloneDeep(dataSource);
            const udData = cloneDataSource?.map((item: any) => {
                if (item?.id === record.id) {
                    return { ...item, portLoadBalancer: event.target.value };
                }
                return item;
            });
            setDataSource(udData);
        },
        [dataSource]
    );

    const handleChangeInputPortDroplet = useCallback(
        (record: any, event: any) => {
            const cloneDataSource = cloneDeep(dataSource);
            const udData = cloneDataSource?.map((item: any) => {
                if (item?.id === record.id) {
                    return { ...item, portDroplet: event.target.value };
                }
                return item;
            });
            setDataSource(udData);
        },
        [dataSource]
    );

    const handleDeleteRule = useCallback(
        (data: any) => {
            const newArray = dataSource.filter(
                (obj: any) => obj.id !== data.id
            );
            setDataSource(newArray);
        },
        [dataSource]
    );
    //change protocol load balancer -> change select protocol droplet balancer

    const handleSelectNewRule = (e: any) => {
        const identify = Date.now();
        const dataForDroplet: any = handleChangeSelectProtocolOfLoadBalancer(
            e.target.value
        );
        const setPortLB =
            e.target.value === "https" ||
            e.target.value === "htpp2" ||
            e.target.value === "http3"
                ? "443"
                : "80";
        setDataSource((pre: any) => {
            return [
                ...pre,
                {
                    id: identify,
                    loadBalancerProtocol,
                    dropletProtocol: dataForDroplet,
                    portLoadBalancer: setPortLB,
                    portDroplet: "80",
                    arrow: "",
                    action: "",
                    protocolLoadBalancer: e.target.value,
                    protocolDroplet: dataForDroplet[0].valueName,
                },
            ];
        });
        setValueOfSelectNewRule("");
        // setValueChoice(e.target.value);
    };

    const handleChangeProtocolDroplet = (value: any, id: any) => {
        const foundObject = dataSource.find((obj: any) => obj.id === id);
        if (foundObject) {
            const updatedObject = {
                ...foundObject,
                protocolDroplet: value,
            };

            setDataSource((prev: any) => {
                const cloneData = prev;
                const index = cloneData?.indexOf(foundObject);
                const newData = cloneData?.map((it: any, idx: any) => {
                    if (index === idx) {
                        return updatedObject;
                    }
                    return it;
                });
                return newData;
            });
        }
    };

    const handleChangeCertificate = (value: any, item: any) => {
        const foundObject = dataSource.find((obj: any) => obj.id === item.id);
        if (foundObject) {
            const updatedObject = {
                ...foundObject,
                certificate_id: value,
            };
            setDataSource((prev: any) => {
                const cloneData = prev;
                const index = cloneData?.indexOf(foundObject);
                const newData = cloneData?.map((it: any, idx: any) => {
                    if (index === idx) {
                        return updatedObject;
                    }
                    return it;
                });
                return newData;
            });
        }
    };

    const dataRedux = dataSource?.map((item: any) => {
        return {
            entry_protocol: item.protocolLoadBalancer,
            entry_port: Number(item.portLoadBalancer),
            target_protocol: item.protocolDroplet,
            target_port: Number(item.portDroplet),
            certificate_id: item?.certificate_id,
        };
    });
    const handleChangeSettingLoadBalancer = async () => {
        setIsLoading(true);
        setEnableEdit(false);
        showToast("Đang cập nhật thay đổi", "info");
        await dispatch(
            updateSettingLoadBalancer({
                _id: info?._id,
                dataChangeSetting: {
                    forwarding_rules: dataChangeSetting?.forwarding_rules,
                },
                region: info?.slugDataCenter,
                forwarding_rules: info?.forwarding_rules,
                name: info?.name_load_balancer,
            })
        );
        dispatch(
            setDataSettingLoadBalancer({
                hiddenButtonEditSetting: false,
            })
        );
        setIsLoading(false);
    };
    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    forwarding_rules: dataRedux,
                },
                isConfirmUpdateNode: dataRedux?.length > 0 ? true : false,
            })
        );
    }, [dataSource]);

    useEffect(() => {
        dispatch(
            setDataSettingLoadBalancer({
                dataChangeSetting: {
                    ...dataChangeSetting,
                    forwarding_rules:
                        detailSettingLoadBalancer?.forwarding_rules,
                },
            })
        );
        setDataSource(
            detailSettingLoadBalancer?.forwarding_rules?.map(
                (item: any, index: any) => {
                    return {
                        id: Date.now() + index,
                        loadBalancerProtocol,
                        dropletProtocol:
                            handleChangeSelectProtocolOfLoadBalancer(
                                item?.entry_protocol
                            ),
                        portLoadBalancer: item?.entry_port,
                        portDroplet: item?.target_port,
                        protocolLoadBalancer: item?.entry_protocol,
                        protocolDroplet: item?.target_protocol,
                        certificate_id: item?.certificate_id,
                        arrow: "",
                        action: "",
                    };
                }
            )
        );
    }, [detailSettingLoadBalancer, enableEdit]);

    useEffect(() => {
        if (!result?.status && Object.keys(result).length > 0) {
            showToast(result?.data, "error");
            return;
        }
        setRender((prev: any) => !prev);
        showToast(result?.data, "success");
    }, [isLoading]);
    const isDisable = info?.status === "terminated";
    const [valueOfSelectNewRule, setValueOfSelectNewRule] = useState("");
    const [listCertificateSSL, setListCertificateSSL] = useState<any>([]);

    const getListCertificateSSL = async () => {
        const result = await digitalOceanApi.getListCertificateDigitalOcean();
        setListCertificateSSL(result?.data);
    };
    useEffect(() => {
        getListCertificateSSL();
    }, []);
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            {!enableEdit ? (
                <div className=" grid grid-cols-4 my-4">
                    <h3 className="col-span-1 text-base font-bold my-auto">
                        Quy tắc chuyển tiếp:
                    </h3>
                    <div className=" col-span-2 my-auto gap-4 ">
                        {info?.forwarding_rules?.map(
                            (itemRule: any, index: any) => {
                                return (
                                    <p className="flex gap-2" key={index}>
                                        {itemRule?.entry_protocol.toUpperCase()}{" "}
                                        on port {itemRule?.entry_port}
                                        <FaLongArrowAltRight className="my-auto" />
                                        {itemRule?.target_protocol.toUpperCase()}{" "}
                                        on port {itemRule?.target_port}
                                    </p>
                                );
                            }
                        )}
                    </div>
                    <div className="col-span-1 my-auto flex justify-center">
                        {!hiddenButtonEditSetting ? (
                            <Button
                                onPress={() => {
                                    setEnableEdit(true);
                                    dispatch(
                                        setDataSettingLoadBalancer({
                                            hiddenButtonEditSetting: true,
                                            result: {},
                                        })
                                    );
                                }}
                                isDisabled={isDisable}
                                className="bg-primary"
                            >
                                Thay đổi
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="my-4">
                        <Button
                            variant="bordered"
                            className="bg-primary text-white font-bold mt-4"
                            radius="none"
                            onPress={() => setOpenModal(true)}
                        >
                            {" "}
                            Thêm SSL
                        </Button>
                        <div className="tableForwarding border mt-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between bg-[#FAFAFA] p-2">
                                    <p className="flex-1 font-bold text-center">
                                        Load Balancer
                                    </p>
                                    <p className="flex-1 font-bold text-center">
                                        VPS
                                    </p>
                                </div>
                                {dataSource?.length > 0 &&
                                    dataSource?.map((item: any) => {
                                        const check =
                                            item?.protocolLoadBalancer ===
                                                "https" ||
                                            item?.protocolLoadBalancer ===
                                                "http2" ||
                                            item?.protocolLoadBalancer ===
                                                "http3";
                                        return (
                                            <div
                                                key={item.id}
                                                className="grid grid-cols-12 gap-1 items-center px-4"
                                            >
                                                <div
                                                    className={`lg:grid lg:col-span-5 col-span-6 ${
                                                        check
                                                            ? "grid-cols-3"
                                                            : "grid-cols-2"
                                                    } gap-1`}
                                                >
                                                    {/* Select */}
                                                    <Select
                                                        items={
                                                            loadBalancerProtocol
                                                        }
                                                        label="Protocol"
                                                        variant="bordered"
                                                        radius="none"
                                                        defaultSelectedKeys={[
                                                            item?.protocolLoadBalancer,
                                                        ]}
                                                        onChange={(e) =>
                                                            handleChangeProtocolLoadBalancer(
                                                                e.target.value,
                                                                item
                                                            )
                                                        }
                                                        disallowEmptySelection={
                                                            true
                                                        }
                                                    >
                                                        {(val: any) => (
                                                            <SelectItem
                                                                key={
                                                                    val.valueName
                                                                }
                                                            >
                                                                {val.valueName.toUpperCase()}
                                                            </SelectItem>
                                                        )}
                                                    </Select>
                                                    {/* Input */}
                                                    <Input
                                                        radius="none"
                                                        onChange={(e: any) =>
                                                            handleChangeInputPortLoadBalancer(
                                                                item,
                                                                e
                                                            )
                                                        }
                                                        variant="bordered"
                                                        type="text"
                                                        value={
                                                            item?.portLoadBalancer
                                                        }
                                                        label="Port"
                                                    />
                                                    {check ? (
                                                        <div className="">
                                                            <Select
                                                                label={`Certificate`}
                                                                variant="bordered"
                                                                radius="none"
                                                                disallowEmptySelection={
                                                                    true
                                                                }
                                                                defaultSelectedKeys={[
                                                                    item?.certificate_id,
                                                                ]}
                                                                onChange={(e) =>
                                                                    handleChangeCertificate(
                                                                        e.target
                                                                            .value,
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                {listCertificateSSL?.map(
                                                                    (
                                                                        val: any
                                                                    ) => {
                                                                        return (
                                                                            <SelectItem
                                                                                key={
                                                                                    val.id_certificate
                                                                                }
                                                                            >
                                                                                {
                                                                                    val?.name_certificate
                                                                                }
                                                                            </SelectItem>
                                                                        );
                                                                    }
                                                                )}
                                                            </Select>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>

                                                {/* Icon */}
                                                <div className="col-span-1 flex justify-center items-center">
                                                    <FaArrowRight />
                                                </div>

                                                <div className="lg:grid lg:col-span-5 col-span-5  grid-cols-2 gap-1">
                                                    {/* Select */}
                                                    <Select
                                                        items={
                                                            item.dropletProtocol
                                                        }
                                                        label="Protocol"
                                                        variant="bordered"
                                                        radius="none"
                                                        selectedKeys={[
                                                            item?.protocolDroplet,
                                                        ]}
                                                        onChange={(e) =>
                                                            handleChangeProtocolDroplet(
                                                                e.target.value,
                                                                item.id
                                                            )
                                                        }
                                                        disallowEmptySelection={
                                                            true
                                                        }
                                                    >
                                                        {(val: any) => (
                                                            <SelectItem
                                                                key={
                                                                    val.valueName
                                                                }
                                                            >
                                                                {val.valueName.toUpperCase()}
                                                            </SelectItem>
                                                        )}
                                                    </Select>

                                                    {/* Input */}
                                                    <Input
                                                        radius="none"
                                                        onChange={(e) =>
                                                            handleChangeInputPortDroplet(
                                                                item,
                                                                e
                                                            )
                                                        }
                                                        variant="bordered"
                                                        defaultValue={
                                                            item?.portDroplet
                                                        }
                                                        type="text"
                                                        label="Port"
                                                    />
                                                </div>

                                                {/* Btn Delete */}
                                                <div className="lg:col-span-1 flex justify-center items-center">
                                                    <p
                                                        className="text-red-600 hover:cursor-pointer flex items-center justify-center hover:text-red-600/50"
                                                        onClick={() =>
                                                            handleDeleteRule(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <IoCloseCircleOutline className="text-2xl" />
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className="grid lg:grid-cols-12 gap-1 px-4 pb-4 mt-2">
                                <Select
                                    label="New Rule"
                                    variant="bordered"
                                    radius="none"
                                    className="col-span-3"
                                    onChange={handleSelectNewRule}
                                    selectedKeys={valueOfSelectNewRule}
                                    disallowEmptySelection={true}
                                >
                                    <SelectSection title="New Rule">
                                        {loadBalancerProtocol.map(
                                            (item: any) => {
                                                return (
                                                    <SelectItem
                                                        key={item.valueName}
                                                    >
                                                        {item.valueName.toUpperCase()}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </SelectSection>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-4 my-4">
                            <ButtonEdit
                                handleChangeSettingLoadBalancer={
                                    handleChangeSettingLoadBalancer
                                }
                                setEnableEdit={setEnableEdit}
                            />
                        </div>
                    </div>
                    <ModalCreateCertificate
                        isOpenModalConfirm={openModal}
                        onOpenModalConfirm={setOpenModal}
                    />
                </>
            )}
        </>
    );
}

export default ForwardingRules;
