import { FaCopy } from "react-icons/fa6";

const DetailItem = ({ label, value, copyable }: any) => {
  const handleCopy = (text: any) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-2">
      <div className="flex-1">
        <span className="font-semibold text-gray-700">{label}:</span>
        <span className="ml-2 text-gray-600">{value}</span>
      </div>
      {copyable && (
        <button
          onClick={() => handleCopy(value)}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <FaCopy />
        </button>
      )}
    </div>
  );
};

export default DetailItem;
