import React from "react";
import { toast } from "react-toastify";
import CustomModal from "@/components/modal/CustomModal";
import ipWhitelistApis from "@/apis/ip-whitelist.api";
import NotifyMessage from "@/utils/notify";

interface ModalDeleteIpWhitelistProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: any;
  reloadTable: () => void;
  ipAddress: string;
}

const ModalDeleteIpWhitelist: React.FC<ModalDeleteIpWhitelistProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  ipAddress,
}) => {
  const resetForm = () => {
    onClose();
  };

  const onSubmit = async (e: any) => {
    try {
      e?.preventDefault();
      const res = await ipWhitelistApis.removeIp(ipAddress);
      console.log("res: ", res);
      if (res?.data) {
        toast.success("Xóa IP thành công");
        resetForm();
        reloadTable();
      } else {
        NotifyMessage("Xóa IP không thành công", "error");
      }
    } catch (error: any) {
      NotifyMessage(error?.message || "Xóa IP không thành công", "error");
    }
  };

  return (
    <CustomModal
      title="Xóa IP Whitelist"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      resetForm={resetForm}
    >
      <div className="p-4">
        <p>
          Bạn có chắc chắn muốn xóa IP <strong>{ipAddress}</strong> khỏi danh
          sách whitelist không?
        </p>
      </div>
    </CustomModal>
  );
};

export default ModalDeleteIpWhitelist;
