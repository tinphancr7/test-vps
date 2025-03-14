import teamApi from "@/apis/team.api";
import { AppDispatch } from "@/stores";
import { setInstance } from "@/stores/slices/vps-scaleway-slice";
import { Button, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const Team = () => {
  const [teams, setTeams] = useState([]);
  const { instance } = useSelector((state: any) => state?.scaleway);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchData = async () => {
      // Fetch providers and teams in parallel
      const teamResponse = await teamApi.callFetchTeam({
        search: "",
        page: 1,
        limit: 100,
      });

      const teamData = teamResponse?.data?.data?.result || [];
      if (teamData.length > 0) {
        dispatch(setInstance({ team: teamData[0]._id }));
      }
      setTeams(teamData);
    };

    fetchData();
  }, []);
  return (
    <div>
      <Select
        label=""
        variant={"bordered"}
        placeholder="--- Chọn ---"
        labelPlacement="outside"
        disableSelectorIconRotation
        selectedKeys={[instance?.team]}
        onChange={(e) => dispatch(setInstance({ team: e.target.value }))}
        classNames={{
          trigger: "border p-2 rounded-lg bg-white",
        }}
        startContent={
          instance?.team && (
            <Button
              className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
              variant="solid"
              color="danger"
              onPress={() => dispatch(setInstance({ team: "" }))}
            >
              <IoIosClose className="text-xl min-w-max" />
            </Button>
          )
        }
      >
        {teams.map((item: any) => (
          <SelectItem key={item?._id}>{item.name}</SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Team;
