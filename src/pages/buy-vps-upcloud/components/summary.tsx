import { Server } from "@/interfaces/upcloud-response.interface";
import { RootState, useAppDispatch, useAppSelector } from "@/stores";

import { useEffect, useState } from "react";
import { Select, Selection, SelectItem, Spinner } from "@heroui/react";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { createServer } from "@/stores/async-thunks/up-cloud.thunk";
import { toast } from "react-toastify";
export default function UpCloudSummary() {
  const dispatch = useAppDispatch();
  const server = useAppSelector(
    (state: RootState) => state.upCloudServer.server
  );
  const core_number = useAppSelector(
    (state: RootState) => state.upCloudServer.core_number
  );
  const memory = useAppSelector(
    (state: RootState) => state.upCloudServer.memory
  );
  const serverName = useAppSelector(
    (state: RootState) => state.upCloudServer.serverName
  );
  const priceHourlyPlan = useAppSelector(
    (state: RootState) => state.upCloudServer.priceHourlyPlan
  );
  const licenseHourlyPlan = useAppSelector(
    (state: RootState) => state.upCloudServer.licenseHourlyPlan
  );
  const method = useAppSelector(
    (state: RootState) => state.upCloudServer.method
  );
  const isZoneSet = !!server.zone;
  const isPlanSet = !!server.plan;
  const isStorageSet = !!server.storage_devices?.storage_device[0]?.size;
  const isSSHKeySet = (server.login_user?.ssh_keys?.ssh_key?.length ?? 0) > 0;

  const isDeployable =
    isZoneSet && isPlanSet && isStorageSet && (method !== "ssh" || isSSHKeySet);

  const isDeploying = useAppSelector(
    (state: RootState) => state.upcloudCreateServer.loading
  );
  const { teams } = useAppSelector((state) => state.teams);
  const [teamId, setTeamId] = useState<Selection>(new Set([]));
  // const getBackupPlanName = (backupPlan: string) => {
  //   if (!backupPlan) return '-'
  //   const [_, suffix] = backupPlan.split(',')
  //   switch (suffix) {
  //     case 'dailies':
  //       return 'Day plan'
  //     case 'weeklies':
  //       return 'Week plan'
  //     case 'monthlies':
  //       return 'Month plan'
  //     case 'yearlies':
  //       return 'Year plan'
  //     default:
  //       return '-'
  //   }
  // }
  const handleOnDeloy = () => {
    const title =
      serverName?.split(" ")[0]?.toLowerCase() +
      "-" +
      server.plan?.toLowerCase() +
      "-" +
      server.zone;
    const body: Server = {
      ...server,
      title,
      hostname: title,
      storage_devices: {
        storage_device: [
          {
            ...server.storage_devices.storage_device[0],
            title: title + "  Device 1",
          },
        ],
      },
    };
    const [team] = [...teamId];
    if (!team) {
      toast.error("Vui Lòng chọn team!");
    }
    if (isDeployable && team) {
      dispatch(createServer({ ...body, teamId: team }));
    }
  };
  const currentDate = new Date();
  const daysInCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  useEffect(() => {
    (async () => {
      const fetchTeams = await dispatch(asyncThunkGetAllYourTeam()).unwrap();

      setTeamId(
        fetchTeams[0]?._id ? new Set([fetchTeams[0]?._id]) : new Set([])
      );
    })();

    return () => {};
  }, []);
  return (
    <div className="sticky top-3 flex w-full flex-col gap-2">
      <div className="w-full bg-up-cloud-primary px-4 py-3">
        <p className="text-[22px] font-medium text-white">Tổng quan dịch vụ</p>
      </div>
      <div className="relative flex w-full flex-col gap-4 px-3 pb-4 before:absolute before:bottom-0 before:left-[10%] before:right-[10%] before:border-[1px] before:border-gray-200">
        <div className="flex flex-col gap-2">
          <h5 className="text-sm font-bold uppercase">Khu vực</h5>
          <p className="text-sm">{server.zone || "-"}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-2">
            <h5 className="text-sm font-bold uppercase">CPU</h5>
            <p className="text-sm">{core_number || "-"}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="text-sm font-bold uppercase">Bộ nhớ</h5>
            <p className="text-sm">{memory ? `${memory / 1024} GB` : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="text-sm font-bold uppercase">Dung lượng</h5>
          <p className="text-sm">
            {" "}
            {server?.storage_devices?.storage_device[0]?.size
              ? `${server.storage_devices.storage_device[0].size} GB`
              : "-"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="text-sm font-bold uppercase">Hệ điều hành</h5>
          <p className="text-sm">{serverName || "-"}</p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1 px-3 py-4">
        <h5 className="text-sm font-bold uppercase">Tổng</h5>
        <div className="flex w-full items-center justify-between">
          <p className="text-[15px] font-bold">
            €
            {Math.ceil(
              (priceHourlyPlan || 0) * 28 * 24 +
                ((licenseHourlyPlan || 0) / 100) *
                  (core_number || 0) *
                  daysInCurrentMonth *
                  24
            )}
            .00
          </p>
          <p className="text-[14px] font-medium">tháng</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="text-[15px] font-bold">
            €
            {(
              (priceHourlyPlan || 0) +
              ((licenseHourlyPlan || 0) / 100) * (core_number || 0)
            ).toFixed(3)}
          </p>
          <p className="text-[14px] font-medium">giờ</p>
        </div>
        <div className="flex flex-col gap-3 py-2">
          <h5 className="text-sm font-bold uppercase">Chọn team</h5>
          <Select
            aria-label="operating-system"
            fullWidth
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            labelPlacement="outside"
            classNames={{
              label:
                "text-sm font-bold left-0 group-data-[filled=true]:text-primary",
              value: "text-sm tracking-wide font-medium",
              trigger:
                "text-dark border border-slate-400 rounded-[0.5rem] min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
              popoverContent: "rounded",
            }}
            selectedKeys={teamId}
            onSelectionChange={setTeamId}
            isInvalid={!teamId ? true : false}
          >
            {teams?.map((item: any) => {
              return (
                <SelectItem key={item._id} textValue={item.name}>
                  {item.name}
                </SelectItem>
              );
            })}
          </Select>
        </div>
        <div
          onClick={() => isDeployable && handleOnDeloy()}
          className={`${
            isDeployable
              ? "cursor-pointer bg-up-cloud-primary text-white"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          } mt-4 flex w-full items-center justify-center px-4 py-2 text-base font-semibold  gap-1`}
        >
          {isDeploying ? (
            <>
              <Spinner color="white" size="sm" />
              <p>Đang triển khai</p>
            </>
          ) : (
            "Triển khai"
          )}
        </div>
        {!isDeployable && (
          <div className="mt-2 flex flex-col gap-1">
            {!isZoneSet && (
              <p className="text-sm">
                Vui lòng chọn{" "}
                <strong className="text-up-cloud-primary">khu vực</strong>.
              </p>
            )}
            {!isPlanSet && (
              <p className="text-sm">
                Vui lòng chọn{" "}
                <strong className="text-up-cloud-primary">gói dịch vụ</strong>.
              </p>
            )}
            {method === "ssh" && !isSSHKeySet && (
              <p className="text-sm">
                Vui lòng chọn ít nhất 1{" "}
                <strong className="text-up-cloud-primary">khóa SSH</strong>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
