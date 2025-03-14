import { useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import SshKeyModal from "./SshKeyModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/stores";
import { fetchSSHKeys } from "@/stores/slices/vps-scaleway-slice";
import { useDisclosure } from "@heroui/react";

const SshKeysComponent = () => {
  const { sshKeys } = useSelector((state: any) => state?.scaleway);
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    // Fetch data here
    dispatch(
      fetchSSHKeys({
        search: "",
        page: 1,
        perPage: 100,
      })
    );
  }, []);
  return (
    <>
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 overflow-x-auto">
          <table className="w-full border-b text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 font-medium text-gray-600">
                  Fingerprint
                </th>
              </tr>
            </thead>
            <tbody>
              {sshKeys.length > 0 &&
                sshKeys?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-gray-800">{item?.name}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {item?.fingerprint}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <button
          className="flex w-full items-center justify-center rounded-lg border border-primary py-2 font-medium text-primary hover:bg-purple-50"
          onClick={onOpenChange}
        >
          <IoMdAdd />
          Add SSH key
        </button>
      </div>
      {isOpen && <SshKeyModal isOpen={isOpen} onOpenChange={onOpenChange} />}
    </>
  );
};

export default SshKeysComponent;
