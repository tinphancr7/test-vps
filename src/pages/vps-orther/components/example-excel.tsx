import vpsOrtherApis from "@/apis/vps-orther.api";
import { Button } from "@heroui/react";
import { RiFileExcel2Fill } from "react-icons/ri";

export default function ExampleExcel() {
  const handleDownload = async () => {
    const response = await vpsOrtherApis.getFileExel();
    const fileUrl = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "VPS_Sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Button
      onClick={handleDownload}
      variant="solid"
      color={"success"}
      className="bg-success-600 rounded-md min-w-32 text-white font-bold text-sm items-center"
      startContent={
        <RiFileExcel2Fill className="text-white min-w-max min-h-max text-lg" />
      }
    >
      Tải file excel mẫu
    </Button>
  );
}
