import vpsOrtherApis from "@/apis/vps-orther.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationVpsOrther } from "@/stores/async-thunks/vps-orther-thunk";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, Input, ModalFooter } from "@heroui/react";
import { useState } from "react";

function LabelCellVps({ vps }: any) {
  const dispatch = useAppDispatch();
  const [label, setLabel] = useState<string>(vps["domain"] || "");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const tableVpsOrther = useAppSelector((state) => state.table["vps_orther"]);
  const { status, teamSelected, searchByIp } = useAppSelector(
    (state) => state.vpsOrther
  );
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

    if (tableVpsOrther) {
      const cPageSize = tableVpsOrther?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...tableVpsOrther?.pageSize][0]
        : 10;

      query.pageSize = Number(cPageSize);
      query.pageIndex = Number(tableVpsOrther?.pageIndex) || 1;

      dispatch(asyncThunkPaginationVpsOrther(query));
    }
  };
  const onSubmit = async () => {
    if (!label) {
      return setErrorMessage("Nhãn không được bỏ trống!");
    }

    try {
      setIsSubmitting(true);

      const { data } = await vpsOrtherApis.updateLabelVps(vps?._id, {
        label: label.trim(),
      });

      if (data?.status === 1) {
        fetchData();
        dispatch(resetModal());
        showToast("Cập nhật nhãn thành công!", "success");
      }
    } catch (error) {
      console.log("error: ", error);
      showToast("Cập nhật nhãn thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Input
        radius="sm"
        color="primary"
        variant="bordered"
        labelPlacement="outside"
        classNames={{
          inputWrapper:
            "h-10 data-[hover=true]:border-primary border border-slate-400",
          label: "text-dark font-medium",
        }}
        type={"text"}
        label={"Nhãn"}
        placeholder={`Nhập nhãn...`}
        value={label}
        onValueChange={setLabel}
        errorMessage={errorMessage}
        isInvalid={!!errorMessage}
        onKeyDown={(event: any) => event.key === "Enter" && onSubmit()}
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

export default LabelCellVps;
