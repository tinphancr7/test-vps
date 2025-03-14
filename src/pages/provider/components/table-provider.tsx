import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import { IoIosEye } from "react-icons/io";
import FormProvider from "./form-provider";
import ActionsCell from "@/components/actions-cell";
import { useMemo } from "react";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import { Button, ModalFooter, Tooltip } from "@heroui/react";
import otherProviderApis from "@/apis/other-provider";
import { asyncThunkPaginationProviders } from "@/stores/async-thunks/provider-thunk";
import { HttpStatusCode } from "axios";
import showToast from "@/utils/toast";

function TableProvider() {
  const dispatch = useAppDispatch();
  const { providersList, total, isLoading } = useAppSelector(
    (state) => state.provider
  );
  const { permissions } = useAppSelector((state) => state.auth);
  const tableProvider = useAppSelector((state) => state.table["provider"]);
  const { search } = useAppSelector((state) => state.provider);

  const columns = [
    { _id: "name", name: "Tên nhà cung cấp" },
    { _id: "mails", name: "Mails" },
    { _id: "exchange_rate", name: "Tỷ giá" },
    { _id: "actions", name: "Hành động" },
  ];

  const accessRole = useMemo(() => {
    const accessRoles = permissions?.map((item: any) => ({
      subject: item.subject,
      action: item.action,
    }));

    return accessRoles?.find(
      (it) =>
        it.subject === SubjectEnum.OTHER_PROVIDER ||
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

  const onRead = (provider: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Chi tiết nhà cung cấp",
        body: <FormProvider isEdit={false} isRead={true} provider={provider} />,
      })
    );
  };

  const onUpdate = (provider: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Cập nhật thông tin nhà cung cấp",
        body: <FormProvider isEdit={true} isRead={false} provider={provider} />,
      })
    );
  };

  const handleDeleteProvider = async (provider: any) => {
    try {
      const { data } = await otherProviderApis.delete(provider?._id);

      if (data?.statusCode === HttpStatusCode.Ok) {
        showToast("Xóa nhà cung cấp thành công!", "success");

        const query: any = {};

        if (search !== undefined) {
          query.search = search;
        }

        if (tableProvider) {
          const cPageSize = tableProvider?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...tableProvider?.pageSize][0]
            : 10;

          query.pageSize = Number(cPageSize);
          query.pageIndex = Number(tableProvider?.pageIndex) || 1;

          dispatch(asyncThunkPaginationProviders(query));
        }

        dispatch(resetModal());
      }
    } catch (error) {
      showToast("Xóa nhà cung cấp thất bại!", "error");

      console.log("error: ", error);
    }
  };

  const onDelete = (provider: any) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: `Xóa nhân sự`,
        body: <p>Bạn chắc chắn muốn xóa nhân sự "{provider?.name}"</p>,
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
      case "mails":
        return cellValue &&
          Array.isArray(cellValue) &&
          cellValue?.length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center">
            {cellValue.slice(0, 3).map((mail: any, index: number) => (
              <div
                key={index}
                className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-sm cursor-pointer select-none transform transition-transform duration-200 active:scale-95"
              >
                <p className="text-[14px] text-black font-medium">{mail}</p>
              </div>
            ))}
            {cellValue.length > 3 && (
              <Tooltip
                className="!rounded max-w-[80vw] p-3"
                content={
                  <div className="flex flex-wrap gap-1 bg-white !rounded-none">
                    {cellValue?.slice(0, 3).map((mail: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-sm cursor-pointer select-none transform transition-transform duration-200 active:scale-95"
                      >
                        <p className="text-[14px] text-black font-medium">
                          {mail}
                        </p>
                      </div>
                    ))}
                  </div>
                }
                placement="top"
              >
                <div className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-sm cursor-pointer select-none transform transition-transform duration-200 active:scale-95">
                  <p className="text-[14px] text-black font-medium">...</p>
                </div>
              </Tooltip>
            )}
          </div>
        ) : (
          <>(Trống)</>
        );
      default:
        return cellValue;
    }
  };

  return (
    <Container>
      <TableControl
        tableId={"provider"}
        columns={columns}
        data={providersList}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableProvider;
