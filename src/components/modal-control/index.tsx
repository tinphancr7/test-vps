import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";

function ModalControl() {
  const {
    isOpen,
    title,
    body,
    maxWidth,
    isDismissable,
    header,
    hideCloseButton,
    footer,
    placement,
  } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(resetModal());
  };

  const classNames = useMemo(() => {
    const rightModalClasses = {
      wrapper: "w-full overflow-hidden !justify-end !items-end",
      base: `max-h-page !shadow-container max-w-[30%] h-full !my-0 !mr-0 rounded-none border-l-1 border-default-300  ${maxWidth}`,
      header: "px-2 justify-end border-b-1 border-default-200",
      body: "overflow-y-auto rounded-tr-none !rounded-none py-0 px-2 pt-2",
      closeButton: "right-2 z-10 text-lg",
    };

    if (placement === "right") {
      return rightModalClasses;
    }

    return {
      wrapper: "w-full overflow-hidden items-center",
      base: `max-h-[90vh] !shadow-container min-w-[50%] w-max max-w-[70%] ${maxWidth}`,
      closeButton: "right-5 z-10 text-lg",
      body: "h-full overflow-y-auto text-dark",
    };
  }, [maxWidth, placement]);

  const placementModal = useMemo(() => {
    if (placement === "right") {
      return "transparent";
    }

    return "opaque";
  }, [placement]);

  const motionProps = useMemo(() => {
    if (placement === "right") {
      return {
        initial: { width: "0%", opacity: 0 },
        animate: { width: "100%", opacity: 1 },
        exit: { width: "0%", opacity: 0 },
        transition: { duration: 0.3 },
      };
    }
  }, [placement]);

  return (
    isOpen && (
      <NextUIModal
        backdrop={placementModal}
        isOpen={isOpen}
        onClose={handleCloseModal}
        isDismissable={isDismissable}
        motionProps={motionProps}
        classNames={classNames}
        hideCloseButton={hideCloseButton}
        scrollBehavior="inside"
      >
        <ModalContent>
          <>
            {header
              ? header
              : title && (
                  <ModalHeader className="flex flex-col gap-1 uppercase text-dark">
                    {title}
                  </ModalHeader>
                )}
            <ModalBody>{body}</ModalBody>
            {footer}
          </>
        </ModalContent>
      </NextUIModal>
    )
  );
}

export default ModalControl;
