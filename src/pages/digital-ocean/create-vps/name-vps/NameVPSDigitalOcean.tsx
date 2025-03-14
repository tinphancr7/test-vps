import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataNameVPSDigitalOcean } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-name.slice";
import { Input } from "@heroui/react";
import { useEffect } from "react";

function NameVPSDigitalOcean() {
    const dispatch = useAppDispatch();
    const { nameVPS, isValidName } = useAppSelector(
        (state) => state.digitalOceanNameVPS
    );
    //   const { setDataCreateDoplet, nameOfDroplet, isInvalidName } =
    //     useCreateDropletStore();

    const regexName = /^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])$/;
    /* 
  Only valid hostname characters are allowed. (a-z, A-Z, 0-9, . and -).
  Ký tự đầu: Có thể là chữ cái, số 
  Phần giữa: Có thể chứa bất kỳ số lượng ký tự nào gồm chữ cái, số, dấu chấm hoặc dấu gạch ngang.
  Ký tự cuối: Phải là chữ cái hoặc số.
 */
    useEffect(() => {
        dispatch(
            setDataNameVPSDigitalOcean({ nameVPS: "", isValidName: false })
        );
    }, []);

    const handleChangeInputName = (e: any) => {
        dispatch(
            setDataNameVPSDigitalOcean({
                nameVPS: e?.target?.value,
                isValidName: false,
            })
        );

        if (regexName.test(e?.target?.value)) {
            dispatch(
                setDataNameVPSDigitalOcean({
                    nameVPS: e?.target?.value,
                    isValidName: true,
                })
            );
        }
    };
    return (
        <div className="my-10 ">
            <div className="flex gap-4 flex-col lg:flex-row mt-4">
                <div className="flex flex-col gap-4 flex-1">
                    <div>
                        <p className="text-[#031b4e] font-semibold">
                            Nhập Tên VPS
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Input
                            radius="none"
                            variant="bordered"
                            endContent={<span className="text-[red] ">*</span>}
                            placeholder="Nhập Tên VPS"
                            value={nameVPS}
                            onChange={handleChangeInputName}
                            isInvalid={!isValidName}
                            errorMessage="Vui lòng chọn 1 tên VPS khác"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NameVPSDigitalOcean;
