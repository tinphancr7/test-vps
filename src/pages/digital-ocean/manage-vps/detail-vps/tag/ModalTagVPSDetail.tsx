import digitalOceanApi from "@/apis/digital-ocean.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  getListTag,
  getListVPS,
} from "@/stores/slices/digital-ocean-slice/digital-ocean-vps.slice";
import showToast from "@/utils/toast";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";

function ModalTagVPSDetail({ openModal, onOpenChange, item }: any) {
  const { search } = useAppSelector((state) => state.digitalOceanVPS);
  const dispatch = useAppDispatch();
  const [tags, setTags] = useState<string[]>(item?.tags);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTags(item?.tags);
  }, [item]);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const newTag = inputValue.trim();
      // const isValid = /^[a-zA-Z0-9_\-\:]+$/.test(newTag);
      const isValid = /^[a-zA-Z0-9_\-:]+$/.test(newTag);
      if (!isValid) {
        setErrorMessage(
          "Tag không hợp lệ. Chỉ chứa chữ cái, số, dấu gạch ngang (-), gạch dưới (_), hoặc dấu hai chấm (:)."
        );
        return;
      }
      if (newTag.length > 255) {
        setErrorMessage("Tag không được vượt quá 255 ký tự.");
        return;
      }

      setErrorMessage(null); // Xóa thông báo lỗi nếu hợp lệ

      // Kiểm tra nếu `newTag` không rỗng và không trùng lặp
      if (newTag !== "" && !tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]); // Thêm tag mới
      }

      setInputValue(""); // Reset textarea
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };
  const handleAddTag = async () => {
    setIsLoading(true);
    const { data: resultAdd } =
      await digitalOceanApi.createAndAddTagDigitalOcean({ item, tags });
    if (!resultAdd?.status) {
      showToast("Cập nhật tag không thành công", "error");
      return;
    }
    showToast("Cập nhật tag  thành công", "success");
    onOpenChange(false);
    setIsLoading(false);
    dispatch(getListVPS(search));
    dispatch(getListTag());
    // call api add tag
  };

  return (
    <Modal
      isOpen={openModal}
      onOpenChange={(isOpen: any) => {
        if (!isOpen) {
          setTags(item?.tags); // Reset tags
        }
        onOpenChange(isOpen);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">TAG</ModalHeader>
            <ModalBody>
              <div className="flex flex-wrap items-center gap-4 border p-2 rounded-md">
                {tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-md flex items-center gap-1"
                  >
                    {tag.length > 20 ? `${tag.substring(0, 20)}...` : tag}
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveTag(index)}
                    >
                      x
                    </button>
                  </span>
                ))}
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e: any) => handleKeyDown(e)}
                  minRows={1}
                  labelPlacement="outside"
                  classNames={{
                    base: "rounded-sm",
                    inputWrapper:
                      "rounded-xs shadow-none border-0 p-0 bg-transparent",
                    input:
                      "p-2 text-base font-medium resize-none overflow-hidden break-words",
                  }}
                  placeholder="Nhập tag (Enter hoặc Space để tạo)"
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
              )}
              <div className="text-gray-500 text-sm mt-2">
                Chỉ được nhập các ký tự chữ cái, số, gạch ngang (-), gạch dưới
                (_), hoặc dấu hai chấm (:).
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={() => handleAddTag()}
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalTagVPSDetail;
