import teamApi from "@/apis/team.api";
import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataLBNameDigitalOcean } from "@/stores/slices/digital-ocean-slice/load-balancer/digital-ocean-name-load-balancer.slice";
import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

function NameLoadBalancer() {
  const dispatch = useAppDispatch();
  const { nameLoadBalancer, isValidName } = useAppSelector(
    (state) => state.digitalOceanNameLoadBalancer
  );

  const regexName = /^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])$/;

  const handleChangeInputName = (e: any) => {
    dispatch(
      setDataLBNameDigitalOcean({
        nameLoadBalancer: e?.target?.value,
        isValidName: false,
      })
    );

    if (regexName.test(e?.target?.value)) {
      dispatch(
        setDataLBNameDigitalOcean({
          nameLoadBalancer: e?.target?.value,
          isValidName: true,
        })
      );
    }
  };
  const [listTeam, setListTeam] = useState<any>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>({});
  const getAllYourTeam = async () => {
    const getTeam = await teamApi.getAllYourTeam();
    setListTeam(getTeam?.data);
    setSelectedTeam(getTeam?.data?.data[0]);
    //lỏ-ngu-by-tnt
    dispatch(
      setDataLBNameDigitalOcean({ team_id: getTeam?.data?.data[0]?._id })
    );
  };
  const infoTeam: any = {
    teamId: selectedTeam?._id,
    teamName: selectedTeam?.name,
  };
  const handleChangeTeam = (value: any) => {
    const data = listTeam?.data.filter((item: any) => {
      return item?._id === [...value][0];
    });
    setSelectedTeam(data[0]);
  };
  useEffect(() => {
    getAllYourTeam();
  }, []);

  useEffect(() => {
    dispatch(
      setDataLBNameDigitalOcean({
        nameLoadBalancer: "",
        isValidName: false,
      })
    );
  }, []);
  return (
    <div className="my-10 ">
      <div className="flex gap-4 flex-col lg:flex-row mt-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2">
            <p>Chọn Team để tạo</p>
            <Select
              className="max-w-xs"
              radius="none"
              variant="bordered"
              aria-label="datacenter"
              selectedKeys={new Set([infoTeam.teamId])}
              onSelectionChange={(value: any) => {
                handleChangeTeam(value);
                //lỏ-ngu-by-tnt
                dispatch(
                  setDataLBNameDigitalOcean({
                    team_id: [...value][0],
                  })
                );
              }}
              disallowEmptySelection={true}
              popoverProps={{
                classNames: {
                  base: "p-0",
                  content: "rounded-none p-0",
                },
              }}
              listboxProps={{
                className: "p-0",
                itemClasses: {
                  base: " rounded-none",
                },
              }}
              classNames={{
                trigger: "border",
              }}
            >
              {(listTeam?.data || [])?.map((item: any) => (
                <SelectItem key={item?._id} textValue={`${item?.name}`}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            <p className="text-[#031b4e] font-semibold">
              Nhập Tên Load Balancer
            </p>
            <Input
              radius="none"
              variant="bordered"
              endContent={<span className="text-[red] ">*</span>}
              placeholder="Nhập Tên Load Balancer"
              value={nameLoadBalancer}
              onChange={handleChangeInputName}
              isInvalid={!isValidName}
              errorMessage="Tên Load Balancer không hợp lệ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NameLoadBalancer;
