/* eslint-disable no-constant-binary-expression */
/* eslint-disable react-hooks/exhaustive-deps */
import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import {
  addSSHKey,
  setMethod,
  setServerSSHKeys,
} from "@/stores/slices/upcloud/server.slice";

import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

interface CheckedItemProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

function CheckedItem({ label, checked, onClick }: CheckedItemProps) {
  return (
    <div className="flex items-center justify-center gap-2" onClick={onClick}>
      <div
        className={`flex h-4 w-4 cursor-pointer items-center justify-center border-[2px] ${
          checked
            ? "border-up-cloud-primary bg-up-cloud-primary"
            : "border-gray-300"
        }`}
      >
        {checked && <FaCheck size={10} color="#fff" />}
      </div>
      <div>{label}</div>
    </div>
  );
}
export default function UpCloudLoginMethod() {
  const dispatch = useAppDispatch();

  // Redux selectors
  const sshKeys = useAppSelector(
    (state: RootState) => state.upCloudServer.sshKeys
  );
  const method = useAppSelector(
    (state: RootState) => state.upCloudServer.method
  );
  const methodArr = useAppSelector(
    (state: RootState) => state.upCloudServer.methodArr
  );

  // Dispatch actions to update state
  const handleAddSSHKey = (key: any) => dispatch(addSSHKey(key));
  const handleUpdateServerSSHKeys = (keys: any) =>
    dispatch(setServerSSHKeys(keys));
  const handleSetMethod = (newMethod: any) => dispatch(setMethod(newMethod));
  const [selectedKeys, setSelectedKeys] = useState<string[]>([""]);
  const [isOpenModalSShKey, setIsOpenModalSshKey] = useState(false);
  const toggleKeySelection = (key: string) => {
    setSelectedKeys((prevSelectedKeys) =>
      prevSelectedKeys.includes(key)
        ? prevSelectedKeys.filter((k) => k !== key)
        : [...prevSelectedKeys, key]
    );
  };
  useEffect(() => {
    setSelectedKeys([]);
  }, [method]);
  const validateSSHKey = (key: string) => {
    const sshKeyPattern =
      /^(ssh-(rsa|ed25519|dss)|ecdsa-sha2-nistp(256|384|521)) ([A-Za-z0-9+/=]+)( .*)?$/;
    return sshKeyPattern.test(key);
  };
  const [sshKeyName, setSshKeyName] = useState("");
  const [sshKeyContent, setSshKeyContent] = useState("");
  const extractCommentFromSSHKey = (key: string): string => {
    const parts = key.trim().split(" ");
    return parts.length > 2 ? parts[2] : "";
  };

  useEffect(() => {
    const comment = extractCommentFromSSHKey(sshKeyContent);
    if (comment) setSshKeyName(comment);
  }, [sshKeyContent]);
  useEffect(() => {
    const selectedSSHKeys = sshKeys.filter((sshKey: any) =>
      selectedKeys.includes(sshKey.title)
    );
    if (method === "ssh")
      handleUpdateServerSSHKeys([...selectedSSHKeys.map((k: any) => k.value)]);
  }, [selectedKeys, sshKeys, handleUpdateServerSSHKeys]);
  const handleSaveSSHKey = () => {
    if (!sshKeyName || !sshKeyContent) {
      toast.error("Vui lòng nhập tên và khóa SSH");
      return;
    }

    if (!validateSSHKey(sshKeyContent)) {
      toast.error(
        "Định dạng khóa SSH không hợp lệ. Vui lòng nhập một khóa SSH hợp lệ."
      );
      return;
    }
    if (sshKeys.find((ssh: any) => ssh.title === sshKeyName)) {
      toast.error("Tên khóa SSH đã tồn tại, vui lòng thử tên khác");
      return;
    }
    setSelectedKeys((prev) => [...prev, sshKeyName]);
    handleAddSSHKey({ title: sshKeyName, value: sshKeyContent });
    setIsOpenModalSshKey(false);
    setSshKeyName("");
    setSshKeyContent("");
  };
  return (
    <>
      <div className="flex flex-col gap-3 rounded-sm border-b-[1px] border-b-gray-300 pb-5">
        <div className="border-b-1 flex w-full items-center justify-between gap-3 border-b-gray-200 px-4 py-5">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              style={{ color: "#ffb44d" }}
            >
              <path
                fill="#ffb44d"
                fill-rule="nonzero"
                d="M29 16.9H19V15h12v19H9V15h8v1.9h-6v15.2h18zM20 25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0 2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7m-3-11.668-2 .596V11a5 5 0 0 1 10 0v1.948h-2V11a3 3 0 0 0-6 0zM19 25h2v4h-2z"
              ></path>
            </svg>
            <p className="text-[22px]">Phương thức đăng nhập</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 px-5">
          <div
            onClick={() => methodArr.includes("ssh") && setMethod("ssh")}
            className={`${
              methodArr.includes("ssh")
                ? "cursor-pointer"
                : "cursor-not-allowed"
            } ${
              method === "ssh" ? "border-up-cloud-primary" : "grayscale"
            } relative flex min-h-24 basis-[calc(50%-12px)] flex-col items-center justify-center rounded-sm border-[1px] border-gray-300 px-10 py-3`}
          >
            <div
              className={`${
                methodArr.includes("ssh")
                  ? "group-hover:border-up-cloud-primary"
                  : "cursor-not-allowed"
              } absolute left-4 top-4 h-4 w-4 rounded-full border-[1px] p-0.5 ${
                method === "ssh" && methodArr.includes("ssh")
                  ? "border-up-cloud-primary"
                  : "border-gray-400"
              }`}
            >
              {1 && (
                <div
                  className={`${
                    method === "ssh" && methodArr.includes("ssh")
                      ? "bg-up-cloud-primary"
                      : "bg-transparent"
                  } h-full w-full rounded-full`}
                ></div>
              )}
            </div>
            <div className="w-full text-base font-semibold">SSH keys</div>
            <div className="w-full pr-10 text-sm font-normal">
              {methodArr.includes("ssh")
                ? "Phương pháp được khuyến nghị để xác thực dễ dàng và an toàn hơn."
                : "Mẫu hệ điều hành đã chọn không hỗ trợ khóa SSH."}
            </div>
          </div>
          <div
            onClick={() => methodArr.includes("otp") && handleSetMethod("otp")}
            className={`${
              methodArr.includes("otp")
                ? "cursor-pointer"
                : "cursor-not-allowed"
            } ${
              method === "otp" ? "border-up-cloud-primary" : "grayscale"
            } relative flex min-h-24 basis-[calc(50%-12px)] flex-col items-center justify-center rounded-sm border-[1px] border-gray-300 px-10 py-3`}
          >
            <div
              className={`${
                methodArr.includes("otp")
                  ? "group-hover:border-up-cloud-primary"
                  : "cursor-not-allowed"
              } absolute left-4 top-4 h-4 w-4 rounded-full border-[1px] p-0.5 ${
                method === "otp" && methodArr.includes("otp")
                  ? "border-up-cloud-primary"
                  : "border-gray-400"
              }`}
            >
              {1 && (
                <div
                  className={`${
                    method === "otp" && methodArr.includes("otp")
                      ? "bg-up-cloud-primary"
                      : "bg-transparent"
                  } h-full w-full rounded-full`}
                ></div>
              )}
            </div>
            <div className="w-full text-base font-semibold">
              One time password
            </div>
            <div className="w-full pr-10 text-sm font-normal">
              {methodArr.includes("otp")
                ? "Mật khẩu cho Administrator sẽ được tự động tạo và gửi đến bạn trong quá trình triển khai."
                : "Đăng nhập bằng mật khẩu không được hỗ trợ trong phiên bản hệ điều hành đã chọn."}
            </div>
          </div>
        </div>
        {method === "ssh" && (
          <div className="flex w-full flex-col gap-4">
            <div className="w-full text-[14px]">
              Chọn khóa SSH cho máy chủ này:
            </div>
            <div className="flex w-full flex-col items-start justify-start gap-2">
              {sshKeys.map((key) => (
                <CheckedItem
                  key={key.title}
                  label={key.title}
                  checked={selectedKeys.includes(key.title)}
                  onClick={() => toggleKeySelection(key.title)}
                />
              ))}
            </div>
            <div
              onClick={() => setIsOpenModalSshKey(true)}
              className="flex max-w-36 cursor-pointer items-center justify-center gap-2 bg-up-cloud-primary px-4 py-2 hover:bg-black"
            >
              <span className="text-xl font-bold text-white">
                <IoIosAdd size={22} />
              </span>
              <p className="text-sm text-white">Thêm mới</p>
            </div>
          </div>
        )}
      </div>
      <CustomModal
        isOpen={isOpenModalSShKey}
        onClose={() => setIsOpenModalSshKey(false)}
        onSave={handleSaveSSHKey}
        sshKeyName={sshKeyName}
        setSshKeyName={setSshKeyName}
        sshKeyContent={sshKeyContent}
        setSshKeyContent={setSshKeyContent}
      />
    </>
  );
}

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  sshKeyName: string;
  setSshKeyName: (name: string) => void;
  sshKeyContent: string;
  setSshKeyContent: (content: string) => void;
}
export function CustomModal({
  isOpen,
  onClose,
  onSave,
  sshKeyName,
  setSshKeyName,
  sshKeyContent,
  setSshKeyContent,
}: CustomModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="flex w-full flex-col bg-white">
          {/* Header */}
          <div className="flex w-full items-center justify-between border-b-[1px] border-b-gray-300 px-2 py-3">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                style={{ color: "rgb(123, 0, 255)" }}
              >
                <path
                  fill="rgb(123, 0, 255)"
                  fillRule="nonzero"
                  d="M29 16.9H19V15h12v19H9V15h8v1.9h-6v15.2h18zM20 25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0 2a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7m-3-11.668-2 .596V11a5 5 0 0 1 10 0v1.948h-2V11a3 3 0 0 0-6 0zM19 25h2v4h-2z"
                ></path>
              </svg>
              <p className="text-base font-medium text-black">Thêm khóa SSH</p>
            </div>
            <span
              onClick={onClose}
              className="cursor-pointer rounded p-1 text-2xl transition-all duration-300 hover:bg-gray-200"
            >
              <IoClose />
            </span>
          </div>

          {/* Body */}
          <div className="flex w-full flex-col gap-5 px-6 py-7">
            <p className="text-sm text-black">
              Vui lòng cung cấp khóa SSH của bạn ở định dạng OpenSSH.
            </p>
            <div className="flex w-full flex-col gap-2">
              <p className="text-sm font-medium text-black">
                Tên khóa SSH của bạn
              </p>
              <div className="relative flex w-full items-center">
                <input
                  value={sshKeyName}
                  onChange={(e) => setSshKeyName(e.target.value)}
                  type="text"
                  className="w-full border-b-[1.5px] border-b-gray-300 text-sm font-bold outline-0"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <p className="text-sm font-medium text-black">SSH key</p>
              <div className="w-full">
                <textarea
                  value={sshKeyContent}
                  onChange={(e) => setSshKeyContent(e.target.value)}
                  className="w-full rounded-sm border-[1px] border-gray-300 p-2 outline-none focus:border-up-cloud-primary"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex w-full items-start justify-start px-6 py-4">
            <button
              onClick={onSave}
              className="bg-up-cloud-primary px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Lưu khóa SSH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
