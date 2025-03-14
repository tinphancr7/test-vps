import { useAppSelector } from "@/stores";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
// import FileUpLoad from "./upload";
import Attachments from "./attachments";

function ModalUploadBill({
  isOpenModal,
  opOpenchange,
  handleConfirm,
  files,
  setFiles,
  existingFiles,
  setExistingFiles,
  urlBill,
}: any) {
  const { isLoadingUpdate } = useAppSelector((state) => state.order);

  return (
    <Modal isOpen={isOpenModal} onOpenChange={opOpenchange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Upload Bill
            </ModalHeader>
            <ModalBody>
              <Attachments 
                setFiles={setFiles} 
                files={files} 
                existingFiles={existingFiles}
                setExistingFiles={setExistingFiles}
                urlsBill={urlBill} 
              />
              {/* <FileUpLoad file={file} setFile={setFile} urlBill={urlBill} /> */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
              <Button
                variant="solid"
                className={`bg-primary text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
                onPress={handleConfirm}
                isLoading={isLoadingUpdate}
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

export default ModalUploadBill;
