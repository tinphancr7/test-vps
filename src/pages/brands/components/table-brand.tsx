import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import { IoIosEye } from "react-icons/io";
import ActionsCell from "@/components/actions-cell";
import { useMemo } from "react";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { Button, ModalFooter } from "@heroui/react";
import showToast from "@/utils/toast";
import FormBrand from "./form-brand";
import { asyncThunkPaginationBrands } from "@/stores/slices/brand-slice";
import brandApis from "@/apis/brand-api";

function TableBrand() {
  const dispatch = useAppDispatch();
  const { brandsList, total, isLoading } = useAppSelector(
    (state) => state.brand
  );
  const { permissions } = useAppSelector((state) => state.auth);
  const tableBrand = useAppSelector((state) => state.table["brand"]);
  const { search } = useAppSelector((state) => state.brand);

  const columns = [
    { _id: "name", name: "Tên thương hiệu" },
    { _id: "actions", name: "Hành động" },
  ];

  const accessRole = useMemo(() => {
    const accessRoles = permissions?.map((item: any) => ({
      subject: item.subject,
      action: item.action,
    }));

    return accessRoles?.find(
      (it) =>
        it.subject === SubjectEnum.BRAND ||
        it.subject === SubjectEnum.ALL
    );
  }, [permissions]);

  const isAccessRoleRead = useMemo(
    () =>
      accessRole?.action?.find(
        (item: any) => item === ActionEnum.READ || item === ActionEnum.MANAGE
      ),
    [accessRole]
  );

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

  const onRead = (brand: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Chi tiết thương hiệu",
        body: <FormBrand isEdit={false} isRead={true} brand={brand} />,
      })
    );
  };

  const onUpdate = (brand: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Cập nhật thông tin thương hiệu",
        body: <FormBrand isEdit={true} isRead={false} brand={brand} />,
      })
    );
  };

  const handleDeleteProvider = async (provider: any) => {
    try {
      const { data } = await brandApis.delete(provider?._id);

      if (data?.status === 1) {
        showToast("Xóa thương hiệu thành công!", "success");

        const query: any = {};

        if (search !== undefined) {
          query.search = search;
        }

        if (tableBrand) {
          const cPageSize = tableBrand?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...tableBrand?.pageSize][0]
            : 10;

          query.pageSize = Number(cPageSize);
          query.pageIndex = Number(tableBrand?.pageIndex) || 1;

          dispatch(asyncThunkPaginationBrands(query));
        }

        dispatch(resetModal());
      }
    } catch (error) {
      showToast("Xóa thương hiệu thất bại!", "error");

      console.log("error: ", error);
    }
  };

  const onDelete = (provider: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: `Xóa thương hiệu`,
        body: <p>Bạn chắc chắn muốn xóa thương hiệu "{provider?.name}"</p>,
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
              onPress={() => handleDeleteProvider(provider)}
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

    const addNewActions = [
      {
        order: 1,
        label: "Xem",
        icon: IoIosEye,
        bgColor: "bg-warning",
        isDisabled: isAccessRoleRead ? false : true,
        onPress: () => {
          onRead(item);
        },
      },
    ];

    switch (columnKey) {
        case "actions":
            return (
                <ActionsCell
                    onUpdate={() => onUpdate(item)}
                    onDelete={() => onDelete(item)}
                    disableUpdate={isAccessRoleUpdate ? false : true}
                    disableDelete={isAccessRoleDelete ? false : true}
                    actionsAdd={addNewActions}
                />
            );  
        default:
            return cellValue;
    }
  };

  return (
    <Container>
      <TableControl
        tableId={"brand"}
        columns={columns}
        data={brandsList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableBrand;
