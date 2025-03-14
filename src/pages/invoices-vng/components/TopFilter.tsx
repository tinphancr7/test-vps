import teamApi from "@/apis/team.api";
import MyCurrencyInput from "@/components/form-data/currency-input";
import MyDateRangePicker from "@/components/form-data/my-date-range-picker";

import { useAppSelector } from "@/stores";

import { Autocomplete, AutocompleteItem, Button, Divider } from "@heroui/react";
import { useEffect, useState } from "react";

import { BiFilter } from "react-icons/bi";
import { IoIosRefresh } from "react-icons/io";

interface IProps {
  topFilter: any;
  onChangeTopFilter: (key: any, value: any) => void;
  onClearTopFilter?: () => void;
  onClickTopFilter: () => void;
}
const TopFilter = ({
  topFilter,
  onChangeTopFilter,
  onClearTopFilter,
  onClickTopFilter,
}: IProps) => {
  const [teams, setTeams] = useState([]);
  const { user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchData = async () => {
      // Fetch providers and teams in parallel
      const teamResponse = await teamApi.callFetchYourTeamNoneAuth({
        search: "",
        page: 1,
        limit: 100,
      });

      const teamData = teamResponse?.data?.data?.result || [];
      const userTeams = user?.team || [];

      // Filter out teams that the user is not in
      const teams =
        user?.role?.name?.toLowerCase() === "leader"
          ? teamData.filter((team: any) => userTeams.includes(team._id))
          : teamData;

      setTeams(teams);
    };

    fetchData();
  }, [user]);
  return (
    <>
      <div className="flex items-center  gap-10">
        <div className="flex items-center w-full gap-10">
          <div className="w-1/3">
            <label htmlFor="" className="inline-block pb-1">
              Team :
            </label>
            <Autocomplete
              defaultItems={teams}
              placeholder="Team"
              radius="sm"
              variant="bordered"
              value={topFilter?.team}
              selectedKey={topFilter?.team}
              onSelectionChange={(keys) => {
                onChangeTopFilter("team", keys);
              }}
            >
              {(item: any) => (
                <AutocompleteItem key={item?._id}>
                  {item?.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
          <div className="w-1/3">
            <label htmlFor="" className="inline-block pb-1">
              Thời gian thực hiện :
            </label>
            <MyDateRangePicker
              value={topFilter?.time}
              name="time"
              onChangeSelect={onChangeTopFilter}
            />
          </div>

          <div className="w-1/3">
            <div className="flex items-center  gap-5">
              <div className="flex flex-col ">
                <label htmlFor="" className="inline-block pb-1">
                  Từ :
                </label>
                <MyCurrencyInput
                  className="h-10"
                  name="from"
                  value={topFilter?.from}
                  onChange={onChangeTopFilter}
                />
              </div>
              <span className="pt-5">-</span>
              <div className="flex flex-col ">
                <label htmlFor="" className="inline-block pb-1">
                  Đến :
                </label>
                <MyCurrencyInput
                  className="h-10"
                  name="to"
                  value={topFilter?.to}
                  onChange={onChangeTopFilter}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-7 cursor-pointer">
          <Button
            startContent={<BiFilter size={20} />}
            className="bg-primary text-white"
            onClick={onClickTopFilter}
          >
            Lọc
          </Button>
          <div className="cursor-pointer" onClick={onClearTopFilter}>
            <IoIosRefresh size={20} />
          </div>
        </div>
      </div>
      <Divider className="my-2.5" />
    </>
  );
};

export default TopFilter;
