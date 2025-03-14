import { Slider, Tooltip } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import UpCloudSelect from "./select";

import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import {
  setStorageDeviceTitle,
  setStorageDeviceSize,
  setStorageDeviceEncrypted,
  setStorageDeviceAddress,
  setStorageDeviceTier,
} from "@/stores/slices/upcloud/server.slice";
export default function UpCloudStorage() {
  const dispatch = useAppDispatch();

  // Select storage device properties from Redux store
  const storageName = useAppSelector(
    (state: RootState) =>
      state.upCloudServer.server.storage_devices.storage_device[0]?.title
  );
  const gbNumber = useAppSelector(
    (state: RootState) =>
      state.upCloudServer.server.storage_devices.storage_device[0]?.size
  );
  const encrypted = useAppSelector(
    (state: RootState) =>
      state.upCloudServer.server.storage_devices.storage_device[0]?.encrypted
  );
  const address = useAppSelector(
    (state: RootState) =>
      state.upCloudServer.server.storage_devices.storage_device[0]?.address
  );
  const tier = useAppSelector(
    (state: RootState) =>
      state.upCloudServer.server.storage_devices.storage_device[0]?.tier
  );

  // Dispatch actions to update each storage device property
  const setStorageName = (title: string) =>
    dispatch(setStorageDeviceTitle(title));
  const setGbNumber = (size: number) => dispatch(setStorageDeviceSize(size));
  const setEncrypted = (encrypted: string) =>
    dispatch(setStorageDeviceEncrypted(encrypted));
  const setAddress = (address: string) =>
    dispatch(setStorageDeviceAddress(address));
  const setTier = (tier: string) => dispatch(setStorageDeviceTier(tier));

  const [isChangeName, setIsChangeName] = useState(false);
  const [inputGbNumber, setInputGbNumber] = useState<number | string>(gbNumber);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (gbNumber) setInputGbNumber(gbNumber);
  }, [gbNumber]);
  const [tempName, setTempName] = useState(storageName);
  useEffect(() => {
    if (isChangeName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isChangeName]);

  const handleSave = () => {
    setStorageName(tempName);
    setIsChangeName(false);
  };

  const handleCancel = () => {
    setTempName(storageName);
    setIsChangeName(false);
  };
  useEffect(() => {
    if (isChangeName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isChangeName]);

  // const handleSliderChange = (value: number) => {
  //   setGbNumber(value);
  //   setInputGbNumber(value);
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputGbNumber(value);
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) setGbNumber(numericValue);
  };

  const handleInputBlur = () => {
    const validatedValue = Math.min(Math.max(gbNumber, 0), 4096);
    setGbNumber(validatedValue);
    setInputGbNumber(validatedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(
        e.key
      ) &&
      !/[0-9]/.test(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="rounded-sm border-b-[1px] border-b-gray-300">
      <div className="border-b-1 flex w-full items-center gap-3 border-b-gray-200 px-4 py-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          style={{ color: "#ffb44d" }}
        >
          <g fill="#ffb44d" fillRule="nonzero">
            <path d="M7 6h19.043L33 12.783V34H7zm2 2v24h22V13.627L25.23 8z"></path>
            <path d="M12 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2M20 12c4.411 0 8 3.589 8 8 0 4.412-3.588 8-8 8s-8-3.588-8-8c0-4.411 3.589-8 8-8m0 2c-3.307 0-6 2.693-6 6s2.693 6 6 6 6-2.693 6-6-2.693-6-6-6"></path>
            <path d="M20 16c2.202 0 4 1.798 4 4s-1.798 4-4 4-4-1.798-4-4 1.798-4 4-4m0 2c-1.098 0-2 .902-2 2s.902 2 2 2 2-.902 2-2-.902-2-2-2M12 28a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"></path>
          </g>
        </svg>
        <p className="text-[22px]">Dung lượng</p>
      </div>
      <div className="flex min-h-44 w-full flex-col px-4 py-5 gap-4">
        {isChangeName ? (
          <div className="flex w-full flex-row items-center justify-between gap-3">
            <input
              ref={inputRef}
              type="text"
              disabled={true}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full border-b-[1px] border-b-black text-sm font-medium text-black outline-none"
            />
            <div className="flex items-center justify-center gap-2">
              <Tooltip title="Cancel">
                <div
                  onClick={handleCancel}
                  className="flex aspect-square h-8 cursor-pointer items-center justify-center border-[1px] border-gray-300 text-red-500"
                >
                  <IoClose size={18} />
                </div>
              </Tooltip>
              <Tooltip title="Save">
                <div
                  onClick={handleSave}
                  className="flex aspect-square h-8 cursor-pointer items-center justify-center border-[1px] border-gray-300 text-green-500"
                >
                  <MdDone size={18} />
                </div>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="z-10 flex w-full flex-row items-center justify-between gap-3">
            <div
              onClick={() => {
                setIsChangeName(true);
              }}
              className="w-full cursor-pointer text-sm font-medium text-black"
            >
              {storageName}
            </div>
            <div className="flex flex-row items-stretch justify-center gap-2">
              <div className="min-w-36">
                <UpCloudSelect
                  options={[
                    { value: "no", label: "Not Encrypted" },
                    { value: "yes", label: "Encrypted" },
                  ]}
                  defaultValue={encrypted}
                  onChange={(selectedOption) =>
                    setEncrypted(selectedOption.value)
                  }
                />
              </div>
              <div className="min-w-28">
                <UpCloudSelect
                  options={[
                    { value: "virtio", label: "VirtIO" },
                    { value: "ide", label: "IDE" },
                    { value: "scsi", label: "SCSI" },
                  ]}
                  defaultValue={address}
                  onChange={(selectedOption) =>
                    setAddress(selectedOption.value)
                  }
                />
              </div>
              <div className="min-w-28">
                <UpCloudSelect
                  options={[
                    { value: "maxiops", label: "MaxIOPS" },
                    { value: "standard", label: "Standard" },
                    { value: "archive", label: "Archive" },
                  ]}
                  disabled={true}
                  defaultValue={tier}
                  onChange={(selectedOption) => setTier(selectedOption.value)}
                />
              </div>
              {/* <Tooltip title='Edit'>
                <div
                  onClick={() => {
                    setIsChangeName(true)
                  }}
                  className='flex aspect-square cursor-pointer items-center justify-center border-[1px] border-gray-300 px-2'
                >
                  <FaPen />
                </div>
              </Tooltip> */}
            </div>
          </div>
        )}
        <div className="flex w-full items-center justify-center gap-2">
          <Slider
            size="sm"
            showTooltip={true}
            maxValue={4096}
            minValue={0}
            value={gbNumber}
            // onChange={handleSliderChange}
            className="w-full"
          />
          <div className="relative flex items-center justify-center gap-1">
            <div className="relative flex w-14 items-center justify-center before:absolute before:bottom-0 before:h-0 before:w-full before:bg-up-cloud-primary before:opacity-0 before:transition-all before:duration-100 focus-within:before:h-[1.5px] focus-within:before:!opacity-100">
              <input
                value={inputGbNumber}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                disabled
                type="text"
                className="w-full border-b-[1.5px] border-b-gray-300 text-sm font-bold outline-0 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-sm text-black">GB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
