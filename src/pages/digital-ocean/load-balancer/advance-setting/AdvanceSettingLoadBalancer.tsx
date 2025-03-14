import { useEffect, useState } from "react";
import {
    Button,
    Input,
    Select,
    SelectItem,
    SelectSection,
    Tooltip,
    RadioGroup,
    Radio,
} from "@heroui/react";

import { Checkbox } from "@heroui/checkbox";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataLBAdvanceSettingDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-advance-setting.slice";
const protocolHealChecks = [
    { label: "TCP", key: "tcp", value: "TCP" },
    { label: "HTTP", key: "http", value: "HTTP" },
    { label: "HTTPS", key: "https", value: "HTTPS" },
];
function AdvanceSettingLoadBalancer() {
    const dispatch = useAppDispatch();
    const {
        stickySessions,
        protocol,
        healcheckPort,
        healcheckPath,
        redirect_http_to_https,
        enable_proxy_protocol,
        enable_backend_keepalive,
        http_idle_timeout_seconds,
        cookieName,
        ttl,
        healcheck_check_interval_seconds,
        healcheck_response_timeout_seconds,
        healcheck_healthy_threshold,
        healcheck_unhealthy_threshold,
    } = useAppSelector((state) => state.digitalOceanAdvanceSetting);
    const [editOpenAvdSetting, setEditOpenAvdSetting] = useState(false);
    // const [stickySessions, setStickySeesions] = useState("none");
    // const [protocol, setProtocol] = useState("http");

    const handleChangeProtocol = (e: any) => {
        dispatch(
            setDataLBAdvanceSettingDigitalOcean({ protocol: e.target.value })
        );
        if (e.target.value === "tcp") {
            dispatch(
                setDataLBAdvanceSettingDigitalOcean({
                    healcheckPath: "/",
                })
            );
        }
    };
    // const [isStickySession, setIsStickySession] = useState(false);

    // function checkString(input: any) {
    //   const regex = /[=\?@(),<>"':;{}\[\]\\\/\s]/;
    //   const regex1 = /[\,;\/*.~!@#$%^&*()_+>?:"}][{\\|./]/;
    //   return regex1.test(input);
    // }
    useEffect(() => {
        dispatch(
            setDataLBAdvanceSettingDigitalOcean({
                stickySessions: "none",
                protocol: "http",
                healcheckProtocol: "",
                healcheckPort: 80,
                healcheckPath: "/",
                healcheck_check_interval_seconds: 10,
                healcheck_response_timeout_seconds: 5,
                healcheck_healthy_threshold: 5,
                healcheck_unhealthy_threshold: 3,
                ttl: 300,
                redirect_http_to_https: false,
                enable_proxy_protocol: false,
                enable_backend_keepalive: true,
                http_idle_timeout_seconds: 60, // [30...600]
                cookieName: "",
                statusAdvanceSetting: false,
            })
        );
    }, []);
    return (
        <>
            <div className="mt-10 ">
                <h2 className="mt-4 text-[20px] font-bold">Cài đặt nâng cao</h2>
                <div className="content border p-8 mt-4">
                    <div className="title ">
                        <Button
                            size="md"
                            radius="none"
                            className="mt-4 font-bold text-[#676767] py-6 px-6"
                            onClick={() =>
                                setEditOpenAvdSetting((prev) => !prev)
                            }
                        >
                            {editOpenAvdSetting
                                ? "Ẩn"
                                : "Chỉnh sửa cài đặt nâng cao"}
                        </Button>
                    </div>
                    {editOpenAvdSetting ? (
                        <>
                            <div className="my-4">
                                <div className="stickySessions">
                                    <span className="flex gap-1">
                                        <span className="font-semibold text-[#444444] text-[20px]">
                                            Sticky sessions
                                        </span>
                                        <div>
                                            <Tooltip
                                                size="md"
                                                delay={100}
                                                closeDelay={100}
                                                color="foreground"
                                                content={
                                                    <div className="p-3 w-56 text-white flex justify-center text-center">
                                                        <p className="text-medium ">
                                                            Sticky sessions
                                                        </p>
                                                    </div>
                                                }
                                            >
                                                <span className="w-6 h-6 text-center bg-[#ececec] text-[#999] inline-block cursor-pointer rounded-sm hover:bg-primary-500 hover:text-white duration-200 transition-all ease-in-out text-[14px]">
                                                    ?
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </span>
                                    <RadioGroup
                                        orientation="horizontal"
                                        value={stickySessions}
                                        onValueChange={(e) => {
                                            dispatch(
                                                setDataLBAdvanceSettingDigitalOcean(
                                                    {
                                                        stickySessions: e,
                                                        cookieName:
                                                            "Cookie Name",
                                                        ttl: 300,
                                                    }
                                                )
                                            );
                                        }}
                                        className="mt-4"
                                    >
                                        <Radio value="none">None</Radio>
                                        <Radio value="cookies">Cookie</Radio>
                                    </RadioGroup>
                                    {stickySessions === "cookies" && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <Input
                                                type="text"
                                                radius="none"
                                                value={cookieName}
                                                variant="bordered"
                                                label="Cookie Name"
                                                // isInvalid={
                                                //   cookieName === ""
                                                //     ? true
                                                //     : checkString(cookieName)
                                                //     ? true
                                                //     : false
                                                // }
                                                // color={
                                                //   cookieName === ""
                                                //     ? "danger"
                                                //     : cookieName.length < 2
                                                //     ? "danger"
                                                //     : checkString(cookieName)
                                                //     ? "danger"
                                                //     : undefined
                                                // }
                                                // errorMessage={
                                                //   cookieName === ""
                                                //     ? t("advancedSetting.list2.notCookie")
                                                //     : cookieName.length < 2
                                                //     ? t("advancedSetting.list2.notCharacter")
                                                //     : checkString(cookieName)
                                                //     ? t("advancedSetting.list2.notSymbols")
                                                //     : ""
                                                // }
                                                onValueChange={(e) => {
                                                    dispatch(
                                                        setDataLBAdvanceSettingDigitalOcean(
                                                            {
                                                                cookieName: e,
                                                            }
                                                        )
                                                    );
                                                }}
                                            />
                                            <Input
                                                type="text"
                                                radius="none"
                                                value={String(ttl)}
                                                variant="bordered"
                                                label="TTL (in s)"
                                                // isInvalid={
                                                //   ttl === ""
                                                //     ? true
                                                //     : isNotNumberTtl
                                                //     ? true
                                                //     : Number(ttl) < 1
                                                //     ? true
                                                //     : Number(ttl) > 34650
                                                //     ? true
                                                //     : false
                                                // }
                                                // color={
                                                //   ttl === ""
                                                //     ? "danger"
                                                //     : isNotNumberTtl
                                                //     ? "danger"
                                                //     : Number(ttl) < 1
                                                //     ? "danger"
                                                //     : Number(ttl) > 34650
                                                //     ? "danger"
                                                //     : undefined
                                                // }
                                                // errorMessage={
                                                //   ttl === ""
                                                //     ? t("advancedSetting.list2.mustBe1")
                                                //     : isNotNumberTtl
                                                //     ? t("advancedSetting.list2.mustBe1")
                                                //     : Number(ttl) < 1
                                                //     ? t("advancedSetting.list2.mustBe1")
                                                //     : Number(ttl) > 34650
                                                //     ? t("advancedSetting.list2.mustBe34650")
                                                //     : ""
                                                // }
                                                onValueChange={(e) => {
                                                    dispatch(
                                                        setDataLBAdvanceSettingDigitalOcean(
                                                            {
                                                                ttl: e,
                                                            }
                                                        )
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="healthChecks mt-4  ">
                                    <p className="font-semibold text-[1.3rem] text-[#444] ">
                                        Health checks
                                    </p>
                                    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
                                        <Select
                                            // items={protocolHealChecks}
                                            label="Protocal"
                                            variant="bordered"
                                            radius="none"
                                            value={protocol}
                                            defaultSelectedKeys={[protocol]}
                                            disallowEmptySelection={true}
                                            onChange={handleChangeProtocol}
                                        >
                                            <SelectSection title="Protocol">
                                                {protocolHealChecks.map(
                                                    (item: any) => {
                                                        return (
                                                            <SelectItem
                                                                key={item.key}
                                                            >
                                                                {item.label}
                                                            </SelectItem>
                                                        );
                                                    }
                                                )}
                                            </SelectSection>
                                        </Select>

                                        <Input
                                            radius="none"
                                            value={String(healcheckPort)}
                                            type="text"
                                            label="Port"
                                            variant="bordered"
                                            // isInvalid={
                                            //   valuePort === "" ? true : isNotNumberPort ? true : false
                                            // }
                                            // color={
                                            //   valuePort === ""
                                            //     ? "danger"
                                            //     : isNotNumberPort
                                            //     ? "danger"
                                            //     : Number(valuePort) > 65535
                                            //     ? "danger"
                                            //     : undefined
                                            // }
                                            // errorMessage={
                                            //   valuePort === ""
                                            //     ? t("advancedSetting.list2.must1")
                                            //     : isNotNumberPort
                                            //     ? t("advancedSetting.list2.must1")
                                            //     : Number(valuePort) > 65535
                                            //     ? t("advancedSetting.list2.mustBe65535")
                                            //     : undefined
                                            // }
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            healcheckPort: e,
                                                        }
                                                    )
                                                );
                                            }}
                                        />
                                        {protocol === "https" ||
                                        protocol === "http" ? (
                                            <Input
                                                radius="none"
                                                value={healcheckPath}
                                                type="text"
                                                label="Ports"
                                                variant="bordered"
                                                // isInvalid={
                                                //   valuePath === ""
                                                //     ? true
                                                //     : checkString(valuePath)
                                                //     ? true
                                                //     : false
                                                // }
                                                // color={
                                                //   valuePath === ""
                                                //     ? "danger"
                                                //     : checkString(valuePath)
                                                //     ? "danger"
                                                //     : undefined
                                                // }
                                                // errorMessage={
                                                //   valuePath === ""
                                                //     ? t("advancedSetting.list2.interval")
                                                //     : checkString(valuePath)
                                                //     ? t("advancedSetting.list2.interval")
                                                //     : ""
                                                // }
                                                onValueChange={(e) => {
                                                    dispatch(
                                                        setDataLBAdvanceSettingDigitalOcean(
                                                            {
                                                                healcheckPath:
                                                                    e,
                                                            }
                                                        )
                                                    );
                                                }}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className="additionalSettings mt-4 ">
                                    <p className="font-bold">
                                        Additional settings
                                    </p>
                                    <div className="grid  lg:grid-cols-4 grid-cols-1  gap-4 mt-8 md:mt-4">
                                        <Input
                                            radius="none"
                                            type="text"
                                            value={String(
                                                healcheck_check_interval_seconds
                                            )}
                                            label="Check Interval (in s)"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            // isInvalid={
                                            //   valueInterval === ""
                                            //     ? true
                                            //     : isNotNumberInterval
                                            //     ? true
                                            //     : Number(valueInterval) < 3
                                            //     ? true
                                            //     : Number(valueInterval) > 300
                                            //     ? true
                                            //     : false
                                            // }
                                            // color={
                                            //   valueInterval === ""
                                            //     ? "danger"
                                            //     : isNotNumberInterval
                                            //     ? "danger"
                                            //     : Number(valueInterval) < 3
                                            //     ? "danger"
                                            //     : Number(valueInterval) > 300
                                            //     ? "danger"
                                            //     : undefined
                                            // }
                                            // errorMessage={
                                            //   valueInterval === ""
                                            //     ? t("advancedSetting.list2.mustBe3")
                                            //     : isNotNumberInterval
                                            //     ? t("advancedSetting.list2.mustBe3")
                                            //     : Number(valueInterval) < 3
                                            //     ? t("advancedSetting.list2.mustBe3")
                                            //     : Number(valueInterval) > 300
                                            //     ? t("advancedSetting.list2.mustBe300")
                                            //     : ""
                                            // }
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            healcheck_check_interval_seconds:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            radius="none"
                                            type="text"
                                            value={String(
                                                healcheck_response_timeout_seconds
                                            )}
                                            label="Response Timeout (in s)"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            // isInvalid={
                                            //   valueTimeOut === ""
                                            //     ? true
                                            //     : isNotNumberTimeOut
                                            //     ? true
                                            //     : Number(valueTimeOut) < 3
                                            //     ? true
                                            //     : Number(valueTimeOut) > 300
                                            //     ? true
                                            //     : false
                                            // }
                                            // color={
                                            //   valueTimeOut === ""
                                            //     ? "danger"
                                            //     : isNotNumberTimeOut
                                            //     ? "danger"
                                            //     : Number(valueTimeOut) < 3
                                            //     ? "danger"
                                            //     : Number(valueTimeOut) > 300
                                            //     ? "danger"
                                            //     : undefined
                                            // }
                                            // errorMessage={
                                            //   valueTimeOut === ""
                                            //     ? t("advancedSetting.list2.mustBe3")
                                            //     : isNotNumberTimeOut
                                            //     ? t("advancedSetting.list2.mustBe3")
                                            //     : Number(valueTimeOut) < 3
                                            //     ? t("advancedSetting.list2.mustBe3")
                                            //     : Number(valueTimeOut) > 300
                                            //     ? t("advancedSetting.list2.mustBe300")
                                            //     : ""
                                            // }
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            healcheck_response_timeout_seconds:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            radius="none"
                                            type="text"
                                            value={String(
                                                healcheck_unhealthy_threshold
                                            )}
                                            label="Unhealthy Threshold"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            // isInvalid={
                                            //   valueUnhealthy === ""
                                            //     ? true
                                            //     : isNotNumberUnhealthy
                                            //     ? true
                                            //     : Number(valueUnhealthy) < 2
                                            //     ? true
                                            //     : Number(valueUnhealthy) > 11
                                            //     ? true
                                            //     : false
                                            // }
                                            // color={
                                            //   valueUnhealthy === ""
                                            //     ? "danger"
                                            //     : isNotNumberUnhealthy
                                            //     ? "danger"
                                            //     : Number(valueUnhealthy) < 2
                                            //     ? "danger"
                                            //     : Number(valueUnhealthy) > 11
                                            //     ? "danger"
                                            //     : undefined
                                            // }
                                            // errorMessage={
                                            //   valueUnhealthy === ""
                                            //     ? t("advancedSetting.list2.mustBe2")
                                            //     : isNotNumberUnhealthy
                                            //     ? t("advancedSetting.list2.mustBe2")
                                            //     : Number(valueUnhealthy) < 2
                                            //     ? t("advancedSetting.list2.mustBe2")
                                            //     : Number(valueUnhealthy) > 11
                                            //     ? t("advancedSetting.list2.mustBe10")
                                            //     : ""
                                            // }
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            healcheck_unhealthy_threshold:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            radius="none"
                                            type="text"
                                            value={String(
                                                healcheck_healthy_threshold
                                            )}
                                            label="Healthy Threshold"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            // isInvalid={
                                            //   valueHealthy === ""
                                            //     ? true
                                            //     : isNotNumberHealthy
                                            //     ? true
                                            //     : Number(valueHealthy) < 2
                                            //     ? true
                                            //     : Number(valueHealthy) > 11
                                            //     ? true
                                            //     : false
                                            // }
                                            // color={
                                            //   valueHealthy === ""
                                            //     ? "danger"
                                            //     : isNotNumberHealthy
                                            //     ? "danger"
                                            //     : Number(valueHealthy) < 2
                                            //     ? "danger"
                                            //     : Number(valueHealthy) > 11
                                            //     ? "danger"
                                            //     : undefined
                                            // }
                                            // errorMessage={
                                            //   valueHealthy === ""
                                            //     ? t("advancedSetting.list2.mustBe2")
                                            //     : isNotNumberHealthy
                                            //     ? t("advancedSetting.list2.mustBe2")
                                            //     : Number(valueHealthy) < 2
                                            //     ? t("advancedSetting.list2.mustBe2")
                                            //     : Number(valueHealthy) > 11
                                            //     ? t("advancedSetting.list2.mustBe10")
                                            //     : undefined
                                            // }
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            healcheck_healthy_threshold:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                            className="max-w-xs"
                                        />
                                    </div>
                                </div>
                                <div className="ssl mt-4 ">
                                    <p className="font-bold">SSL</p>
                                    <div className=" gap-1 my-3 flex">
                                        <Checkbox
                                            radius="md"
                                            isSelected={redirect_http_to_https}
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            redirect_http_to_https:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                        >
                                            Chuyển tiếp từ HTTP đến HTTPS
                                        </Checkbox>
                                    </div>
                                </div>
                                <div className="proxyProtocol mt-4 ">
                                    <p className="font-bold">
                                        Enable Proxy Protocol
                                    </p>
                                    <div className=" gap-4 my-3 flex">
                                        <Checkbox
                                            isSelected={enable_proxy_protocol}
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            enable_proxy_protocol:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                            radius="md"
                                        >
                                            Enable Proxy Protocol
                                        </Checkbox>
                                    </div>
                                </div>
                                <div className="backendKeppalive mt-4 ">
                                    <p className="font-bold">
                                        Backend Keepalive
                                    </p>
                                    <div className=" gap-1 my-3 flex ">
                                        <Checkbox
                                            radius="md"
                                            isSelected={
                                                enable_backend_keepalive
                                            }
                                            onValueChange={(e) => {
                                                dispatch(
                                                    setDataLBAdvanceSettingDigitalOcean(
                                                        {
                                                            enable_backend_keepalive:
                                                                e,
                                                        }
                                                    )
                                                );
                                            }}
                                        >
                                            Enable Backend Keepalive
                                        </Checkbox>
                                    </div>
                                </div>
                                <div className=" mt-4 ">
                                    <span className="font-bold">
                                        HTTP Idle Timeout
                                    </span>
                                    <Input
                                        radius="none"
                                        type="text"
                                        value={String(
                                            http_idle_timeout_seconds
                                        )}
                                        // label={`${t("advancedSetting.list2.httpDesc")}`}
                                        // labelPlacement="outside"
                                        variant="bordered"
                                        // isInvalid={
                                        //   timeoutHTTP === ""
                                        //     ? true
                                        //     : isNotNumberIdle
                                        //     ? true
                                        //     : Number(timeoutHTTP) < 30
                                        //     ? true
                                        //     : Number(timeoutHTTP) > 600
                                        //     ? true
                                        //     : false
                                        // }
                                        // color={
                                        //   timeoutHTTP === ""
                                        //     ? "danger"
                                        //     : isNotNumberIdle
                                        //     ? "danger"
                                        //     : Number(timeoutHTTP) < 30
                                        //     ? "danger"
                                        //     : Number(timeoutHTTP) > 600
                                        //     ? "danger"
                                        //     : undefined
                                        // }
                                        // errorMessage={
                                        //   timeoutHTTP === ""
                                        //     ? t("advancedSetting.list2.mustBe30")
                                        //     : isNotNumberIdle
                                        //     ? t("advancedSetting.list2.mustBe30")
                                        //     : Number(timeoutHTTP) < 30
                                        //     ? t("advancedSetting.list2.mustBe30")
                                        //     : Number(timeoutHTTP) > 600
                                        //     ? t("advancedSetting.list2.mustBe600")
                                        //     : ""
                                        // }
                                        onValueChange={(e) => {
                                            dispatch(
                                                setDataLBAdvanceSettingDigitalOcean(
                                                    {
                                                        http_idle_timeout_seconds:
                                                            e,
                                                    }
                                                )
                                            );
                                        }}
                                        className="mt-4 lg:w-1/4"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="my-4">
                                <div className="content grid grid-cols-3 mb-8 ">
                                    <div className="stickSessions">
                                        <p className="font-bold">
                                            Sticky sessions
                                        </p>
                                        {stickySessions !== "none" ? (
                                            <>
                                                <p className="font-bold">
                                                    Cookie Name
                                                </p>
                                                <p>{cookieName}</p>
                                                <p className="font-bold">
                                                    Cookie TTL
                                                </p>
                                                <p>{ttl}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p>Off</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="healthChecks ">
                                        <p className="font-bold">
                                            Health checks
                                        </p>
                                        <p>
                                            {protocol}://0.0.0.0:{healcheckPort}
                                            {healcheckPath}
                                        </p>
                                    </div>
                                    <div className="healthChecks">
                                        <p className="font-bold">SSL</p>
                                        {redirect_http_to_https ? (
                                            <p> HTTP to HTTPS</p>
                                        ) : (
                                            <p> No redirect</p>
                                        )}
                                    </div>
                                </div>
                                <div className="content grid grid-cols-3 ">
                                    <div className="proxyProtocol">
                                        <p className="font-bold">
                                            Proxy Protocol
                                        </p>
                                        {enable_proxy_protocol ? (
                                            <p> Enabled</p>
                                        ) : (
                                            <p>Disabled</p>
                                        )}
                                    </div>
                                    <div className="backendKeepalive">
                                        <p className="font-bold">
                                            Backend Keepalive
                                        </p>
                                        {enable_backend_keepalive ? (
                                            <p> Enabled</p>
                                        ) : (
                                            <p>Disabled</p>
                                        )}
                                    </div>
                                    <div className="httpIdle">
                                        <p className="font-bold">
                                            HTTP Idle Timeout (seconds)
                                        </p>
                                        <p>{http_idle_timeout_seconds}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdvanceSettingLoadBalancer;
