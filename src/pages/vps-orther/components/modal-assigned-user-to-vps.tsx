/* eslint-disable no-extra-boolean-cast */
import userApis from "@/apis/user-api";
import vpsOrtherApis from "@/apis/vps-orther.api";

import { useAppSelector } from "@/stores";

import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
} from "@heroui/react";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
function ModalAssignedUserToVps({ isOpen, onOpenChange }: any) {
  const [stateLoading, setStateLoading] = useState<{
    isLoadingUser: boolean;
    isLoadingVps: boolean;
    isLoadingSubmit: boolean;
  }>({
    isLoadingSubmit: false,
    isLoadingUser: false,
    isLoadingVps: false,
  });

  const [listSelectedUser, setListSelectedUser] = useState<any[]>([]);
  const tableVpsVng = useAppSelector((state) => state.table["vps_orther"]);
  const [listVps, setListVps] = useState<any[]>([]);
  const [listUser, setListUser] = useState<any[]>([]);
  const getInfoListVPS = async () => {
    try {
      setStateLoading((prev) => ({ ...prev, isLoadingVps: true }));
      if (!tableVpsVng?.selectedKeys) return;
      const selectedKeys = tableVpsVng?.selectedKeys;
      const listKey = [...selectedKeys];

      const result = await vpsOrtherApis.getListVpsAdmin(listKey.join(","));
      setListVps(result.data);
      setStateLoading((prev) => ({ ...prev, isLoadingVps: false }));
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra vui lòng thử lại sau!");
    }
  };
  const getListUser = async () => {
    try {
      if (!!!listUser.length) {
        setStateLoading((prev) => ({ ...prev, isLoadingUser: true }));
        const result = await userApis.getListUser();
        if (result?.data?.data && Array.isArray(result?.data?.data))
          setListUser(result?.data?.data);
        setStateLoading((prev) => ({ ...prev, isLoadingUser: false }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra vui lòng thử lại sau!");
    }
  };
  useEffect(() => {
    if (isOpen) {
      getInfoListVPS();
      getListUser();
    }
  }, [isOpen]);
  const hanldeCloseModal = () => {
    setStateLoading({
      isLoadingSubmit: false,
      isLoadingUser: false,
      isLoadingVps: false,
    });
    setListSelectedUser([]);
    setListVps([]);
    setListUser([]);
    onOpenChange(false);
  };
  const handleSubmit = async () => {
    try {
      const listUserId = listSelectedUser.map((user) => user?.value).join(",");
      const listVpsid = listVps.map((vps) => vps?._id).join(",");
      await vpsOrtherApis.updateAssignedVpsToUser(listVpsid, listUserId);
      toast.success("Phân quyền VPS cho người dùng thành công!");
      hanldeCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra vui lòng thử lại sau!");
      console.log("error: ", error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      onClose={() => hanldeCloseModal()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Gia hạn dịch vụ
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col justify-start gap-3 min-h-72">
                {stateLoading.isLoadingUser || stateLoading.isLoadingVps ? (
                  <div className="w-full h-full flex justify-center items-center min-h-72">
                    <Spinner className="self-center" />
                  </div>
                ) : (
                  <>
                    <div className="text-[15px] flex flex-col gap-3 w-full">
                      <p>
                        Chọn người dùng cần phân quyền cho các VPS sau : <br />
                      </p>

                      <div className="flex w-full gap-2 flex-wrap">
                        {listVps.slice(0, 5).map((vps, index) => (
                          <Chip
                            key={index}
                            className="rounded border-primary"
                            variant="bordered"
                            color="primary"
                          >
                            {vps?.ip || vps?.vps_id?.domain || "(Trống)"}
                          </Chip>
                        ))}
                        {listVps.length > 5 && (
                          <Tooltip
                            placement="top"
                            content={
                              <div className="flex flex-wrap gap-2 p-2">
                                {listVps.slice(5).map((vps, index) => (
                                  <Chip
                                    key={index}
                                    className="rounded border-primary"
                                    variant="bordered"
                                    color="primary"
                                  >
                                    {vps?.ip ||
                                      vps?.vps_id?.domain ||
                                      "(Trống)"}
                                  </Chip>
                                ))}
                              </div>
                            }
                          >
                            <Chip
                              className="rounded border-primary"
                              variant="bordered"
                              color="primary"
                            >
                              ...
                            </Chip>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div className="gap-2 flex flex-col ">
                      <label className="block text-sm font-medium text-gray-700">
                        Danh sách người dùng
                      </label>
                      <CreatableSelect
                        isClearable
                        isMulti
                        onCreateOption={() => {}}
                        options={listUser.map((vps) => ({
                          value: vps?._id,
                          label: vps?.username,
                        }))}
                        isValidNewOption={() => false}
                        value={listSelectedUser}
                        onChange={(val) => {
                          setListSelectedUser([...val]);
                        }}
                        placeholder="Chọn người dùng có thể thấy danh sách vps bạn đã chọn..."
                        styles={{
                          container: (base) => ({
                            ...base,
                          }),
                          control: (base) => ({
                            ...base,
                            fontSize: "12px",
                            minHeight: "30px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            color: "#a0aec0",
                          }),
                          multiValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "2px 8px",
                            fontSize: "12px",
                          }),
                          input: (base) => ({
                            ...base,
                            fontSize: "12px",
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "12px",
                            height: "150px",
                          }),
                          menuList: (base) => ({
                            ...base,
                            fontSize: "12px",
                            height: "150px",
                          }),
                        }}
                      />
                      {/* {errors?.telegramIds && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.telegramIds.message}
                    </p>
                  )} */}
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="justify-end">
              <Button
                color="primary"
                onPress={() => {
                  handleSubmit();
                }}
                isLoading={
                  stateLoading.isLoadingSubmit ||
                  stateLoading.isLoadingUser ||
                  stateLoading.isLoadingVps
                }
              >
                Thay đổi
              </Button>

              <Button
                color="default"
                onPress={() => {
                  onClose();
                }}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
export default ModalAssignedUserToVps;
