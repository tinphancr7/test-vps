import { InitialState } from "@/interfaces/initial-state";
import { useCallback, useState } from "react";

function useForm(initialState: InitialState) {
  const [form, setForm] = useState<InitialState>(initialState);

  const handleChangeKeyOfState = useCallback(
    (key: string, keyField: string, value: any) => {
      setForm((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [keyField]: value,
        },
      }));
    },
    []
  );

  const getValues = () => {
    return Object.keys(form).reduce((values: InitialState, key: string) => {
      values[key] = form[key].value;
      return values;
    }, {});
  };

  const isEmptyValues = useCallback(() => {
    return Object.keys(form).some((key: string) => {
      if (form[key].isRequire && !form[key].value) {
        return true;
      }

      return false;
    });
  }, [form]);

  const validateForm = useCallback(() => {
    let hasErrors = false;

    Object.keys(form).forEach((key: string) => {
      if (!form[key].isRequire) return;

      const isEmpty = !form[key].value;
      const errorMessage = isEmpty
        ? form[key].emptyMessage || `${form[key].label} không được bỏ trống`
        : "";

      handleChangeKeyOfState(key, "errorMessage", errorMessage);

      if (isEmpty) {
        hasErrors = true;
      }
    });

    return hasErrors;
  }, [form, handleChangeKeyOfState]);

  return {
    isEmptyValues: isEmptyValues(),

    initialState: form,

    form,

    getValues,

    getState: (key: string) => form[key],

    getValue: (key: string) => form[key]?.value,

    setState: setForm,

    setValue: (key: string, value: any) =>
      handleChangeKeyOfState(key, "value", value),

    setType: (key: string, type: string) =>
      handleChangeKeyOfState(key, "type", type),

    setErrorMessage: (key: string, errorMessage: string) =>
      handleChangeKeyOfState(key, "errorMessage", errorMessage),

    setOptions: (key: string, options: Array<any>) =>
      handleChangeKeyOfState(key, "options", options),

    validateForm,
  };
}

export default useForm;