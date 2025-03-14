import { Button, ModalFooter, Tooltip, User } from "@heroui/react";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { API_IMAGE } from "@/configs/apis";
import ActionsCell from "@/components/actions-cell";
import { useAppDispatch, useAppSelector } from "@/stores";
import FormUser from "./form-user";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import { UserSchema } from "@/interfaces/user-schema";
import { IoIosEye } from "react-icons/io";
import { asyncThunkDeleteUser } from "@/stores/async-thunks/user-thunk";
import { RiLockPasswordLine } from "react-icons/ri";
import FormResetPw from "./form-reset-pw";
import { useCallback, useMemo } from "react";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function TableUsers() {
  const dispatch = useAppDispatch();
  const { users, total, isLoading } = useAppSelector((state) => state.users);
  const { permissions } = useAppSelector((state) => state.auth);

  const columns = [
    { _id: "name", name: "Tên công việc", className: "text-left" },
    { _id: "username", name: "Tên đăng nhập" },
    { _id: "role", name: "Quyền hạn" },
    { _id: "teams", name: "Team" },
    { _id: "listIp", name: "Danh sách IP" },
    { _id: "actions", name: "Hành động" },
  ];

  const accessRole = useMemo(() => {
    const accessRoles = permissions?.map((item: any) => ({
      subject: item.subject,
      action: item.action,
    }));

    return accessRoles?.find(
      (it) => it.subject === SubjectEnum.USER || it.subject === SubjectEnum.ALL
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

  const onResetPassword = (user: UserSchema) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Thay đổi mật khẩu",
        body: <FormResetPw user={user} />,
      })
    );
  };

  const onRead = (user: UserSchema) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Cập nhật thông tin nhân sự",
        body: <FormUser isEdit={false} isRead={true} user={user} />,
      })
    );
  };

  const onUpdate = (user: UserSchema) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Cập nhật thông tin nhân sự",
        body: <FormUser isEdit={true} user={user} />,
      })
    );
  };

  const handleDeleteUser = async (user: UserSchema) => {
    try {
      const { status } = await dispatch(
        asyncThunkDeleteUser(user?._id)
      ).unwrap();

      if (status === 1) {
        dispatch(resetModal());
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const onDelete = (user: UserSchema) => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "default",
        title: `Xóa nhân sự`,
        body: <p>Bạn chắc chắn muốn xóa nhân sự "{user?.name}"</p>,
        footer: (
          <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
            <Button
              variant="solid"
              color="danger"
              className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
              onPress={() => dispatch(resetModal())}>
              Hủy
            </Button>

            <Button
              variant="solid"
              className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
              onPress={() => handleDeleteUser(user)}>
              Xác nhận
            </Button>
          </ModalFooter>
        ),
      })
    );
  };

  const renderCell = useCallback(
    (item: any, columnKey: string) => {
      const cellValue = item[columnKey];
      const urlImage = item?.avatar ? `${API_IMAGE}/${item?.avatar}` : "";
      const addNewActions = [
        {
          order: 1,
          label: "Xem",
          icon: IoIosEye,
          bgColor: "bg-warning",
          isDisabled: false,
          onPress: () => {
            onRead(item);
          },
        },
        {
          order: 0,
          label: "Đổi mật khẩu",
          icon: RiLockPasswordLine,
          bgColor: "bg-success-600",
          isDisabled: isAccessRoleUpdate ? false : true,
          onPress: () => {
            onResetPassword(item);
          },
        },
      ];

      switch (columnKey) {
        case "listIp":
          return cellValue &&
            Array.isArray(cellValue) &&
            cellValue?.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {cellValue.slice(0, 3).map((mail: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-sm cursor-pointer select-none transform transition-transform duration-200 active:scale-95">
                  <p className="text-[14px] text-black font-medium">{mail}</p>
                </div>
              ))}
              {cellValue.length > 3 && (
                <Tooltip
                  className="!rounded max-w-[80vw] p-3"
                  content={
                    <div className="flex flex-wrap gap-1 bg-white !rounded-none">
                      {cellValue
                        ?.slice(0, 3)
                        .map((mail: any, index: number) => (
                          <div
                            key={index}
                            className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-sm cursor-pointer select-none transform transition-transform duration-200 active:scale-95">
                            <p className="text-[14px] text-black font-medium">
                              {mail}
                            </p>
                          </div>
                        ))}
                    </div>
                  }
                  placement="top">
                  <div className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-sm cursor-pointer select-none transform transition-transform duration-200 active:scale-95">
                    <p className="text-[14px] text-black font-medium">...</p>
                  </div>
                </Tooltip>
              )}
            </div>
          ) : (
            <>(Trống)</>
          );
        case "name":
          return (
            <div className="text-left">
              <User
                name={item?.name || item?.username}
                avatarProps={{
                  size: "sm",
                  className: "min-w-8 min-h-8",
                  src: urlImage,
                }}
                classNames={{
                  base: "hover:opacity-50 cursor-pointer",
                  description: "hidden",
                }}
              />
            </div>
          );

        case "role":
          return cellValue?.name;

        case "teams":
          return cellValue?.map((it: any) => it?.name)?.join(", ");

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isAccessRoleDelete, isAccessRoleUpdate]
  );

  return (
    <Container>
      <TableControl
        tableId={"users"}
        columns={columns}
        data={users}
        total={total}
        isLoading={isLoading}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableUsers;
