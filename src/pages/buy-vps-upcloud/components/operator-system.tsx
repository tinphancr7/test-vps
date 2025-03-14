/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

interface GroupedStorage {
  osName: string;
  versions: StorageUpCloud[];
}

import UpCloudSelect from "./select";
import { StorageUpCloud } from "@/interfaces/upcloud-response.interface";
import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import {
  setCoreNumber,
  setLicenseHourlyPlan,
  setMemory,
  setMethod,
  setMethodArr,
  setMinStorageOs,
  setPlan,
  setPriceHourlyPlan,
  setServerName,
  setStorageDeviceSize,
  setStorageDeviceStorage,
} from "@/stores/slices/upcloud/server.slice";
import { fetchStorages } from "@/stores/async-thunks/up-cloud.thunk";
import { Spinner } from "@heroui/react";
const allowedOSNames = [
  "AlmaLinux",
  "CentOS",
  "Debian",
  "Rocky",
  "Ubuntu",
  "Windows",
];

const groupStoragesByOS = (storages: StorageUpCloud[]): GroupedStorage[] => {
  const groups: { [key: string]: GroupedStorage } = {};

  storages.forEach((storage) => {
    const [osName] = storage.title.split(" ");

    if (!allowedOSNames.includes(osName)) return;

    const version = storage.title.replace(osName, "").trim();

    if (!groups[osName]) {
      groups[osName] = { osName, versions: [] };
    }

    groups[osName].versions.push({ ...storage, version });
  });

  return Object.values(groups);
};

