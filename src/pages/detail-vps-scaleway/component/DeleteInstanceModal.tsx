import { Spinner } from "@heroui/react";
import { useState } from "react";
const DeleteInstanceModal = ({
  instanceName,
  onClose,
  onDelete,
  confirmLoading,
}: any) => {
  const [confirmText, setConfirmText] = useState("");

  const [deleteAssociatedIPs, setDeleteAssociatedIPs] = useState(true);
  const [deleteBlockStorage, setDeleteBlockStorage] = useState(false);

  const handleDelete = () => {
    if (confirmText === "DELETE") {
      onDelete({ deleteAssociatedIPs, deleteBlockStorage });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Delete Instance?
        </h2>
        <p className="mb-4 text-gray-700">
          This will delete Instance{" "}
          <span className="font-semibold">{instanceName}</span>.
        </p>
        <div className="mb-4 rounded border border-yellow-500 bg-yellow-100 p-3 text-yellow-700">
          <p className="text-sm">
            <strong>Warning:</strong> This action is irreversible and will
            permanently delete your Instance and all its data.
          </p>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={deleteAssociatedIPs}
              onChange={(e) => setDeleteAssociatedIPs(e.target.checked)}
              className="form-checkbox text-purple-600"
            />
            <span className="ml-2 text-gray-800">Delete associated IPs</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={deleteBlockStorage}
              onChange={(e) => setDeleteBlockStorage(e.target.checked)}
              className="form-checkbox text-purple-600"
            />
            <span className="ml-2 text-gray-800">
              Delete Block Storage volumes
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-semibold text-gray-700">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-3 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 rounded px-4 py-2 text-white ${
              confirmText !== "DELETE" || confirmLoading
                ? "cursor-not-allowed bg-red-300"
                : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={confirmText !== "DELETE" || confirmLoading}
          >
            {confirmLoading && (
              <Spinner
                size="sm"
                classNames={{
                  circle1: "border-b-white",
                  circle2: "border-b-white",
                }}
              />
            )}
            Delete Instance
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteInstanceModal;
