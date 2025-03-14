import vpsApis from "@/apis/vps-apis";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getListLoadBalancer } from "@/stores/slices/digital-ocean-slice/digital-ocean-load-balancer-bu-cloud.slice";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, ModalFooter, Textarea } from "@heroui/react";
import { useState } from "react";

function NoteCellVps({ vps, teamSelected, searchByIp }: any) {
  const dispatch = useAppDispatch();
  const [note, setNote] = useState<string>(vps?.note || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const loadBalancerManagement = useAppSelector(
    (state) => state.table["loadbalancer-management-bucloud"]
  );

  const fetchData = () => {
    const query: any = {};

    if (searchByIp) {
      query.search = searchByIp;
    }

    if (teamSelected) {
      query["team"] = teamSelected;
    }

    if (loadBalancerManagement) {
      const cPageSize = loadBalancerManagement?.pageSize
        ? // eslint-disable-next-line no-unsafe-optional-chaining
          [...loadBalancerManagement?.pageSize][0]
        : 10;

      query["pageIndex"] = loadBalancerManagement?.pageIndex || 1;
      query["pageSize"] = cPageSize;

      dispatch(getListLoadBalancer(query));
    }

    return () => {};
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data } = await vpsApis.updateNoteVps(vps?._id_VPS, note);

      if (data?.status === 1) {
        fetchData();
        dispatch(resetModal());
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
          inputWrapper: `rounded-md shadow-none border p-0 bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400`,
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
