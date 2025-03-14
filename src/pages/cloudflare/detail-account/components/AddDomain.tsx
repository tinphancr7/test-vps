/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { TbExternalLink } from "react-icons/tb";
import cloudflareApis from "@/apis/cloudflare-api";
import teamApi from "@/apis/team.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { resetModal } from "@/stores/slices/modal-slice";
import showToast from "@/utils/toast";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
  Input,
} from "@heroui/react";

const initPropsAutoComplete = {
  classNames: {
    inputWrapper:
      "group-data-[open=true]:border-primary border-slate-400 border group-data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
    input: "font-normal text-foreground-500",
    label: "text-dark font-medium",
  },
};

const AddDomain = ({ fetch }: { fetch: () => void }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState("");
  const [name, setName] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    team?: string;
    account?: string;
  }>({});
  const fetchAccounts = async (teamId: string) => {
    if (!teamId) return;
    try {
      const response = await cloudflareApis.getListAccountFollowTeamId(teamId);
      console.log("response?.data?.data: ", response?.data?.data);
      setAccounts(response?.data?.data || []);
    } catch (error: any) {
      showToast("Không thể lấy danh sách tài khoản.", "error");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const teamResponse = await teamApi.callFetchYourTeamNoneAuth({
        search: "",
        page: 1,
        limit: 100,
      });
      const teamData = teamResponse?.data?.data?.result || [];
      const userTeams = user?.team || [];

      const teams =
        user?.role?.name?.toLowerCase() === "leader"
          ? teamData.filter((team: any) => userTeams.includes(team._id))
          : teamData;
      setTeams(teams);
    };

    fetchData();
  }, []);

  const validate = () => {
    const newErrors: { name?: string; team?: string; account?: string } = {};

    if (!name.trim()) newErrors.name = "Domain không được để trống.";
    if (!team) newErrors.team = "Vui lòng chọn một team.";
    if (!selectedAccount) newErrors.account = "Vui lòng chọn một tài khoản.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const response = await cloudflareApis.createCloudflareWebSite({
        team,
        name: name?.trim(),
        accountId: selectedAccount,
      });

      if (response?.data?.status === 1) {
        fetch();
        dispatch(resetModal());
        showToast("Tạo website thành công!", "success");
      }
    } catch (error: any) {
      const message = "Website không tồn tại hoặc có lỗi vui lòng thử lại sau!";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex items-center gap-x-20 py-10">
      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-[22px]">
          Tăng tốc độ và bảo mật trang web của bạn
        </h2>
        <p className="text-gray-500">
          Kết nối miền của bạn để bắt đầu gửi lưu lượng truy cập web thông qua
          Cloudflare.
        </p>
        <a
          href="https://developers.cloudflare.com/learning-paths/get-started/#live_website"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 text-primary-500 text-base underline underline-offset-4 flex gap-1 items-center"
        >
          Thực hiện theo lộ trình học tập có hướng dẫn của chúng tôi
          <TbExternalLink className="w-4 h-4" />
        </a>

        <Input
          radius="sm"
          color="primary"
          variant="bordered"
          labelPlacement="outside"
          classNames={{
            inputWrapper:
              "h-10 data-[hover=true]:border-primary border border-slate-400",
            label: "text-dark font-medium",
          }}
          type="text"
          label="Nhập domain hiện có"
          placeholder="example.com"
          value={name}
          onValueChange={setName}
          isInvalid={!!errors.name}
          errorMessage={errors.name}
        />
        <div className="">
          <Autocomplete
            defaultItems={teams}
            placeholder="Hãy chọn 1 team"
            radius="sm"
            classNames={{}}
            variant="bordered"
            value={team}
            label="Chọn team"
            labelPlacement="outside"
            inputProps={initPropsAutoComplete}
            selectedKey={team}
            onSelectionChange={(keys: any) => {
              setTeam(keys);
              fetchAccounts(keys);
              setSelectedAccount("");
            }}
            isInvalid={!!errors.team}
            errorMessage={errors.team}
          >
            {(item: any) => (
              <AutocompleteItem key={item?._id}>{item?.name}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <div className="mt-3">
          <Autocomplete
            isDisabled={!team}
            defaultItems={accounts}
            placeholder="Hãy chọn 1 tài khoản"
            radius="sm"
            classNames={{}}
            variant="bordered"
            value={selectedAccount}
            label="Chọn tài khoản"
            labelPlacement="outside"
            inputProps={initPropsAutoComplete}
            selectedKey={selectedAccount}
            onSelectionChange={(keys: any) => setSelectedAccount(keys)}
            isInvalid={!!errors.account}
            errorMessage={errors.account}
          >
            {(item: any) => (
              <AutocompleteItem key={item?.id}>{item?.name}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <div className="w-full mt-3">
          <Button
            variant="solid"
            className={`float-right px-7 bg-primaryDf text-light rounded-md text-base font-medium h-9 max-md:text-sm`}
            isLoading={isSubmitting}
            onPress={onSubmit}
          >
            Tiếp tục
          </Button>
        </div>
      </div>

      <Image src="/icons/add-domain.svg" />
    </div>
  );
};

export default AddDomain;
