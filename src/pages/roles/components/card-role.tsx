import { useAppDispatch, useAppSelector } from "@/stores";
import { useCallback } from "react";
import FormRole from "./form-role";
import { resetModal, setModal } from "@/stores/slices/modal-slice";
import { Button, ModalFooter, User } from "@heroui/react";
import { asyncThunkDeleteRoleById } from "@/stores/async-thunks/role-thunk";
import Container from "@/components/container";
import ActionsCell from "@/components/actions-cell";
import { IoIosEye } from "react-icons/io";
import { PermissionSchema } from "@/interfaces/permission-schema";
import showToast from "@/utils/toast";
import { ActionEnum, SubjectEnum } from "@/constants/enum";

function CardRole({ role }: any) {
  const dispatch = useAppDispatch();
  const {
    user: { permission },
  } = useAppSelector((state) => state.auth);

  const isDisabled = useCallback(
    (action: string): boolean => {
      const isAccessRole = permission?.find(
        (perms: PermissionSchema) =>
          perms.subject === SubjectEnum.ALL ||
          (perms.subject === SubjectEnum.ROLE && perms?.action.includes(action)),
      );

      if (
        action !== ActionEnum.READ &&
        (String(role.name).toLowerCase().includes("supper admin") || !isAccessRole)
      )
        return true;

      return false;
    },
    [permission, role],
  );

  const onRead = () => {
    dispatch(
      setModal({
        isOpen: true,
        title: "Xem quyền hạn",
        placement: "right",
        body: <FormRole dataEdit={role} isRead={true} isEdit={false} />,
        footer: "",
      }),
    );
  };

  const onUpdate = () => {
    dispatch(
      setModal({
        isOpen: true,
        title: "Cập nhật quyền hạn",
        placement: "right",
        body: <FormRole dataEdit={role} isRead={false} isEdit={true} />,
        footer: "",
      }),
    );
  };

  const handleDeleteRole = async () => {
    const { status } = await dispatch(asyncThunkDeleteRoleById(role?._id)).unwrap();

    if (status === 1) {
      showToast("Xóa quyền hạn thành công!", "success");
      dispatch(resetModal());
    }
  };

  const onDelete = () => {
    dispatch(
      setModal({
        isOpen: true,
        title: "Xóa quyền hạn",
        body: `Bạn chắc chắn muốn xóa quyền hạn ${role?.name}!`,
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
              onPress={handleDeleteRole}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        ),
      }),
    );
  };

  const addNewActions = [
    {
      order: 1,
      label: "Xem",
      icon: IoIosEye,
      bgColor: "bg-warning",
      isDisabled: isDisabled(ActionEnum.READ),
      onPress: onRead,
    },
  ];

  return (
    <Container className={"rounded-md flex justify-between py-5 pl-4"}>
      <User
        name={role?.name}
        avatarProps={{
          src: "/icons/role-card.png",
          isBordered: true,
          classNames: {
            base: "w-12 h-12 bg-light ring-1 ring-primaryDf",
          },
        }}
        classNames={{
          base: "flex-1 justify-start gap-3",
          name: "text-lg font-semibold",
        }}
      />

      <div className="flex flex-wrap justify-center gap-2">
        <ActionsCell
          onUpdate={onUpdate}
          onDelete={onDelete}
          disableUpdate={isDisabled(ActionEnum.UPDATE)}
          disableDelete={isDisabled(ActionEnum.DELETE)}
          actionsAdd={addNewActions}
        />
      </div>
    </Container>
  );
}

export default CardRole;
