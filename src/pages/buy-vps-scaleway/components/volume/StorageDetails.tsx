import { FaEdit } from "react-icons/fa";

import AddVolume from "./AddVolume";
import { useSelector } from "react-redux";
import { useDisclosure } from "@heroui/react";

const StorageDetails = () => {
  const { instance } = useSelector((state: any) => state?.scaleway);
  const { isOpen, onOpenChange } = useDisclosure();
  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="grid grid-cols-3 border-b border-gray-200 pb-2 text-base font-medium text-gray-500">
        <div>Storage</div>
        <div>Name</div>
        <div>Size</div>
      </div>

      {/* Storage Item Row */}
      <div className="grid grid-cols-3 items-center py-3 text-gray-800">
        <div className="flex items-center space-x-2">
          <img
            src={`/icons/${instance.selectedOS?.logoUrl}`}
            alt="Debian Logo"
            className="h-5 w-5"
          />
          <span className="text-base">
            Block Storage {instance?.volume.perf_iops === 5000 ? "5K" : "15K"}
          </span>
        </div>
        <div className="text-base">{instance.volume.name}</div>
        <div className="flex items-center justify-between text-base">
          <span>{instance.volume.size} GB</span>
          <div className="flex space-x-2 text-gray-500">
            <FaEdit className="cursor-pointer" onClick={onOpenChange} />
            {/* <FaTrashAlt className='cursor-pointer text-red-400' /> */}
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        {/* Add Volume Button */}
        {/* <button
          className='flex items-center rounded-lg border border-primary px-4 py-2 text-primary hover:bg-purple-50'
          onClick={showModal}
        >
          <HiPlus className='mr-2' />
          Add volume
        </button> */}

        {/* Volumes and Total Storage Info */}
        <div className="flex items-center text-base text-gray-500">
          <span>Volumes</span>
          <span className="mx-2 text-primary">•</span>
          <span>1 / 16</span>
          <span className="mx-4">|</span>
          <span>Total storage :</span>
          <span className="ml-2 font-semibold text-primary">
            {instance.volume.size} GB
          </span>
        </div>
      </div>
      {isOpen && <AddVolume isOpen={isOpen} onOpenChange={onOpenChange} />}
    </div>
  );
};

export default StorageDetails;