export default function UpCloudOperatorSystem() {
  const dispatch = useAppDispatch();
  const storages = useAppSelector(
    (state: RootState) => state.upCloudStorage.storages
  );
  const isPending = useAppSelector(
    (state: RootState) => state.upCloudStorage.loading
  );
  const serverMain = useAppSelector(
    (state: RootState) => state.upCloudServer.server
  );
  const [osGroups, setOsGroups] = useState<GroupedStorage[]>([]);
  const handleSetStorage = (storage: any) =>
    dispatch(setStorageDeviceStorage(storage));
  const handleSetServerName = (name: any) => dispatch(setServerName(name));
  const handleSetMinStorageOs = (storage: any) =>
    dispatch(setMinStorageOs(storage));
  const handleSetLicenseHourlyPlan = (license: any) =>
    dispatch(setLicenseHourlyPlan(license));
  const handleSetMethodArr = (methods: any) => dispatch(setMethodArr(methods));
  const handleSetMethod = (method: any) => dispatch(setMethod(method));
  const handleSetPlan = (plan: any) => dispatch(setPlan(plan));
  const handleSetStorageDeviceSize = (size: any) =>
    dispatch(setStorageDeviceSize(size));
  const handleSetCoreNumber = (core: any) => dispatch(setCoreNumber(core));
  const handleSetMemory = (memory: any) => dispatch(setMemory(memory));
  const handleSetPriceHourlyPlan = (price: any) =>
    dispatch(setPriceHourlyPlan(price));

  // Fetch storages on mount
  useEffect(() => {
    dispatch(fetchStorages());
  }, [dispatch]);

  const [selectedOS, setSelectedOS] = useState<{ [key: string]: string }>({});
  const [selectedMainOs, setSelectedMainOs] = useState<string>("");
  useEffect(() => {
    if (storages && Array.isArray(storages)) {
      const groupedOS = groupStoragesByOS(storages);
      setOsGroups(groupedOS);
      const defaultSelection = groupedOS.reduce((acc, group) => {
        acc[group.osName] = group.versions[0]?.uuid || "";
        return acc;
      }, {} as { [key: string]: string });
      setSelectedMainOs(Object.keys(selectedOS)[0]);
      setSelectedOS(defaultSelection);

      const server = storages.find(
        (s) => s.uuid === defaultSelection[Object.keys(selectedOS)[0]]
      );
      handleSetServerName(server?.title || "");
      handleSetLicenseHourlyPlan(server?.license || null);
      handleSetMinStorageOs(server?.size || 0);
      handleSetStorage(defaultSelection[Object.keys(selectedOS)[0]]);
    }
  }, [storages]);
  const handleSelectChange = (osName: string, selectedId: string) => {
    setSelectedOS((prev) => ({ ...prev, [osName]: selectedId }));
  };

  useEffect(() => {
    if (selectedMainOs && selectedOS[selectedMainOs]) {
      handleSetStorage(selectedOS[selectedMainOs]);
      const server = storages?.find(
        (s: any) => s.uuid === selectedOS[selectedMainOs]
      );
      handleSetServerName(server?.title || "");
      handleSetMethod(
        (server?.title || "")?.toLowerCase()?.includes("window") ? "otp" : "ssh"
      );
      handleSetMethodArr(
        (server?.title || "")?.toLowerCase()?.includes("window")
          ? ["otp"]
          : ["ssh"]
      );
      handleSetLicenseHourlyPlan(server?.license || null);
      handleSetMinStorageOs(server?.size || 0);
      if (
        typeof serverMain?.storage_devices?.storage_device[0]?.size ===
          "number" &&
        typeof server?.size === "number" &&
        server?.size > serverMain?.storage_devices?.storage_device[0]?.size
      ) {
        handleSetPlan("");
        handleSetStorageDeviceSize(0);
        handleSetCoreNumber(0);
        handleSetMemory(0);
        handleSetPriceHourlyPlan(0);
      }
    }
  }, [selectedMainOs, selectedOS]);

  const getOsImage = (os: string) => {
    switch (os.toLowerCase()) {
      case "almalinux":
        return "/upcloud/os/almalinux.png";
      case "ubuntu":
        return "/upcloud/os/ubuntu.png";
      case "centos":
        return "/upcloud/os/centos.png";
      case "debian":
        return "/upcloud/os/debian.png";
      case "upcloud":
        return "/upcloud/os/upcloud.png";
      case "rocky":
        return "/upcloud/os/rocky.png";

      default:
        return "/upcloud/os/windows.png";
    }
  };
  return (
    <div className="rounded-sm border-b-[1px] border-b-gray-300 pb-8">
      <div className="mb-4 border-b-1 flex w-full items-center gap-3 border-b-gray-200 px-4 py-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          style={{ color: "#ffb44d" }}
        >
          <g fill="#ffb44d" fill-rule="nonzero">
            <path d="M6 9v16h28V9zm30-2v20H4V7z"></path>
            <path d="M13.182 17.234q0-.809.268-1.443a3.15 3.15 0 0 1 1.787-1.741 3.48 3.48 0 0 1 2.5 0c.812.307 1.458.938 1.784 1.741q.277.634.277 1.443 0 .808-.277 1.443a3.3 3.3 0 0 1-.73 1.073q-.453.435-1.055.661-.6.225-1.254.225-.651 0-1.247-.225a3.1 3.1 0 0 1-1.055-.661 3.15 3.15 0 0 1-.73-1.073 3.7 3.7 0 0 1-.268-1.443m1.672 0q0 .98.432 1.568.432.59 1.197.59t1.204-.59.44-1.568q-.001-.994-.44-1.582a1.42 1.42 0 0 0-1.204-.589q-.766 0-1.197.59-.432.587-.432 1.581m7.388 1.522q.469.345.927.537a2.6 2.6 0 0 0 1 .191q.566 0 .836-.218a.69.69 0 0 0 .27-.562.53.53 0 0 0-.129-.352 1.2 1.2 0 0 0-.34-.271 3.4 3.4 0 0 0-.48-.218q-.27-.1-.54-.205a9 9 0 0 1-.695-.278q-.34-.151-.63-.385a2 2 0 0 1-.452-.522 1.36 1.36 0 0 1-.178-.709q0-.86.68-1.403.681-.542 1.855-.543.725 0 1.304.239.581.238 1.006.543l-.75.927a4 4 0 0 0-.744-.405 2.1 2.1 0 0 0-.787-.152q-.525 0-.772.205a.64.64 0 0 0-.248.51.5.5 0 0 0 .121.338q.137.151.318.246.198.104.461.197.263.092.545.186.354.118.71.271.353.152.643.377t.468.55q.178.324.177.774a1.78 1.78 0 0 1-.695 1.423c-.254.195-.542.34-.848.43q-.512.16-1.162.16a4 4 0 0 1-1.424-.26 4.7 4.7 0 0 1-1.212-.64zM11.5 33v-2h17v2z"></path>
          </g>
        </svg>
        <p className="text-[22px]">Hệ điều hành</p>
      </div>
      {isPending ? (
        <div className="flex min-h-36 w-full flex-col items-center justify-center gap-3">
          <Spinner />
        </div>
      ) : (
        <div className="z-[999] flex w-full flex-wrap gap-5 bg-white">
          {osGroups.map(({ osName, versions }, index) => (
            <div
              onClick={() => setSelectedMainOs(osName)}
              key={osName}
              style={{ zIndex: osGroups.length - index }}
              className={`${
                selectedMainOs === osName ? "grayscale-0" : "grayscale"
              } relative flex min-h-40 basis-[calc(25%-20px)] cursor-pointer flex-col items-start justify-between border-[1px] border-gray-300 transition-all duration-300 hover:grayscale-0`}
            >
              <div
                className={`'group-hover:border-up-cloud-primary' absolute left-4 top-4 h-4 w-4 rounded-full border-[1px] p-0.5 ${
                  selectedMainOs === osName
                    ? "border-up-cloud-primary"
                    : "border-gray-400"
                }`}
              >
                <div
                  className={`${
                    selectedMainOs === osName
                      ? "bg-up-cloud-primary"
                      : "bg-transparent"
                  } h-full w-full rounded-full`}
                ></div>
              </div>
              <div className="flex w-full items-start justify-between gap-3 py-3 pl-10 pr-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {osName}{" "}
                    {versions.find(
                      (version) => version.uuid === selectedOS[osName]
                    )?.version || ""}
                  </p>
                  <p className="text-[12px] font-semibold">
                    {(versions.find(
                      (version) => version.uuid === selectedOS[osName]
                    )?.license || 0) /
                      100 >
                      0 &&
                      ` Ổ cứng tối thiểu ${
                        versions.find(
                          (version) => version.uuid === selectedOS[osName]
                        )?.size || ""
                      } GB €${(
                        (versions.find(
                          (version) => version.uuid === selectedOS[osName]
                        )?.license || 0) / 100
                      ).toFixed(3)} / CPU core / giờ`}
                  </p>
                </div>
                <img
                  src={getOsImage(osName)}
                  alt={`${osName} Operator System`}
                  className="ml-auto aspect-square w-10"
                />
              </div>

              <div className="relative bottom-0 left-0 right-0 h-10 w-full">
                {versions.length > 0 && (
                  <UpCloudSelect
                    options={versions.map((version) => ({
                      value: version.uuid,
                      label: osName + " " + version.version || "",
                    }))}
                    defaultValue={versions[0]?.uuid}
                    mainText="Thay đổi phiên bản"
                    className="border-b-0 border-l-0 border-r-0"
                    onChange={(selectedOption) =>
                      handleSelectChange(osName, selectedOption.value)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
