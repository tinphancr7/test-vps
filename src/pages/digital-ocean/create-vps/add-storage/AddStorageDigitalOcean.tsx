import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataAddStorageDigitalOcean } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-storage.slice";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { clsx } from "@heroui/shared-utils";
import { useEffect, useRef, useState } from "react";
const listAddStorageDigitalOcean = [
    {
        price_monthly: 10,
        price_hourly: 0.015,
        size_gigabytes: 100,
    },
    {
        price_monthly: 25,
        price_hourly: 0.037,
        size_gigabytes: 250,
    },
    {
        price_monthly: 50,
        price_hourly: 0.074,
        size_gigabytes: 500,
    },
    {
        price_monthly: 100,
        price_hourly: 0.149,
        size_gigabytes: 1000,
    },
    {
        price_monthly: 200,
        price_hourly: 0.298,
        size_gigabytes: 2000,
    },
];
const STORAGE_CONFIGURATION = [
    {
        key: "automatically",
        title: "Automatically Format & Mount",
        desc: "We will choose the appropriate default configurations. These settings can be changed later via ssh.",
        filesystem: [
            {
                key: "ext4",
                title: "Ext4",
            },
            {
                key: "xfs",
                title: "XFS",
            },
        ],
    },
];
function AddStorageDigitalOcean() {
    const {
        addStorage,
        statusCustomStorage,
        isSelectedCustomStorage,
        isSelectAddStorage,
    } = useAppSelector((state) => state.digitalOceanAddStorage);
    const dispatch = useAppDispatch();

    // const [storageConfigurationSelected, setStorageConfigurationSelected] =
    //   useState<any>(STORAGE_CONFIGURATION[0]);

    const [filesystem, setFilesystemSelected] = useState<string>(
        addStorage.filesystem_type
    );
    const [selectedCustomVolume, setSelectedCustomVolume] = useState<any>(null);

    const refInputCustomVolume = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Tự chọn filesystem đầu tiên
        setFilesystemSelected(STORAGE_CONFIGURATION[0].filesystem[0]?.key);
    }, [isSelectAddStorage]);

    // useEffect(() => {
    //   if (!selectedCustomVolume) {
    //     setDataCreateDoplet({ statusCustomVolume: 'IDLE' })
    //   }
    // }, [selectedCustomVolume])

    //show
    const handleClickButtonAddVolumes = () => {
        setSelectedCustomVolume(null);
        // mở ra phần chọn
        dispatch(
            setDataAddStorageDigitalOcean({
                isSelectAddStorage: true,
                isSelectedCustomStorage: false,
            })
        );

        //chọn gói đầu tiên
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage: {
                    name: "additionalstorage",
                    size_gigabytes:
                        listAddStorageDigitalOcean[0].size_gigabytes,
                    filesystem_type: filesystem,
                    price_monthly: listAddStorageDigitalOcean[0].price_monthly,
                },
                isSelectedCustomStorage: false,
            })
        );
    };

    // remove
    const handleClickButtonRemoveVolumes = () => {
        dispatch(setDataAddStorageDigitalOcean({ isSelectAddStorage: false }));
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage: {},
            })
        );
    };

    //handle click volume
    const handleClickVolumeOption = (volume: any) => {
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage: {
                    ...addStorage,
                    price_monthly: volume.price_monthly,
                    size_gigabytes: volume.size_gigabytes,
                },
                isSelectedCustomStorage: false,
            })
        );
    };
    //handle click volume custom
    const handleClickCustomVolumeOption = () => {
        //set lại add volumes để trừ tiền ra
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage:
                    statusCustomStorage === "VALID" // Nếu input hợp lệ thì set lại volume đã nhập
                        ? {
                              ...addStorage,
                              price_monthly:
                                  selectedCustomVolume?.price_monthly,
                              size_gigabytes:
                                  selectedCustomVolume?.size_gigabytes,
                          }
                        : {
                              ...addStorage,
                              price_monthly: 0,
                              size_gigabytes: 0,
                          },
                isSelectedCustomStorage: true,
            })
        );
        refInputCustomVolume?.current?.focus();
    };
    const MAX_DISK_CUSTOM_VOLUME = 1000;
    const MIN_DISK_CUSTOM_VOLUME = 1;

    const handleChangeCustomVolume = (value: string) => {
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage: {
                    ...addStorage,
                    price_monthly: 0,
                    size_gigabytes: 0,
                },
            })
        );
        const convertNumber = parseInt(value);
        if (isNaN(convertNumber)) {
            dispatch(
                setDataAddStorageDigitalOcean({ statusCustomStorage: "ERROR" })
            );
            return;
        }
        if (
            convertNumber > MAX_DISK_CUSTOM_VOLUME ||
            convertNumber < MIN_DISK_CUSTOM_VOLUME
        ) {
            dispatch(
                setDataAddStorageDigitalOcean({ statusCustomStorage: "ERROR" })
            );
            return;
        }
        const priceMonthly = Number((convertNumber / 10).toFixed(2));
        setSelectedCustomVolume({
            price_monthly: priceMonthly,
            size_gigabytes: convertNumber,
        });
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage: {
                    ...addStorage,
                    price_monthly: priceMonthly,
                    size_gigabytes: convertNumber,
                },
                statusCustomStorage: "VALID",
            })
        );
    };

    return (
        <>
            <h1 className="font-bold">Thêm bộ nhớ</h1>
            {!isSelectAddStorage && (
                <div>
                    <div
                        className={clsx(
                            "my-4 flex flex-col lg:flex-row items-start  border-solid border p-4 gap-4 rounded-[3px] border-[#dfdfdf]"
                        )}
                    >
                        <Button
                            onClick={() => handleClickButtonAddVolumes()}
                            variant="bordered"
                            radius="none"
                            className="hover:bg-primary hover:text-[#fff] border-primary text-primary font-bold"
                        >
                            Thêm bộ nhớ
                        </Button>

                        <div className="flex flex-col">
                            <p className="text-left font-bold text-sm">
                                Cần thêm dung lượng ổ cứng
                            </p>
                            <p className="text-left text-sm">
                                Chúng tôi sẽ vẫn giữ cấu hình của VPS bạn đã
                                chọn, và thêm dung lượng ổ cứng cho bạn
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {isSelectAddStorage && (
                <>
                    <div className=" grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 xl:grid-cols-6 my-4 gap-2 ">
                        <div
                            onClick={() => handleClickCustomVolumeOption()}
                            className={clsx(
                                "flex flex-col text-center border-solid border  cursor-pointer",
                                {
                                    "border-primary isActive":
                                        isSelectedCustomStorage,
                                    "border-[#dfdfdf]":
                                        !isSelectedCustomStorage,
                                }
                            )}
                        >
                            <div
                                className={clsx(
                                    "title flex flex-col border-solid border-b-1 py-2",
                                    {
                                        "border-primary bg-[#f5f9ff] text-primary":
                                            isSelectedCustomStorage,
                                        "border-[#dfdfdf]":
                                            !isSelectedCustomStorage,
                                    }
                                )}
                            >
                                <span>
                                    <sup>$</sup>
                                    <span
                                        className={clsx(
                                            "text-3xl font-semibold"
                                        )}
                                    >
                                        {statusCustomStorage !== "VALID"
                                            ? "__"
                                            : selectedCustomVolume?.price_monthly ??
                                              "__"}
                                    </span>
                                    / <span>tháng</span>
                                </span>
                            </div>
                            <div
                                className={clsx(
                                    "content p-2 text-sm relative",
                                    {
                                        " after:text-[20px] after:absolute after:transition-all after:duration-[0.2s] after:ease-[ease] after:right-[11px] after:top-[11px]":
                                            true,
                                        "after:content-['*'] after:text-primary":
                                            statusCustomStorage === "IDLE",
                                        "after:content-['*'] after:text-[#ED4F32]":
                                            statusCustomStorage === "ERROR",
                                        " after:content-['^'] after:rotate-180 after:text-[#15CD72] after:top-[10px] ":
                                            statusCustomStorage === "VALID",
                                    }
                                )}
                            >
                                {/* <Input label='Enter size in GB' type='number'>
                  <p
                    className={clsx(
                      'text-[11px] text-[#676767] font-bold absolute left-[15px] -top-1.5',
                      {
                        'text-[#ED4F32]': statusCustomVolume === 'ERROR'
                      }
                    )}
                  >
                    {/* {statusCustomVolume !== 'ERROR'
                      ? t('volume.addVolume.inputCustomVolume.labelTitle')
                      : t('volume.addVolume.inputCustomVolume.labelErrorTitle')} */}
                                <Input
                                    radius="none"
                                    className=""
                                    classNames={{
                                        inputWrapper:
                                            "bg-white data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent shadow-none",
                                        input: "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                        label: `${
                                            statusCustomStorage === "VALID"
                                                ? "group-data-[filled-within=true]:text-default-600"
                                                : "group-data-[filled-within=true]:text-red-700"
                                        } `,
                                    }}
                                    label={`${
                                        statusCustomStorage === "VALID"
                                            ? "Enter size in GB"
                                            : "Not a valid size"
                                    } `}
                                    autoComplete="off"
                                    autoFocus={isSelectedCustomStorage}
                                    ref={refInputCustomVolume}
                                    onChange={(e) => {
                                        handleChangeCustomVolume(
                                            e.target.value
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {listAddStorageDigitalOcean.map(
                            (item: any, index: number) => {
                                const isActive: boolean =
                                    !isSelectedCustomStorage &&
                                    addStorage?.size_gigabytes ===
                                        item.size_gigabytes;

                                return (
                                    <div
                                        onClick={() =>
                                            handleClickVolumeOption(item)
                                        }
                                        key={index}
                                        className={clsx(
                                            "sizeDetail flex flex-col text-center border-solid border  cursor-pointer",
                                            {
                                                "border-primary isActive":
                                                    isActive,
                                                "border-[#dfdfdf]": !isActive,
                                            }
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "title flex flex-col border-solid border-b-1 py-2",
                                                {
                                                    "border-primary bg-[#f5f9ff] text-primary":
                                                        isActive,
                                                    "border-[#dfdfdf]":
                                                        !isActive,
                                                }
                                            )}
                                        >
                                            <span>
                                                <sup>$</sup>
                                                <span
                                                    className={clsx(
                                                        "text-3xl font-semibold"
                                                    )}
                                                >
                                                    {item.price_monthly}
                                                    {/* {handleDisplayMonthlyPrice(lang, item.price_monthly)} */}
                                                </span>
                                                / <span>tháng</span>
                                            </span>
                                            {/* <span className="text-sm">${item.price_hourly}/hour</span> */}
                                        </div>
                                        <div className=" p-2 h-full text-[20px] ">
                                            <div className=" h-full text-center min-h-[40px] flex justify-center items-center">
                                                {item.size_gigabytes}
                                                {" GB "}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>

                    {/* <h3 className="pt-4 font-bold">Choose Configuration</h3>
          <RadioGroup value={storageConfigurationSelected.key}>
            <div className="grid grid-cols-1 md:grid-cols-1 my-4 gap-4">
              {STORAGE_CONFIGURATION.map((item: any) => {
                const isActive = storageConfigurationSelected.key === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setStorageConfigurationSelected(item)}
                    className={clsx(
                      " flex flex-col text-center border-solid border  cursor-pointer p-4 gap-4 rounded-[3px] relative",
                      {
                        "border-[#0069ff] bg-[#f5f9ff] text-[#0069ff] isActive":
                          isActive,

                        "border-[#dfdfdf]": !isActive,
                      }
                    )}
                  >
                    <Radio size="lg" value={item.key}>
                      <p className="text-left ml-4 font-bold text-sm">
                        {item.title}
                      </p>
                      <p className="text-left ml-4 text-sm">{item.desc}</p>
                    </Radio>
                  </div>
                );
              })}
            </div>
          </RadioGroup> */}

                    <div className="flex pt-4 gap-4 flex-wrap items-center">
                        <h3 className="">Chọn loại ổ cứng được thêm vào</h3>
                        <RadioGroup
                            value={filesystem}
                            onChange={(value: any) => {
                                setFilesystemSelected(value.target.value);
                                dispatch(
                                    setDataAddStorageDigitalOcean({
                                        addStorage: {
                                            ...addStorage,
                                            filesystem_type: value.target.value,
                                        },
                                    })
                                );
                            }}
                        >
                            <div className="flex gap-2">
                                {STORAGE_CONFIGURATION[0].filesystem.map(
                                    ({
                                        key,
                                        title,
                                    }: {
                                        key: string;
                                        title: string;
                                    }) => (
                                        <Radio size="lg" key={key} value={key}>
                                            <span className="text-sm">
                                                {title}
                                            </span>
                                        </Radio>
                                    )
                                )}
                            </div>
                        </RadioGroup>
                    </div>

                    <Button
                        className="mt-4 hover:bg-red-700 hover:text-white"
                        variant="bordered"
                        color="danger"
                        radius="sm"
                        onClick={() => handleClickButtonRemoveVolumes()}
                    >
                        Xóa
                    </Button>
                </>
            )}
        </>
    );
}

export default AddStorageDigitalOcean;
