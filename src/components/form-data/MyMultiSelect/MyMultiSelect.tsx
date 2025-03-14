import { useController } from "react-hook-form";
import { AsyncPaginate } from "react-select-async-paginate";
import { twMerge } from "tailwind-merge";
const MyMultiSelect = ({
  control,
  errorMessage,
  className,
  isRequired = false,
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
        className="block  mb-2 text-sm font-semibold text-gray-900"
      >
        {props.label}
        {isRequired && <span className="text-red-500 font-normal">*</span>}
      </label>
      <div>
        <AsyncPaginate
          isMulti
          {...field}
          {...props}
          placeholder="--- Chọn ---"
          menuPosition="fixed"
          debounceTimeout={500}
          isSearchable={true}
          additional={{
            page: 1,
          }}
          styles={{
            control: (styles) => ({
              ...styles,
              borderColor: "#d1d5db",
              color: "red",
              borderRadius: "8px",
            }),
          }}
          className={twMerge(" text-xs lg:text-sm  font-light  ", className)}
        />
      </div>

      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default MyMultiSelect;
