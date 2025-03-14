import { Switch } from "@heroui/react";
import { useController, Control } from "react-hook-form";

interface MySwitchProps {
  control: Control;
  name: string;
  label?: string;
  className?: string;
  statusLabel?: string[];
  [key: string]: any;
  isRequired: boolean;
}

const MySwitch = ({
  control,
  name,
  label,
  className,
  statusLabel = ["Bật", "Tắt"],
  isRequired = false,
  ...props
}: MySwitchProps) => {
  const { field } = useController({
    name,
    control,
    defaultValue: false,
  });

  return (
    <div className="flex items-start gap-2 flex-col">
      <div className="flex items-center">
        {label && <label className="text-sm font-medium">{label}</label>}
        {isRequired && <span className="text-red-500 font-normal">*</span>}
      </div>
      <div className="flex gap-2 items-center">
        <Switch
          {...field}
          {...props}
          isSelected={field.value}
          onValueChange={field.onChange}
          className={className}
        />
        <p className="text-[13px]">
          {field.value ? statusLabel[0] : statusLabel[1]}
        </p>
      </div>
    </div>
  );
};

export default MySwitch;
