import { cn } from "@/utils";
import { Input, InputProps } from "@heroui/react";

interface CustomTextFieldProps extends Partial<InputProps> {
  label?: string;
  isRequired?: boolean;
  classNames?: {
    trigger?: string;
    label?: string;
    base?: string;
    inputWrapper?: string;
    input?: string;
    [key: string]: string | undefined;
  };
}

const CustomTextField = ({
  classNames = {},
  label = "",
  isRequired = false,
  ...rests
}: CustomTextFieldProps) => {
  return (
    <div>
      {label && (
        <label htmlFor="" className="text-sm inline-block font-bold mb-1.5">
          {isRequired ? (
            <>
              {label} <span className="text-red-500">*</span>
            </>
          ) : (
            <>{label}</>
          )}
        </label>
      )}
      <Input
        labelPlacement="outside"
        {...rests}
        variant="bordered"
        classNames={{
          base: "!mt-0",
          inputWrapper: cn(
            "focus-primary flex h-10 w-full rounded-md border  bg-white px-3 text-sm font-medium outline-none transition-all focus:bg-white focus:!border-primary ",
            classNames.inputWrapper,
          ),
          input: "w-full h-full",
          label: "font-bold",
        }}
      />
    </div>
  );
};

export default CustomTextField;
