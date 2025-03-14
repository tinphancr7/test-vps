import { useCallback, useEffect, useState } from "react";
// import { Select } from "antd";
import {
    Select,
    SelectItem,
    Input,
    SelectSection,
    Button,
} from "@heroui/react";
import { FaArrowRight } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useAppDispatch } from "@/stores";
import { setDataLBForwardingRuleDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-forwarding-rule";
import ModalCreateCertificate from "./ModalCreateCertificate";
import digitalOceanApi from "@/apis/digital-ocean.api";
// list  các  load balancer
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

//list các droplet protocol -> lọc theo load balancer
// cho default http (load balancer) -> http , https (droplet)

function ForwardingRules() {
    // use cố định là mảng dropletProtocol
    const [valueOfSelectNewRule, setValueOfSelectNewRule] = useState("");
    const [valueChoice, setValueChoice] = useState("http");
    const dispatch = useAppDispatch();

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
    const [listCertificateSSL, setListCertificateSSL] = useState<any>([]);

    const getListCertificateSSL = async () => {
        const result = await digitalOceanApi.getListCertificateDigitalOcean();
        setListCertificateSSL(result?.data);
    };
    useEffect(() => {
        getListCertificateSSL();
    }, []);

    const [dataSource, setDataSource] = useState([
        {
            id: Date.now(),
            loadBalancerProtocol,
            dropletProtocol:
                handleChangeSelectProtocolOfLoadBalancer(valueChoice),
            portLoadBalancer: "80",
            portDroplet: "80",
            protocolLoadBalancer: valueChoice,
            protocolDroplet: "http",
            arrow: "",
            action: "",
        },
    ]);

    const dataRedux = dataSource.map((item: any) => {
        return {
            entry_protocol: item.protocolLoadBalancer,
            entry_port: Number(item.portLoadBalancer),
            target_protocol: item.protocolDroplet, // biến này chưa biết được
            target_port: Number(item.portDroplet),
            certificate_id: item?.certificate_id,
        };
    });

    useEffect(() => {
        dispatch(
            setDataLBForwardingRuleDigitalOcean({ forwarding_rules: dataRedux })
        );
    }, [dataSource]);

    const handleChangeProtocolLoadBalancer = useCallback(
        (dataSelect: any, dataOfRecord: any) => {
            const arrayNewAdd: any =
                handleChangeSelectProtocolOfLoadBalancer(dataSelect);
            const idFind = dataOfRecord?.id;
            const foundObject = dataSource.find((obj) => obj.id === idFind);
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
                setDataSource((prev) => {
                    const cloneData = prev;
                    const index = cloneData?.indexOf(foundObject);
                    const newData = cloneData?.map((it, idx) => {
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
            const zzzz = [...dataSource];
            zzzz.map((item: any) => {
                if (item?.id === record.id) {
                    if (event.target.name === "port_droplet") {
                        item.portDroplet = event.target.value;
                    } else {
                        item.portLoadBalancer = event.target.value;
                    }
                }
            });
            setDataSource(zzzz);
        },
        [dataSource]
    );

    const handleDeleteRule = useCallback(
        (data: any) => {
            const newArray = dataSource.filter((obj) => obj.id !== data.id);
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
        setValueChoice(e.target.value);
    };

    const handleChangeProtocolDroplet = (value: any, id: any) => {
        const foundObject = dataSource.find((obj) => obj.id === id);
        if (foundObject) {
            const updatedObject = {
                ...foundObject,
                protocolDroplet: value,
            };

            setDataSource((prev) => {
                const cloneData = prev;
                const index = cloneData?.indexOf(foundObject);
                const newData = cloneData?.map((it, idx) => {
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
        const foundObject = dataSource.find((obj) => obj.id === item.id);
        if (foundObject) {
            const updatedObject = {
                ...foundObject,
                certificate_id: value,
            };
            setDataSource((prev) => {
                const cloneData = prev;
                const index = cloneData?.indexOf(foundObject);
                const newData = cloneData?.map((it, idx) => {
                    if (index === idx) {
                        return updatedObject;
                    }
                    return it;
                });
                return newData;
            });
        }
    };
    const [openModal, setOpenModal] = useState(false);
    return (
        <>
            <div className="forwardingRules mt-4">
                <h2 className="text-[20px] font-bold">Quy tắc chuyển tiếp</h2>
                <p className="mt-4">
                    Đặt cách định tuyến lưu lượng truy cập từ Load Balancer đến
                    VPS của bạn. Ít nhất một quy tắc là bắt buộc.
                </p>
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
                            <p className="flex-1 font-bold text-center">VPS</p>
                        </div>
                        {dataSource?.map((item: any) => {
                            const check =
                                item?.protocolLoadBalancer === "https" ||
                                item?.protocolLoadBalancer === "http2" ||
                                item?.protocolLoadBalancer === "http3";
                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-12 gap-1 items-center px-4"
                                >
                                    <div
                                        className={`grid col-span-5 ${
                                            check
                                                ? "md:grid-cols-3 grid-cols-1"
                                                : "md:grid-cols-2 grid-cols-1"
                                        } gap-1`}
                                    >
                                        {/* Select */}
                                        <Select
                                            items={loadBalancerProtocol}
                                            label="Protocol"
                                            variant="bordered"
                                            radius="none"
                                            defaultSelectedKeys={[valueChoice]}
                                            onChange={(e) =>
                                                handleChangeProtocolLoadBalancer(
                                                    e.target.value,
                                                    item
                                                )
                                            }
                                            disallowEmptySelection={true}
                                        >
                                            {(val: any) => (
                                                <SelectItem key={val.valueName}>
                                                    {val.valueName.toUpperCase()}
                                                </SelectItem>
                                            )}
                                        </Select>
                                        {/* Input */}
                                        <Input
                                            radius="none"
                                            onChange={(e) =>
                                                handleChangeInputPortLoadBalancer(
                                                    item,
                                                    e
                                                )
                                            }
                                            variant="bordered"
                                            type="text"
                                            value={item?.portLoadBalancer}
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
                                                    onChange={(e) =>
                                                        handleChangeCertificate(
                                                            e.target.value,
                                                            item
                                                        )
                                                    }
                                                >
                                                    {listCertificateSSL?.map(
                                                        (val: any) => {
                                                            return (
                                                                <SelectItem
                                                                    key={
                                                                        val.id_certificate
                                                                    }
                                                                >
                                                                    {
                                                                        val.name_certificate
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

                                    <div className="grid col-span-5  md:grid-cols-2 grid-cols-1 gap-1">
                                        {/* Select */}
                                        <Select
                                            items={item.dropletProtocol}
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
                                            disallowEmptySelection={true}
                                        >
                                            {(val: any) => (
                                                <SelectItem key={val.valueName}>
                                                    {val.valueName.toUpperCase()}
                                                </SelectItem>
                                            )}
                                        </Select>

                                        {/* Input */}
                                        <Input
                                            radius="none"
                                            onChange={(e) =>
                                                handleChangeInputPortLoadBalancer(
                                                    item,
                                                    e
                                                )
                                            }
                                            variant="bordered"
                                            defaultValue={item?.portDroplet}
                                            type="text"
                                            label="Port"
                                            name="port_droplet"
                                        />
                                    </div>

                                    {/* Btn Delete */}
                                    <div className="col-span-1">
                                        <p
                                            className="text-red-600 hover:cursor-pointer flex items-center justify-center hover:text-red-600/50"
                                            onClick={() =>
                                                handleDeleteRule(item)
                                            }
                                        >
                                            <IoCloseCircleOutline className="text-2xl" />
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-12 gap-1 px-4 pb-4 mt-2">
                        <Select
                            label="Thêm"
                            variant="bordered"
                            radius="none"
                            className="md:col-span-3 col-span-12"
                            onChange={handleSelectNewRule}
                            selectedKeys={valueOfSelectNewRule}
                            disallowEmptySelection={true}
                        >
                            <SelectSection title="Thêm">
                                {loadBalancerProtocol.map((item: any) => {
                                    return (
                                        <SelectItem key={item.valueName}>
                                            {item.valueName.toUpperCase()}
                                        </SelectItem>
                                    );
                                })}
                            </SelectSection>
                        </Select>
                    </div>
                </div>
                <ModalCreateCertificate
                    isOpenModalConfirm={openModal}
                    onOpenModalConfirm={setOpenModal}
                />
            </div>
        </>
    );
}

export default ForwardingRules;
