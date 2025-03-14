import otherProviderApis, {
  PayloadCreateProvider,
} from "@/apis/other-provider";
import useForm from "@/hooks/use-form";
import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkPaginationProviders } from "@/stores/async-thunks/provider-thunk";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import { Button, Input, ModalFooter } from "@heroui/react";
import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
type FormProviderProp = {
  isEdit?: boolean;
  isRead?: boolean;
  provider?: any;
};

const formatPriceVND = (input: string) => {
  // Remove any non-numeric characters
  input = input.replace(/\D/g, "");

  // Remove leading zeros
  input = input.replace(/^0+/, "");

  // Add commas every 3 digits for thousands separator
  return input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getPriceByFormatPriceVND = (input: string) => {
  const formatPrice = input?.split(",")?.join("");
  return Number(formatPrice);
};

function FormProvider({ isEdit, isRead, provider }: FormProviderProp) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const tableProvider = useAppSelector((state) => state.table["provider"]);
  const { search } = useAppSelector((state) => state.provider);

  const {
    isEmptyValues,
    initialState,
    getState,
    setErrorMessage,
    setValue,
    getValue,
    validateForm,
  } = useForm({
    name: {
      label: "Tên nhà cung cấp",
      type: "text",
      value: "",
      errorMessage: "",
      isRequire: true,
    },
    exchange_rate: {
      label: "Tỷ giá",
      type: "text",
      value: "",
      errorMessage: "",
      isRequire: true,
    },
    mails: {
      label: "Mails",
      value: [],
      errorMessage: "",
      isRequire: true,
    },
  });

  const handleGetUserInfo = async () => {
    try {
      const { data } = await otherProviderApis.getById(provider?._id as string);

      if (data) {
        setValue("name", data?.data?.name);
        setValue(
          "exchange_rate",
          formatPriceVND(String(data?.data?.exchange_rate))
        );
        setValue("mails", data?.data?.mails);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (isEdit || isRead) {
      handleGetUserInfo();
    }
  }, []);

  const handleValueChange = (key: string, value: any) => {
    let payload = value;

    if (key === "exchange_rate") {
      payload = formatPriceVND(value);
    }

    setValue(key, payload);
    setErrorMessage(key, value && "");
  };

  const onSubmit = async () => {
    if (isEmptyValues) {
      return validateForm();
    }

    const payload: PayloadCreateProvider = {
      name: getValue("name"),
      exchange_rate: getPriceByFormatPriceVND(getValue("exchange_rate")),
      mails: getValue("mails"),
    };

    try {
      setIsSubmitting(true);

      if (isEdit) {
        const { data } = await otherProviderApis.update(provider?._id, payload);

        if (data?.statusCode === HttpStatusCode.Ok) {
          showToast("cập nhật nhà cung cấp thành công!", "success");
        }
      } else {
        const { data } = await otherProviderApis.create(payload);

        if (data?.statusCode === HttpStatusCode.Created) {
          showToast("Thêm nhà cung cấp thành công!", "success");
        }
      }

      const query: any = {};

      if (search !== undefined) {
        query.search = search;
      }

      if (tableProvider) {
        const cPageSize = tableProvider?.pageSize
          ? // eslint-disable-next-line no-unsafe-optional-chaining
            [...tableProvider?.pageSize][0]
          : 10;

        query.pageSize = Number(cPageSize);
        query.pageIndex = Number(tableProvider?.pageIndex) || 1;

        dispatch(asyncThunkPaginationProviders(query));
      }

      dispatch(resetModal());
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          `${isEdit ? "Cập nhật" : "Thêm"} nhà cung cấp thất bại!`,
        "error"
      );

      console.log("error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleMailChange = (newValues: any) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // const validEmails = newValues.filter((item: any) =>
    //   emailRegex.test(item.value)
    // );
    const validEmails = newValues.filter((item: any) => item.value);

    // const invalidEmails = newValues.filter(
    //   (item: any) => !emailRegex.test(item.value)
    // );

    // if (invalidEmails.length > 0) {
    //   showToast(
    //     `Email không hợp lệ: ${invalidEmails
    //       .map((item: any) => item.value)
    //       .join(", ")}`,
    //     "error"
    //   );
    // }

    setValue(
      "mails",
      validEmails.map((item: any) => item.value)
    );
  };

  return (
    <div className="h-full relative flex flex-col justify-between overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {Object.keys(initialState).map((key, index) => {
          if (key === "mails") return;
          return (
            <Input
              key={index}
              radius="sm"
              color="primary"
              variant="bordered"
              labelPlacement="outside"
              classNames={{
                inputWrapper:
                  "h-10 data-[hover=true]:border-primary border border-slate-400",
                label: "text-dark font-medium",
              }}
              type={getState(key).type}
              label={getState(key).label}
              placeholder={`${getState(key).label}`}
              value={getValue(key)}
              onValueChange={(value) => handleValueChange(key, value)}
              errorMessage={getState(key).errorMessage}
              isInvalid={!!getState(key).errorMessage}
              onKeyDown={(event) => event.key === "Enter" && onSubmit()}
              isDisabled={isRead}
            />
          );
        })}
        <div className="gap-1 flex flex-col px-0.5">
          <label className="block text-[15px] text-dark font-medium">
            Mails
          </label>
          <CreatableSelect
            isMulti
            value={getValue("mails")?.map((id: any) => ({
              value: id,
              label: id,
            }))}
            onChange={handleMailChange}
            placeholder="nhập mail"
            styles={{
              control: (base) => ({
                ...base,
                fontSize: "14px",
                minHeight: "30px",
              }),
              placeholder: (base) => ({
                ...base,
                fontSize: "14px",
                color: "#a0aec0",
              }),
              multiValue: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "2px 8px",
                fontSize: "14px",
              }),
              input: (base) => ({
                ...base,
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                fontSize: "14px",
              }),
            }}
          />
          {getState("mails")?.errorMessage && (
            <p className="text-red-500 text-sm mt-1">
              {getState("mails")?.errorMessage}
            </p>
          )}
        </div>
      </div>

      <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
        <Button
          variant="solid"
          color="danger"
          className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
          onPress={() => dispatch(resetModal())}
        >
          Hủy
        </Button>
        {!isRead && (
          <Button
            variant="solid"
            className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
            isLoading={isSubmitting}
            onPress={onSubmit}
          >
            Xác nhận
          </Button>
        )}
      </ModalFooter>
    </div>
  );
}

export default FormProvider;
