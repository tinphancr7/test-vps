import { twMerge } from "tailwind-merge";
import { useController } from "react-hook-form";

const MyInput = ({
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

  return (
    <div className={`${horizontal ? "items-center gap-1" : "flex-col"} flex  `}>
      <label
        htmlFor={props.id || props.name}
        className=" mb-2 text-sm  text-black flex items-center gap-1 font-semibold"
      >
        {props.label} {horizontal && <>:</>}
        {isRequired && <span className="text-red-500 font-normal">*</span>}
      </label>
      {IconComp ? (
        <div className="flex-1 flex items-center border rounded-lg py-0.5">
          <input
            {...field}
            {...props}
            className={twMerge(
              "w-full px-2 text-sm outline-none border-none focus:bg-white-500 ",
              className
            )}
          />
          <div className="p-2">{IconComp}</div>
        </div>
      ) : (
        <div className="flex-1">
          <input
            {...field}
            {...props}
            className={twMerge(
              "bg-white rounded-lg  border-gray-300 w-full p-2 text-xs lg:text-sm  font-light border  focus:border-none outline-blue-500",
              className
            )}
          />
        </div>
      )}

      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default MyInput;
