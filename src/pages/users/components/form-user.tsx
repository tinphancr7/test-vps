import { useEffect } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { initialFormCreate, initialFormUpdate } from "./constants";
import useForm from "@/hooks/use-form";
import { validateEmail } from "@/utils/validation-email";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import {
  asyncThunkCreateNewUser,
  asyncThunkUpdateUser,
} from "@/stores/async-thunks/user-thunk";
import { asyncThunkGetAllRoles } from "@/stores/async-thunks/role-thunk";
import { UserSchema } from "@/interfaces/user-schema";
import userApis from "@/apis/user-api";
import { TeamSchema } from "@/interfaces/team-schema";
import { fetchTeam } from "@/stores/async-thunks/team-thunk";
import CreatableSelect from "react-select/creatable";
interface FormUser {
  isEdit: boolean;
  isRead?: boolean;
  user?: UserSchema;
}

function FormUser({ isEdit = false, isRead = false, user }: FormUser) {
  const {
    isEmptyValues,
    initialState,
    getValues,
    getState,
    setErrorMessage,
    setType,
    setValue,
    getValue,
    validateForm,
    setOptions,
  } = useForm(isEdit || isRead ? initialFormUpdate : initialFormCreate);

  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.users);
  const { roles } = useAppSelector((state) => state.roles);

  const handleGetUserInfo = async () => {
    try {
      const { data } = await userApis.getUserById(user?._id as string);

      if (data) {
        const teamIds = data?.teams?.map((it: TeamSchema) => it?._id as string);

        setValue("username", data?.username);
        setValue("name", data?.name);
        setValue("email", data?.email);
        setValue("role", data?.role?._id);
        setValue("teams", new Set(teamIds));
        setValue("listIp", data?.listIp || []);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const isValidIP = (ip: string) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/;

    const ipv6Regex =
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]))$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const handleListIpChange = (newValues: any) => {
    console.log("newValues: ", newValues);
    const invalidIps = newValues.filter((item: any) => !isValidIP(item.value));
    if (invalidIps.length > 0) {
      setErrorMessage("listIp", "Địa chỉ IP không hợp lệ!");
      return;
    }

    setValue(
      "listIp",
      newValues.map((item: any) => item.value)
    );
    setErrorMessage("listIp", "");
  };

  useEffect(() => {
    dispatch(asyncThunkGetAllRoles());

    (async () => {
      const { data } = await dispatch(
        fetchTeam({
          limit: 100,
        })
      ).unwrap();

      if (data?.result) {
        setOptions("teams", data?.result);
      }
    })();

    if (isEdit || isRead) {
      handleGetUserInfo();
    }
  }, []);

  const handleValueChange = (key: string, value: any) => {
    setValue(key, value);
    setErrorMessage(key, value && "");
  };

  const handleTypeInputChange = (key: string, type: string) => {
    setType(key, type === "text" ? "password" : "text");
  };

  const renderEndContent = (key: string, type: string) => {
    if (key === "password") {
      return (
        <span
          className="cursor-pointer"
          onClick={() => handleTypeInputChange(key, type)}>
          {type === "password" ? (
            <IoIosEyeOff className="text-base" />
          ) : (
            <IoIosEye className="text-base" />
          )}
        </span>
      );
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!isEdit) {
      const { status } = await dispatch(
        asyncThunkCreateNewUser({
          ...getValues(),
          teams: [...getValue("teams")],
          listIp: [...(getValue("listIp") || [])],
        })
      ).unwrap();

      return status || null;
    }

    const { status } = await dispatch(
      asyncThunkUpdateUser({
        id: user?._id,
        payload: {
          ...getValues(),
          teams: [...getValue("teams")],
        },
      })
    ).unwrap();

    return status || null;
  };

  const onSubmit = async () => {
    if (isEmptyValues) {
      return validateForm();
    }

    if (!validateEmail(getValue("email"))) {
      setErrorMessage("email", "Email không hợp lệ!");
      return;
    }

    setErrorMessage("email", "");

    try {
      const status = await handleSubmit();

      if (status === 1) {
        dispatch(resetModal());
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="h-full relative flex flex-col justify-between overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {Object.keys(initialState).map((key, index) => {
          if (key === "listIp")
            return (
              <div className="col-span-6 gap-1 mb-10">
                <label className="block text-[13px] font-medium text-black mb-1">
                  Danh sách IP
                </label>
                <CreatableSelect
                  isMulti
                  value={getValue("listIp")?.map((id: any) => ({
                    value: id,
                    label: id,
                  }))}
                  onChange={handleListIpChange}
                  placeholder="Nhập danh sách IP để xét duyệt đăng nhập..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontSize: "12px",
                      minHeight: "30px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontSize: "12px",
                      color: "#a0aec0",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      fontSize: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "2px 8px",
                      fontSize: "12px",
                    }),
                    input: (base) => ({
                      ...base,
                      fontSize: "12px",
                    }),
                    menu: (base) => ({
                      ...base,
                      fontSize: "12px",
                    }),
                  }}
                />
                {getState("listIp")?.errorMessage && (
                  <p className="text-red-500 text-sm mt-1">
                    {getState("listIp").errorMessage}
                  </p>
                )}
              </div>
            );
          if (["text", "password"].includes(getState(key).type as string))
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
                endContent={renderEndContent(key, getState(key).type as string)}
                errorMessage={getState(key).errorMessage}
                isInvalid={!!getState(key).errorMessage}
                onKeyDown={(event) => event.key === "Enter" && onSubmit()}
                isDisabled={isRead}
              />
            );
          if (["select"].includes(getState(key).type as string))
            return (
              <Select
                key={index}
                labelPlacement="outside"
                label={getState(key).label}
                items={getState(key)?.options || []}
                selectionMode="multiple"
                placeholder={getState(key)?.label}
                classNames={{
                  base: "w-full",
                  label: "text-dark font-medium",
                  trigger:
                    "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                }}
                selectedKeys={getValue(key)}
                onSelectionChange={(value) => handleValueChange(key, value)}
                renderValue={(items) => {
                  const textValue = items.map((e) => e.textValue);
                  return <span>{textValue.join(", ")}</span>;
                }}
                isDisabled={isRead}>
                {(getState(key)?.options as Array<any>).map((team) => (
                  <SelectItem
                    key={team?._id || team.value}
                    textValue={team?.name || team.value}>
                    {team?.name || team?.label}
                  </SelectItem>
                ))}
              </Select>
            );
          return (
            <Autocomplete
              key={index}
              errorMessage={getState(key).errorMessage}
              isInvalid={!!getState(key).errorMessage}
              aria-label={getState(key).label}
              fullWidth
              defaultItems={roles || []}
              labelPlacement="outside"
              label={getState(key).label}
              placeholder={getState(key).label}
              radius="sm"
              variant="bordered"
              selectedKey={getValue(key)}
              inputProps={{
                classNames: {
                  label: "text-dark font-medium",
                  inputWrapper:
                    "border border-slate-400 group-data-[open=true]:border-primary group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
                },
              }}
              onSelectionChange={(value) => handleValueChange(key, value)}
              isDisabled={isRead}>
              {(item: any) => (
                <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
          );
        })}
      </div>

      <ModalFooter className="px-2 sticky bottom-0 border-t gap-4">
        <Button
          variant="solid"
          color="danger"
          className={`rounded-md text-base font-medium h-9 max-md:text-sm`}
          onPress={() => dispatch(resetModal())}>
          Hủy
        </Button>
        {!isRead && (
          <Button
            variant="solid"
            className={`bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
            isLoading={isSubmitting}
            onPress={onSubmit}>
            Xác nhận
          </Button>
        )}
      </ModalFooter>
    </div>
  );
}

export default FormUser;
