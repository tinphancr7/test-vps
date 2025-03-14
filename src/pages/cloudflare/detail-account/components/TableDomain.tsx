import cloudflareApis from "@/apis/cloudflare-api";
import ActionsCell from "@/components/actions-cell";
import TableNextUI_V2 from "@/components/table-control/NextTableV2";
import { IAccountCloudflare } from "@/interfaces/cloudflare";
import { useAppDispatch } from "@/stores";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, ModalFooter } from "@heroui/react";
import { Key, memo, useCallback, useState } from "react";

interface Props {
  data: IAccountCloudflare[];
  isLoading: boolean;
  total: number;
  fetch: () => void;
}

const TableDomain = ({ data, isLoading, total, fetch }: Props) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { _id: "name", name: "Name", className: "text-left" },
    { _id: "team", name: "Team" },
    { _id: "leader", name: "Người quản lý" },
    { _id: "status", name: "Status" },
    { _id: "plan", name: "Plan" },
    { _id: "plan_status", name: "Plan Status" },
    { _id: "actions", name: "Actions", className: "text-center" },
  ];

  const handleDeleteUser = async (item: any) => {
    try {
      setIsSubmitting(true);

      const response = await cloudflareApis.deleteWebsite(item?.id);

      if (response?.data?.status === 1) {
        showToast("Xóa website thành công!", "success");
        fetch();
        dispatch(resetModal());
      }
    } catch (error) {
      console.log("error: ", error);
      showToast("Xóa website thất bại!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = (item: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: `Xóa nhân sự`,
        body: <p>Bạn chắc chắn muốn xóa website "{item?.name}"</p>,
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
              isLoading={isSubmitting}
              onPress={() => handleDeleteUser(item)}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        ),
      }),
    );
  };

  const renderCell = useCallback((item: IAccountCloudflare, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IAccountCloudflare];

    switch (columnKey) {
      case "name":
        return <div>{cellValue}</div>;
      case "leader":
        return <div>{cellValue?.name || "(Trống)"}</div>;
      case "team":
        return <div>{cellValue?.map((team: any) => team?.name)?.join(", ") || "(Trống)"}</div>;
      case "status":
        return <div className="capitalize">{cellValue}</div>;

      case "plan":
        return <div className="capitalize">{item?.plan?.legacy_id}</div>;

      case "plan_status":
        return <div className="capitalize">{item["status"]}</div>;

      case "actions":
        return (
          <div className="flex justify-center items-center">
            <ActionsCell onDelete={() => onDelete(item)} disableUpdate={true} />
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <TableNextUI_V2
      data={data || []}
      columns={columns}
      isLoading={isLoading}
      renderCell={renderCell}
      total={total}
    />
  );
};

export default memo(TableDomain);
