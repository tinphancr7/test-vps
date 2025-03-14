import { twMerge } from "tailwind-merge";
import { useController } from "react-hook-form";

const MySelect = ({
  control,
  errorMessage,
  className,
  isRequired = false,
  children,
  ...props
}: any) => {
  const { field } = useController({
    name: props.name || "",
    control,
    defaultValue: "",
  });

  return (
    <div className="">
      <label
        htmlFor={props.id || props.name}
        className="mb-2 text-sm font-semibold text-gray-900 flex items-center gap-1"
      >
        {props.label}
        {isRequired && <span className="text-red-500 font-normal">*</span>}
      </label>
      <select
        className={twMerge(
          "bg-white  border-gray-300 w-full p-2 py-2 min-h-[38px] text-xs outline-none lg:text-sm  font-light border rounded-md active:border-gray-300 focus-visible:!border-gray-300 focus:border-gray-300  text-black mb-1",
          className
        )}
        {...field}
        {...props}
      >
        <option value="" className="text-base mt-1">
          ---chọn---
        </option>

        {children}
      </select>

      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default MySelect;
