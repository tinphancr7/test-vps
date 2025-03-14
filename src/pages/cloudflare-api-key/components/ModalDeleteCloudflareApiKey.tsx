import cloudflareApiKeyApi from "@/apis/cloudflare-api-key.api";
import CustomModal from "@/components/modal/CustomModal";
import NotifyMessage from "@/utils/notify";

const ModalDeleteCloudflareApiKey = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  selectedKeys,
  setSelectedKeys,
  data,
}: any) => {
  const handleOnDelete = async (e: any) => {
    e.preventDefault();

    const ids =
      selectedKeys === "all"
        ? data.map((item: any) => item._id).join(",")
        : [...selectedKeys].join(",");

    try {
      await cloudflareApiKeyApi.callDeleteCloudflareApiKey(ids);
      NotifyMessage("Xóa thành công", "success");
      reloadTable();
      setSelectedKeys(new Set());
      onClose();
    } catch (error) {
      console.log(error);
      NotifyMessage("Lỗi vui lòng thử lại sau", "error");
    }
  };
  return (
    <CustomModal
      title={"Bạn có chắc chắn?"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleOnDelete}
      resetForm={onClose}
      size="xl"
    >
      <div>
        <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh]">
          <p>Bạn có thực sự muốn xóa không? Quá trình này không thể hoàn tác</p>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalDeleteCloudflareApiKey;
