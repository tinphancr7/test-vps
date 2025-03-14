/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import teamApi from "@/apis/team.api";
import vpsOrtherApis from "@/apis/vps-orther.api";
import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import CustomModal from "@/components/modal/CustomModal";
import NotifyMessage from "@/utils/notify";
import { vpsOrtherSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import otherProviderApis from "@/apis/other-provider";

const ModalAddVps = ({
  isOpen,
  onClose,
  onOpenChange,
  reloadTable,
  dataInit,
  setDataInit,
}: any) => {
  const listStatus = [
    { label: "Pending", value: "Pending" },
    { label: "Active", value: "Active" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Terminated", value: "Terminated" },
    { label: "Suspended", value: "Suspended" },
  ];

  useEffect(() => {
    if (dataInit) {
      dataInit.domain && setValue("domain", dataInit.domain);
      dataInit.price && setValue("price", dataInit.price);
      dataInit.core && setValue("core", dataInit.core);
      dataInit.disk_limit && setValue("disk_limit", dataInit.disk_limit);
      dataInit.expires &&
        setValue(
          "expires",
          parseDate(moment(dataInit.expires)?.format("YYYY-MM-DD")) as any
        );
      dataInit.guaranteed_ram &&
        setValue("guaranteed_ram", dataInit.guaranteed_ram);
      dataInit.ip && setValue("ip", dataInit.ip);

      dataInit.os && setValue("os", dataInit.os);
      dataInit.password && setValue("password", dataInit.password);
      dataInit.passWorkAaPanel &&
        setValue("passWorkAaPanel", dataInit.passWorkAaPanel);
      dataInit.status &&
        setValue("status", {
          value: dataInit.status,
          label: dataInit.status,
        } as any);
      if (dataInit.team) {
        setValue("team", {
          value: dataInit.team._id,
          label: dataInit.team.name,
        } as any);
      }
      if (dataInit.provider) {
        setValue("provider", {
          value: dataInit.provider._id,
          label: dataInit.provider.name,
        } as any);
      }
      dataInit.mail && setValue("mail", dataInit.mail);
      dataInit.uRLAaPanel && setValue("uRLAaPanel", dataInit.uRLAaPanel);
      dataInit.userAaPanel && setValue("userAaPanel", dataInit.userAaPanel);
      dataInit.username && setValue("username", dataInit.username);
    }
  }, [dataInit]);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      domain: "",
      ip: "",
      os: "",
      team: null,
      status: null,
      username: "",
      password: "",
      userAaPanel: "",
      passWorkAaPanel: "",
      uRLAaPanel: "",
      guaranteed_ram: "",
      core: "",
      disk_limit: "",
      expires: null,
      provider: null,
      mail: "",
      price: "",
    },
    resolver: yupResolver(vpsOrtherSchema as any),
  });

  const loadOptionsTeam = async (
    searchQuery: string,
    _loadedOptions: any,
    { page }: any
  ) => {
    const res = await teamApi.callFetchTeamNoneAuth({
      search: searchQuery,
      page: page,
      limit: 10,
    });

    const items = [];

    if (res?.data?.data?.result) {
      const convertData =
        res?.data?.data?.result?.map((item: any) => ({
          label: item?.name,
          value: item?._id,
        })) || [];

      items.push(...convertData);
    }

    const isLoadMore =
      res?.data?.data?.meta?.totalPages &&
      res?.data?.data?.meta?.totalPages > page
        ? true
        : false;

    return {
      options: items,
      hasMore: isLoadMore,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };

  const [providers, setProviders] = useState([]);
  const [mails, setMails] = useState([]);

  useEffect(() => {
    setMails(
      (
        providers?.find((prod: any) => {
          return (watch("provider") as any)?.value === prod?.value;
        }) as any
      )?.mails || []
    );
  }, [watch("provider")]);

  useEffect(() => {
    if (providers.length === 0) loadOptionsProvider();
  }, [providers]);

  const loadOptionsProvider = async () => {
    const res = await otherProviderApis.getAll();
    const items = res?.data?.data.map((item: any) => ({
      label: item?.name,
      value: item?._id,
      mails: item?.mails || [],
    }));

    setProviders(items);
  };

  const listData = [
    {
      label: "Tên VPS",
      name: "domain",
      kind: "input",
      placeholder: "Nhập tên VPS",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Core",
      name: "core",
      kind: "input",
      placeholder: "Nhập số core",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Dung lượng đĩa",
      name: "disk_limit",
      kind: "input",
      placeholder: "Nhập dung lượng đĩa (GB)",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Ngày hết hạn",
      name: "expires",
      kind: "datePicker",
      placeholder: "Chọn ngày hết hạn",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "RAM",
      name: "guaranteed_ram",
      kind: "input",
      placeholder: "Nhập dung lượng RAM (GB)",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Giá tiền ($)",
      name: "price",
      kind: "input",
      placeholder: "Nhập giá tiền (đơn vị $)",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Địa chỉ IP",
      name: "ip",
      kind: "input",
      placeholder: "Nhập địa chỉ IP",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Hệ điều hành",
      name: "os",
      kind: "input",
      placeholder: "Nhập hệ điều hành",
      width: "col-span-6",
      isRequired: true,
    },
    {
      label: "Tên đăng nhập",
      name: "username",
      kind: "input",
      placeholder: "Nhập tên đăng nhập",
      width: "col-span-6",
      isRequired: false,
    },
    {
      label: "Mật khẩu",
      name: "password",
      kind: "password",
      placeholder: "Nhập mật khẩu",
      width: "col-span-6",
      isRequired: false,
    },
    {
      label: "Tài khoản aaPanel",
      name: "userAaPanel",
      kind: "input",
      placeholder: "Nhập tài khoản aaPanel",
      width: "col-span-6",
      isRequired: false,
    },
    {
      label: "Mật khẩu aaPanel",
      name: "passWorkAaPanel",
      kind: "password",
      placeholder: "Nhập mật khẩu aaPanel",
      width: "col-span-6",
      isRequired: false,
    },
    {
      label: "Trạng thái",
      name: "status",
      kind: "multiSelect",
      width: "col-span-6",
      isRequired: true,
      isMulti: false,
      options: listStatus,
    },
    {
      label: "Team",
      name: "team",
      kind: "multiSelect",
      width: "col-span-6",
      isRequired: true,
      isMulti: false,
      loadOptions: loadOptionsTeam,
    },
    {
      label: "Nhà cung cấp",
      name: "provider",
      kind: "multiSelect",
      width: "col-span-6",
      isRequired: true,
      isMulti: false,
      options: providers,
    },
    {
      label: "Mail",
      name: "mail",
      kind: "select",
      width: "col-span-6",
      placeholder: "chọn mail",
      isRequired: false,
      isMulti: false,
      children: (
        <>
          {mails.map((mail) => (
            <option className="text-base mt-1" value={mail} key={mail}>
              {mail}
            </option>
          ))}
        </>
      ),
    },
    {
      label: "URL aaPanel",
      name: "uRLAaPanel",
      kind: "input",
      placeholder: "Nhập URL aaPanel",
      width: "col-span-6",
      isRequired: false,
    },
  ];

  const resetForm = () => {
    onClose();
    setDataInit(null);
    reset();
  };
  const onSubmit = handleSubmit(async (values: any) => {
    const body = {
      ...values,
      team: values?.team?.value,
      os: values?.os,
      status: values?.status?.value,
      core: values?.core?.toString(),
      disk_limit: values?.disk_limit?.toString(),
      guaranteed_ram: values?.guaranteed_ram?.toString(),
      provider: values?.provider?.value,
    };
    const isUpdate = !!dataInit?._id;
    const action = isUpdate
      ? vpsOrtherApis.updateVps(body, dataInit?._id)
      : vpsOrtherApis.createNewVps(body);

    const successMessage = isUpdate
      ? "Cập nhật VPS thành công"
      : "Thêm mới VPS thành công";
    const errorMessage = isUpdate
      ? "Cập nhật VPS không thành công"
      : "Thêm mới VPS không thành công";

    try {
      const res = await action;
      if (res?.data) {
        toast.success(successMessage);
        resetForm();
        reloadTable();
      } else {
        NotifyMessage(errorMessage, "error");
      }
    } catch (error: any) {
      NotifyMessage(error?.message || errorMessage, "error");
    }
  });
  return (
    <CustomModal
      title={dataInit ? "Cập nhật Vps " : "Tạo mới Vps"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      resetForm={resetForm}
    >
      <div className="grid grid-cols-12 gap-4">
        {listData.map((item, index) => (
          <div key={index} className={item?.width}>
            <RenderFormData item={item} control={control} errors={errors} />
          </div>
        ))}
      </div>
    </CustomModal>
  );
};
export default ModalAddVps;
