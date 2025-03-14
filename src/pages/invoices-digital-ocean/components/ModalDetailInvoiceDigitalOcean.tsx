import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import DetailProduct from "./DetailProduct";
import { convertPriceToUSD } from "@/utils/digital-ocean";

function ModalDetailInvoiceDigitalOcean({
    isOpenModalConfirm,
    onOpenModalConfirm,
    dataDetailInvoice,
}: any) {
    const { data: dataDetail } = dataDetailInvoice;
    const totalAmount = dataDetail?.reduce(
        (acc: any, curr: any) => acc + curr.totalAmount,
        0
    );
    return (
        <Modal
            isOpen={isOpenModalConfirm}
            onOpenChange={onOpenModalConfirm}
            size="5xl"
            scrollBehavior="inside"
            classNames={{
                body: "scroll-main",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Chi tiết hóa đơn
                            <p className="font-bold text-[24px]">
                                Tổng tiền: {convertPriceToUSD(totalAmount)}
                            </p>
                        </ModalHeader>

                        <ModalBody>
                            {dataDetailInvoice?.data?.length === 0 ||
                            !dataDetailInvoice.status ? (
                                "Không có dữ liệu"
                            ) : (
                                <>
                                    {dataDetail?.map((itemProduct: any) => {
                                        return (
                                            <div key={itemProduct?.product}>
                                                <DetailProduct
                                                    itemProduct={itemProduct}
                                                />
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <div>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Đóng
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
export default ModalDetailInvoiceDigitalOcean;
