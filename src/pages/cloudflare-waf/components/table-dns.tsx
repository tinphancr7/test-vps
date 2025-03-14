/* eslint-disable no-case-declarations */
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import { Button, Chip, ModalFooter } from "@heroui/react";
import { TTL_OPTIONS } from "./constants";
import ActionsCell from "@/components/actions-cell";
import { useMemo, useState } from "react";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import cloudflareApis from "@/apis/cloudflare.api";
import { asyncThunkGetDnsListCloudflare } from "@/stores/async-thunks/dns-thunk";
import FormDns from "./form-dns";
import { useParams } from "react-router-dom";

function TableDns() {
  const dispatch = useAppDispatch();
  const { dnsList, totalDnsList, isLoading } = useAppSelector(
    (state) => state.waf
  );
  const { permissions } = useAppSelector((state) => state.auth);
  const { searchValue } = useAppSelector((state) => state.waf);
  const tableDns = useAppSelector((state) => state.table["table_dns"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();

  const columns = [
    { _id: "type", name: "Type" },
    { _id: "name", name: "Name" },
    { _id: "content", name: "Content" },
    { _id: "proxied", name: "Proxy Status" },
    { _id: "ttl", name: "TTL" },
    { _id: "actions", name: "Actions" },
  ];

  const accessRole = useMemo(() => {
    const accessRoles = permissions?.map((item: any) => ({
      subject: item.subject,
      action: item.action,
    }));

    return accessRoles?.find(
      (it) =>
        it.subject === SubjectEnum.CLOUDFLARE || it.subject === SubjectEnum.ALL
    );
  }, [permissions]);

  const isAccessRoleUpdate = useMemo(
    () =>
      accessRole?.action?.find(
        (item: any) => item === ActionEnum.UPDATE || item === ActionEnum.MANAGE
      ),
    [accessRole]
  );

  const isAccessRoleDelete = useMemo(
    () =>
      accessRole?.action?.find(
        (item: any) => item === ActionEnum.DELETE || item === ActionEnum.MANAGE
      ),
    [accessRole]
  );

  const onUpdate = (item: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Cập nhật DNS",
        body: <FormDns zone_id={id as string} isEdit={true} item={item} />,
      })
    );
  };

  const handleDeleteDns = async (item: any) => {
    try {
      setIsSubmitting(true);

      const { data } = await cloudflareApis.deleteDns(item?.id, id || "");

      if (data?.status === 1) {
        dispatch(resetModal());
        showToast("Xóa DNS thành công!", "success");

        const query: any = {
          zone_id: id,
        };

        if (searchValue !== undefined) {
          query.search = searchValue;
        }

        if (tableDns) {
          const cPageSize = tableDns?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...tableDns?.pageSize][0]
            : 10;

          query.pageSize = Number(cPageSize);
          query.pageIndex = Number(tableDns?.pageIndex) || 1;

          dispatch(asyncThunkGetDnsListCloudflare(query));
        }
      }
    } catch (error: any) {
      console.log("error: ", error);
      showToast(
        error?.response?.data?.message || "Thêm DNS thất bại!",
        "error"
      );
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
        body: <p>Bạn chắc chắn muốn xóa DNS "{item?.name}"</p>,
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
              onPress={() => handleDeleteDns(item)}
              isLoading={isSubmitting}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        ),
      })
    );
  };

  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "proxied":
        const label = cellValue ? "Proxied" : "DNS Only";
        const color = cellValue ? "primary" : "default";

        return (
          <Chip
            color={color}
            classNames={{
              content: "tracking-wider font-medium",
            }}
          >
            {label}
          </Chip>
        );

      case "ttl":
        const findOption = TTL_OPTIONS?.find(
          (it) => it?.value === String(cellValue)
        );
        return findOption?.label || "";

      case "actions":
        return (
          <ActionsCell
            onUpdate={() => onUpdate(item)}
            onDelete={() => onDelete(item)}
            disableUpdate={isAccessRoleUpdate ? false : true}
            disableDelete={isAccessRoleDelete ? false : true}
          />
        );

      default:
        return cellValue || "";
    }
  };

  return (
    <Container>
      <TableControl
        tableId={"table_dns"}
        columns={columns}
        data={dnsList}
        total={totalDnsList}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableDns;
