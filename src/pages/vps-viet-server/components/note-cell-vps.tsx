import vpsApis from "@/apis/vps-apis";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationVpsVietServer } from "@/stores/async-thunks/vps-vietserver-thunk";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, ModalFooter, Textarea } from "@heroui/react";
import { useState } from "react";

function NoteCellVps({ vps }: any) {
    const dispatch = useAppDispatch();
    const [note, setNote] = useState<string>(vps?.note || "");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const tableVpsVietServer = useAppSelector((state) => state.table["vps_vietserver"]);
    const {
		status,
		teamSelected,
		searchByIp,
	} = useAppSelector(state => state.vpsVietServer);

    const fetchData = () => {
        const query: any = {};

        if (searchByIp !== undefined) {
            query.search = searchByIp;
        }

        if (status) {
            const [statusValue] = [...status];

            query.status = statusValue;
        }

        if (teamSelected) {
            query.team = teamSelected;
        }

        if (tableVpsVietServer) {
            const cPageSize = tableVpsVietServer?.pageSize
                // eslint-disable-next-line no-unsafe-optional-chaining
                ? [...tableVpsVietServer?.pageSize][0]
                : 10;
    
            query.pageSize = Number(cPageSize);
            query.pageIndex = Number(tableVpsVietServer?.pageIndex) || 1;
    
            dispatch(asyncThunkPaginationVpsVietServer(query));
        }
    };
    
    const onSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { data } = await vpsApis.updateNoteVps(vps?._id, note);

            if (data?.status === 1) {
                fetchData();
                dispatch(resetModal())
                showToast("Cập nhật ghi chú thành công!", "success");
            }
        } catch (error) {
            console.log("error: ", error);
            showToast("Cập nhật ghi chú thất bại!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Textarea
                minRows={3}
                labelPlacement="outside"
                classNames={{
                    base: "rounded-sm",
                    inputWrapper: `rounded-md shadow-none border p-0 bg-white data-[hover=true]:bg-white data-[hover=true]:border data-[hover=true]:border-primary group-data-[focus=true]:bg-white group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary`,
                    input:
                        "p-2 text-xl placeholder:font-normal  font-medium resize-none overflow-hidden break-words",
                }}
                placeholder="Nhập ghi chú..."
                value={note}
                onValueChange={setNote}
                // onKeyDown={(event) => event.key === "Enter" && onSubmit()}
            />

            <ModalFooter className="px-0">
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
                    isLoading={isSubmitting}
                    onPress={onSubmit}
                >
                    Xác nhận
                </Button>
            </ModalFooter>
        </>
    );
}

export default NoteCellVps;
