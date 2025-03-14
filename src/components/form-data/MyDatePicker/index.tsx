import { twMerge } from "tailwind-merge";
import { useController } from "react-hook-form";
import { DatePicker } from "@heroui/react";

const MyDatePicker = ({
  control,
  errorMessage,
  className,
  isRequired = false,
  horizontal = false,
  ...props
}: any) => {
  const { field } = useController({
    name: props.name || "",
    control,
    defaultValue: null,
  });

  return (
    <div className={`${horizontal ? "items-center gap-1" : "flex-col"} flex`}>
      <label
        htmlFor={props.id || props.name}
        className="mb-2 text-sm text-black flex items-center gap-1 font-semibold"
      >
        {props.label} {horizontal && <>:</>}
        {isRequired && <span className="text-red-500 font-normal">*</span>}
      </label>
      <div className="flex-1">
        <DatePicker
          value={field.value}
          onChange={(date) => field.onChange(date)}
          id="nextui-date-range-picker"
          classNames={{
            label: "!text-sm",
            input: "!text-sm",
            timeInputLabel: "!text-sm",
            inputWrapper: "!text-sm",
            timeInput: "!text-sm",
            calendar: "!text-sm",
            calendarContent: "!text-sm",
            base: "!text-sm",
            description: "!text-sm",
            errorMessage: "!text-sm",
            helperWrapper: "!text-sm",
            innerWrapper: "!text-sm",
            popoverContent: "!text-sm",
            segment: "!text-sm",
            selectorButton: "!text-sm",
            selectorIcon: "!text-sm",
          }}
          className={twMerge(
            "bg-white rounded-lg border-gray-300 bg-transparent w-fulltext-xs !text-sm font-light border focus:border-none outline-blue-500",
            className
          )}
        />
      </div>
      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default MyDatePicker;
