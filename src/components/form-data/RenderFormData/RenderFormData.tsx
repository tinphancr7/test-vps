import MyDatePicker from "../MyDatePicker";
import MyInput from "../MyInput/MyInput";
import MyMultiSelect from "../MyMultiSelect/MyMultiSelect";
import MyPasswordInput from "../MyPasswordInput";
import MySelect from "../MySelect/MySelect";
import MySwitch from "../MySwitch/MySwitch";
// import MySwitch from "../MySwitch/MySwitch";
import MyTextarea from "../MyTextarea/MyTextarea";
interface RenderFormDataProps {
  item: any;
  onChange?: any;
  control: any;
  errors: any;
}
const RenderFormData = ({
  item,
  onChange,
  control,
  errors,
}: RenderFormDataProps) => {
  const componentMap: { [key: string]: React.ComponentType<any> } = {
    input: MyInput,
    switch: MySwitch,
    select: MySelect,
    multiSelect: MyMultiSelect,
    textarea: MyTextarea,
    datePicker: MyDatePicker,
    password: MyPasswordInput,
  };

  const Component = componentMap[item?.kind];
  const children =
    (item?.kind === "switch" ||
      item?.kind === "select" ||
      item?.kind === "multiSelect") &&
    item.children;
  return (
    <Component
      {...item}
      control={control}
      name={item.name}
      type={item.type}
      onChangeData={onChange}
      horizontal={item.horizontal}
      isRequired={item?.isRequired}
      placeholder={item.placeholder}
      label={item.label}
      errorMessage={errors[item.name] ? errors[item.name].message : undefined}
      {...(children ? { children } : {})}
    />
  );
};
export default RenderFormData;
