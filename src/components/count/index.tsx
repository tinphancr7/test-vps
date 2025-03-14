import { Button, Input } from "@heroui/react";
import { FaMinus, FaPlus } from "react-icons/fa";

interface CountProps {
    value: number;
    setValue: (value: number) => void;
    max?: number;
    min?: number;
}

function Count({ value, setValue, max, min = 0 }: CountProps) {
    const handleChangeValue = (value: string) => {
        let payload = value;

        // Remove any non-numeric characters
        payload = payload.replace(/\D/g, "");

        // Remove leading zeros
        payload = payload.replace(/^0+/, "");

        if (min && Number(payload) < min) {
            payload = String(min);
        }

        if (max && Number(payload) > max) {
            payload = String(max);
        }

        setValue(Number(payload));
    };

    const handleDecrease = () => {
        if (Number(value) > min) {
            setValue(Number(value) - 1);
        }
    };

    const handleIncrease = () => {
        if (max && Number(value) === max) return;

        setValue(Number(value) + 1);
    };

    return (
        <Input
            color="primary"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
                base: "max-w-40",
                inputWrapper:
                    "h-8 min-h-8 data-[hover=true]:border-primary border px-0 rounded-md",
                input: "ip-number text-center text-base font-medium",
                label: "text-dark font-medium",
            }}
            type={"text"}
            value={String(value)}
            onValueChange={handleChangeValue}
            startContent={
                <Button
                    variant="solid"
                    radius="none"
                    color="danger"
                    className={`min-w-0 w-max px-3 h-full min-h-max rounded-tl-md rounded-bl-md`}
                    onPress={handleDecrease}
                >
                    <FaMinus className="min-w-max text-base w-3 h-3" />
                </Button>
            }
            endContent={
                <Button
                    variant="solid"
                    radius="none"
                    color="primary"
                    className={`min-w-0 w-max px-3 h-full min-h-max rounded-tr-md rounded-br-md`}
                    onPress={handleIncrease}
                >
                    <FaPlus className="min-w-max text-base w-3 h-3" />
                </Button>
            }
        />
    );
}

export default Count;
