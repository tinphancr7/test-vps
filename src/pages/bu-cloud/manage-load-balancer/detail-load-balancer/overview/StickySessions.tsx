import { useAppDispatch, useAppSelector } from "@/stores";
import {
  setDataSettingLoadBalancer,
  updateSettingLoadBalancer,
} from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-setting-bu-cloud.slice";
import { Button, Input, Radio, RadioGroup, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import ButtonEdit from "./ButtonEdit";
import showToast from "@/utils/toast";

function StickySessions({ info, setRender }: any) {
  const [enableEdit, setEnableEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    detailSettingLoadBalancer,
    dataChangeSetting,
    result,
    hiddenButtonEditSetting,
  }: any = useAppSelector((state) => state.loadBalancerEditDigitalOceanBuCloud);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const { sticky_sessions } = detailSettingLoadBalancer || {};
    if (sticky_sessions) {
      const updatedStickySessions =
        sticky_sessions.type === "none"
          ? { type: sticky_sessions.type }
          : {
              type: sticky_sessions.type,
              cookie_ttl_seconds: sticky_sessions.cookie_ttl_seconds,
              cookie_name: sticky_sessions.cookie_name,
            };

      dispatch(
        setDataSettingLoadBalancer({
          dataChangeSetting: {
            ...dataChangeSetting,
            stickySessions: updatedStickySessions,
          },
        })
      );
    }
  }, [detailSettingLoadBalancer, enableEdit]);
  const handleChangeSettingLoadBalancer = async () => {
    if (
      info?.sticky_sessions?.type === dataChangeSetting?.stickySessions?.type &&
      info?.sticky_sessions?.cookie_name ===
        dataChangeSetting?.stickySessions?.cookie_name &&
      info?.sticky_sessions?.cookie_ttl_seconds ===
        dataChangeSetting?.stickySessions?.cookie_ttl_seconds
    ) {
      setEnableEdit(false);
      dispatch(
        setDataSettingLoadBalancer({
          hiddenButtonEditSetting: false,
        })
      );
      return;
    }
    setIsLoading(true);
    setEnableEdit(false);
    showToast("Đang cập nhật thay đổi", "info");

    await dispatch(
      updateSettingLoadBalancer({
        _id: info?._id,
        dataChangeSetting: {
          stickySessions: dataChangeSetting?.stickySessions,
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
    if (!result?.status && Object.keys(result).length > 0) {
      showToast(result?.data, "error");
      return;
    }
    setRender((prev: any) => !prev);
    showToast(result?.data, "success");
  }, [isLoading]);
  const isDisable = info?.status === "terminated";

  return (
    <>
      {!enableEdit ? (
        <div className=" grid grid-cols-4 my-4">
          <h3 className="col-span-1 text-base font-bold my-auto">
            Sticky sessions :
          </h3>
          <div className=" col-span-2 my-auto gap-4 ">
            {info?.sticky_sessions?.type === "none" ||
            !info?.sticky_sessions ? (
              "Tắt"
            ) : (
              <div className="flex gap-4">
                <span>
                  <p className="font-bold">Cookie Name</p>
                  <p>{info?.sticky_sessions?.cookie_name}</p>
                </span>
                <span>
                  <p className="font-bold">Cookie TTL</p>
                  <p>{info?.sticky_sessions?.cookie_ttl_seconds}</p>
                </span>
              </div>
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
                        <p className="text-medium ">Sticky sessions</p>
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
                value={dataChangeSetting?.stickySessions?.type}
                onValueChange={(e) => {
                  dispatch(
                    setDataSettingLoadBalancer({
                      dataChangeSetting: {
                        ...dataChangeSetting,
                        stickySessions: {
                          type: e,
                          cookie_name: "Cookie Name",
                          cookie_ttl_seconds: 300,
                        },
                      },
                    })
                  );
                }}
                className="mt-4"
              >
                <Radio value="none">None</Radio>
                <Radio value="cookies">Cookie</Radio>
              </RadioGroup>
              {dataChangeSetting?.stickySessions?.type === "cookies" && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    type="text"
                    radius="none"
                    value={dataChangeSetting?.stickySessions?.cookie_name}
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
                        setDataSettingLoadBalancer({
                          dataChangeSetting: {
                            ...dataChangeSetting,
                            stickySessions: {
                              ...dataChangeSetting.stickySessions,
                              cookie_name: e,
                            },
                          },
                        })
                      );
                    }}
                  />
                  <Input
                    type="text"
                    radius="none"
                    value={String(
                      dataChangeSetting?.stickySessions?.cookie_ttl_seconds
                    )}
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
                        setDataSettingLoadBalancer({
                          dataChangeSetting: {
                            ...dataChangeSetting,
                            stickySessions: {
                              ...dataChangeSetting.stickySessions,
                              cookie_ttl_seconds: e,
                            },
                          },
                        })
                      );
                    }}
                  />
                </div>
              )}
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
        </>
      )}
    </>
  );
}

export default StickySessions;
