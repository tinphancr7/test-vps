import Container from "@/components/container";
import { useAppDispatch } from "@/stores";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import { Button, CircularProgress, ModalFooter, Switch } from "@heroui/react";
import { PiBookOpenText } from "react-icons/pi";
import FormCloudflareRules from "./components/form-cloudflare-rules";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import cloudflareApis from "@/apis/cloudflare-api";
import { ACTIONS_EMPTY_VALUE, FORM_PAGE_RULES, SETTING_OPTIONS, SETTINGS_ENUM } from "./components/constants";
import { LuArrowUp } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { GrConfigure } from "react-icons/gr";
import showToast from "@/utils/toast";

function CloudflareRules() {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [pageRoles, setPageRoles] = useState([]);
    const [status, setStatus] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const { data } = await cloudflareApis.getPageRoles(id as string);
    
            if (data?.status === 1) {
                const result = data?.result?.reduce((current: any, item: any) => {
                    current[item?.id] = item?.status === "active" ? true : false;
    
                    return current;
                }, {});
    
                setStatus(result);
                setPageRoles(data?.result);
            }
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModalAddPageRole = () => {
        dispatch(
            setModal({
                isOpen: true,
                placement: "default",
                title: "Tạo Page Rules",
                body: (
                    <FormCloudflareRules
                        zone_id={id as string}
                        isEdit={false}
                        fetch={fetchData}
                    />
                ),
            })
        );
    };

    const handleOpenModalUpdatePageRole = (item: any) => {
        dispatch(
            setModal({
                isOpen: true,
                placement: "default",
                title: "Cập nhật Page Rules",
                body: (
                    <FormCloudflareRules
                        zone_id={id as string}
                        pageRoleId={item?.id}
                        isEdit={true}
                        fetch={fetchData}
                    />
                ),
            })
        );
    };

    const handleDeletePageRule = async (item: any) => {
        try {
            setIsSubmitting(true);

            const { data } = await cloudflareApis.deletePageRole({
                id: item?.id,
                zone_id: id as string,
            });

            if (data?.status === 1) {
                fetchData();
                showToast("Xóa Page Role thành công!", "success");
                dispatch(resetModal());
            }
            
        } catch (error: any) {
            const parseError: any = JSON.parse(error?.response?.data?.error || {});
            const message =
                parseError?.errors[0]?.message || "Xóa Page Role thất bại";

            showToast(message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = (item: any) => {
        dispatch(
			setModal({
				isOpen: true,
				placement: 'default',
				title: `Xóa Page Rule`,
				body: (
					<p>Bạn chắc chắn muốn xóa Page Rule <i>{item?.targets[0]?.constraint?.value}</i></p>
				),
				footer: (
					<ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
					  <Button
						variant="solid"
						color="danger"
						className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
						onPress={() => dispatch(resetModal())}
					  >
						Hủy
					  </Button>
		
					  <Button
						variant="solid"
						className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
						onPress={() => handleDeletePageRule(item)}
                        isLoading={isSubmitting}
					  >
						Xác nhận
					  </Button>
					</ModalFooter>
				  ),
			})
		);
    };

    const columns = [
        { _id: "moves", name: "", className: "col-span-2" },
        { _id: "priority", name: "Position", className: "col-span-1" },
        { _id: "target", name: "URL/Description", className: "col-span-7" },
        { _id: "actions", name: "Actions", className: "col-span-2 text-center" },
    ];

    const handleUp = async (item: any) => {
        try {
            const findPageRole: any = pageRoles?.find((it: any) => it?.priority === Number(item?.priority) + 1);

            if (!findPageRole) return;

            const { data } = await cloudflareApis.updatePageRole(findPageRole?.id, {
                zone_id: id,
                priority: Number(item?.priority) - 1,
            });

            if (data?.status === 1) {
                fetchData();
                showToast("Cập nhật vị trí thành công!", "success");
            }
        } catch (error: any) {
            const parseError: any = JSON.parse(error?.response?.data?.error);
            const message = parseError?.errors[0]?.message || "Cập nhật vị trí thất bại";
            showToast(message, "error");
        }
    };

    const handleDown = async (item: any) => {
        try {
            const { data } = await cloudflareApis.updatePageRole(item?.id, {
                zone_id: id,
                priority: Number(item?.priority) - 1,
            });

            if (data?.status === 1) {
                fetchData();
                showToast("Cập nhật vị trí thành công!", "success");
            }
        } catch (error: any) {
            const parseError: any = JSON.parse(error?.response?.data?.error);
            const message =
                parseError?.errors[0]?.message || "Cập nhật vị trí thất bại";
            showToast(message, "error");
        }
    };

    const handleChangeStatus = async (itemId: string, value: boolean) => {
        setStatus((prevStatus: any) => ({
            ...prevStatus,
            [itemId]: value, // Toggle the status based on the switch value
        }));

        try {
            const { data } = await cloudflareApis.updatePageRole(itemId, {
                zone_id: id,
                status: value ? 'active' : 'disabled',
            });

            if (data?.status === 1) {
                fetchData();
                showToast("Cập nhật trạng thái thành công!", "success");
            }
        } catch (error: any) {
            const parseError: any = JSON.parse(error?.response?.data?.error);
            const message = parseError?.errors[0]?.message || "Cập nhật trạng thái thất bại";
            showToast(message, "error");
        }
    };

    const renderCell = (item: any, columnKey: string, index: number) => {
        const actions = item["actions"]?.map((it: any) => it?.id);
        const filterSettings = SETTING_OPTIONS
            ?.filter((it: any) =>
                actions?.includes(it?.value)
            )?.sort((a: any, b: any) => {
                return actions.indexOf(a.value) - actions.indexOf(b.value);
            });

        switch (columnKey) {
            case "priority":
                return index + 1;

            case "moves":
                return (
                    <div className="flex justify-center items-center gap-2 h-full">
                        <Button
                            variant="solid"
                            radius="sm"
                            className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                            isDisabled={item?.priority === pageRoles?.length}
                            onPress={() => handleUp(item)}
                        >
                            <LuArrowUp className="min-w-max text-base w-4 h-4 text-dark" />
                        </Button>

                        <Button
                            variant="solid"
                            radius="sm"
                            className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                            isDisabled={item?.priority === 1}
                            onPress={() => handleDown(item)}
                        >
                            <LuArrowUp className="min-w-max text-base w-4 h-4 text-dark rotate-180" />
                        </Button>
                    </div>
                );

            case "target":
                return (
                    <>
                        <span className="italic">
                            {item?.targets[0]?.constraint?.value}
                        </span>
                        <div className="mt-1 flex flex-row gap-x-2 flex-wrap">
                            {filterSettings?.map((it: any, idx: number) => {
                                let labelValue = "";

                                if (ACTIONS_EMPTY_VALUE.includes(it.value) || it?.value === SETTINGS_ENUM.FORWARDING_URL) {
                                    labelValue = ""
                                } else if (
                                    !ACTIONS_EMPTY_VALUE.includes(it.value) &&
                                    (FORM_PAGE_RULES as any)[it.value]?.value?.type === "select"
                                ) {
                                    const findOption = (FORM_PAGE_RULES as any)[it.value]?.value?.options?.find(
                                        (i: any) => i?.value === String(item["actions"]?.[idx]?.value)
                                    );

                                    labelValue = findOption?.label || "";
                                } else {
                                    labelValue = item["actions"]?.[idx]?.value;
                                }

                                return (
                                    <span key={it?.value}>
                                        {it?.label}{labelValue && `: ${labelValue}`},
                                    </span>
                                )
                            })}
                        </div>
                    </>
                );

            case "actions":
                return (
                    <div className="flex justify-center items-center gap-3">
                        <Switch
                            color="primary"
                            size="sm"
                            isSelected={status[item?.id]}
                            startContent={<FaCheck />}
                            endContent={<IoClose />}
                            onValueChange={(value) =>
                                handleChangeStatus(item?.id, value)
                            }
                        />

                        <Button
                            variant="solid"
                            radius="sm"
                            className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                            onPress={() => handleOpenModalUpdatePageRole(item)}
                        >
                            <GrConfigure className="min-w-max text-base w-4 h-4 text-dark rotate-180" />
                        </Button>

                        <Button
                            variant="solid"
                            radius="sm"
                            className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                            onPress={() => handleConfirmDelete(item)}
                        >
                            <IoClose className="min-w-max text-base w-4 h-4 text-dark rotate-180" />
                        </Button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-3 p-2 scroll-main overflow-y-auto">
            <h2 className="text-2xl font-medium text-[#313131] tracking-wide">
                Page Rules
            </h2>

            <p className="text-[#313131] text-base">
                Kích hoạt một số hành động nhất định bất cứ khi nào yêu cầu khớp
                với mẫu URL đã xác định.
            </p>

            <a
                className="flex gap-2 items-center cursor-pointer px-6 rounded-full bg-transparent text-sm border border-primary-500 w-max h-7 text-primary-500 hover:bg-primary-100/50"
                target="_blank"
                rel="noopener noreferrer"
                href="https://developers.cloudflare.com/rules/page-rules/"
            >
                <PiBookOpenText className="w-4 h-4" />
                Tài liệu Page rules
            </a>

            <Container className="flex gap-3 !p-0">
                <div className="flex flex-col gap-3 flex-1 p-4">
                    <h3 className="text-xl font-medium text-[#313131] tracking-wide">
                        Page Rules
                    </h3>

                    <p className="text-[#313131] text-base">
                        Quy tắc trang cho phép bạn kiểm soát cài đặt Cloudflare
                        nào kích hoạt trên một URL nhất định. Chỉ một Quy tắc
                        trang sẽ kích hoạt cho mỗi URL, vì vậy sẽ rất hữu ích
                        nếu bạn sắp xếp Quy tắc trang theo thứ tự ưu tiên và làm
                        cho mẫu URL của bạn càng cụ thể càng tốt.
                    </p>

                    <h5 className="font-bold tracking-wide mt-4 text-base">
                        {pageRoles?.length === 3
                            ? "You have used all of your Page Rules."
                            : `Bạn đã sử dụng ${
                                  pageRoles?.length || 0
                              } trong số 3 Quy tắc Trang có sẵn.`}
                    </h5>
                </div>
                <div className="w-1/3 bg-gray-200 flex items-center justify-center">
                    <Button
                        className="bg-primary-500 text-white rounded-md h-8 text-base"
                        onPress={handleOpenModalAddPageRole}
                    >
                        Tạo Page Rule
                    </Button>
                </div>
            </Container>

            {(isLoading && !pageRoles?.length) ? (
                <div className="flex items-center justify-center h-80">
                    <CircularProgress color="primary" size="lg" />
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-12 border-t border-x border-gray-200">
                        {columns?.map((col) => (
                            <div
                                key={col?._id}
                                className={`${col?.className} p-2 text-base font-medium`}
                            >
                                {col?.name}
                            </div>
                        ))}
                    </div>
                    <div className="border border-gray-200 divide-y-1">
                        {pageRoles?.map((pr: any, index: number) => (
                            <div key={pr?.id} className="grid grid-cols-12">
                                {columns?.map((col) => (
                                    <div
                                        key={col?._id}
                                        className={`${col?.className} px-2 py-4 text-base tracking-wide text-gray-600`}
                                    >
                                        {renderCell(pr, col?._id, index)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CloudflareRules;
