import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useController } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const MyPasswordInput = ({
  control,
  errorMessage,
  className,
  isRequired = false,
  horizontal = false,

  IconComp = false,
  ...props
}: any) => {
  const { field } = useController({
    name: props.name || "",
    control,
    defaultValue: "",
  });

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`${horizontal ? "items-center gap-1" : "flex-col"} flex`}>
      <label
        htmlFor={props.id || props.name}
        className="mb-2 text-sm text-black flex items-center gap-1 font-semibold"
      >
        {props.label} {horizontal && <>:</>}
        {isRequired && <span className="text-red-500 font-normal">*</span>}
      </label>

      {IconComp ? (
        <div className="flex-1 flex items-center border rounded-lg py-0.5">
          <input
            {...field}
            {...props}
            type={isPasswordVisible ? "text" : "password"}
            className={twMerge(
              "w-full px-2 text-sm outline-none border-none focus:bg-white-500",
              className
            )}
          />
          <div
            className="p-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {IconComp}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <input
            {...field}
            {...props}
            type={isPasswordVisible ? "text" : "password"}
            className={twMerge(
              "bg-white rounded-lg border-gray-300 w-full p-2 text-xs lg:text-sm font-light border focus:border-none outline-blue-500",
              className
            )}
          />
          <div
            className="opacity-70 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default MyPasswordInput;
