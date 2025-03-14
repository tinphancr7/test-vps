import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@heroui/input";
import { useAppDispatch, useAppSelector } from "@/stores";
import { createCertificateDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-certificate.slice";
import showToast from "@/utils/toast";
function ModalCreateCertificate({
    isOpenModalConfirm,
    onOpenModalConfirm,
}: any) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name_certificate: "",
            leaf_certificate: "",
            private_key: "",
            certificate_chain: "",
        },
    });

    const { dataResCertificate }: any = useAppSelector(
        (state) => state.digitalOceanCertificate
    );
    useEffect(() => {
        if (
            Object.keys(dataResCertificate).length > 0 &&
            !dataResCertificate?.status
        ) {
            showToast("Tạo Certificate không thành công", "error");
            return;
        }
        if (
            Object.keys(dataResCertificate).length > 0 &&
            dataResCertificate?.status
        ) {
            showToast("Tạo Certificate thành công", "success");
            reset();
            onOpenModalConfirm(false);
        }
    }, [dataResCertificate]);
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(
        (state) => state.digitalOceanCertificate
    );
    const onSubmit = async (data: any) => {
        dispatch(createCertificateDigitalOcean(data));
    };
    return (
        <div>
            <Modal
                isOpen={isOpenModalConfirm}
                onOpenChange={() => {
                    onOpenModalConfirm();
                    reset();
                }}
                size="4xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Tạo Certificate
                            </ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <ModalBody>
                                        <div className="flex flex-col gap-4 mt-4">
                                            <label htmlFor="">
                                                Tên Certificate
                                            </label>
                                            <Input
                                                {...register(
                                                    "name_certificate",
                                                    {
                                                        required: true,
                                                    }
                                                )}
                                                placeholder="Nhập tên certificate"
                                                variant="bordered"
                                                radius="none"
                                            />
                                            {errors.name_certificate && (
                                                <p className="text-red-500">
                                                    Không được bỏ trống Tên
                                                    certificate
                                                </p>
                                            )}
                                            <label htmlFor="">
                                                Certificate
                                            </label>
                                            <Textarea
                                                {...register(
                                                    "leaf_certificate",
                                                    {
                                                        required: true,
                                                    }
                                                )}
                                                placeholder="Nhập Cerfiticate"
                                                variant="bordered"
                                                radius="none"
                                            />
                                            {errors.leaf_certificate && (
                                                <p className="text-red-500">
                                                    Không được bỏ trống
                                                    Certificate
                                                </p>
                                            )}
                                            <label htmlFor="">
                                                Private Key
                                            </label>
                                            <Textarea
                                                {...register("private_key", {
                                                    required: true,
                                                })}
                                                placeholder="Nhập Private Key"
                                                variant="bordered"
                                                radius="none"
                                                type="text"
                                            />
                                            {errors.private_key && (
                                                <p className="text-red-500">
                                                    Không được bỏ trống Private
                                                    Key
                                                </p>
                                            )}
                                            <label htmlFor="">
                                                Certificate chain
                                            </label>

                                            <Input
                                                {...register(
                                                    "certificate_chain"
                                                )}
                                                placeholder="Nhập Certìicate chain"
                                                variant="bordered"
                                                radius="none"
                                            />
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="primary"
                                            radius="sm"
                                            isLoading={isLoading}
                                        >
                                            Lưu
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ModalCreateCertificate;
