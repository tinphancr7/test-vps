import { Button, Image } from "@heroui/react";
import { Dispatch, SetStateAction, useRef, useState, useMemo } from "react";
import { API_URL } from "@/configs/apis";
function FileUpLoad({
  file,
  setFile,
  urlBill,
  ...rest
}: {
  file: any;
  setFile: Dispatch<SetStateAction<string>>;
  urlBill: string;
}) {
  const ref = useRef<any>(null);
  const [currentFile, setCurrentFile] = useState<any>("");
  const [imageSources, setImageSources] = useState<any>({});

  const handleRefInput = () => {
    ref.current.click();
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setCurrentFile(files[0]);
    }
  };

  const handleUploadFile = (event: any) => {
    setFile(event.target.files[0]);
    setCurrentFile(event.target.files[0]);
  };

  const renderImage = useMemo(() => {
    if (!currentFile) {
      if (urlBill) {
        return (
          <div className="h-42 w-24">
            <Image src={API_URL + urlBill} />
          </div>
        );
      }
      return <></>;
    }

    const imgsType = ["jpeg", "jpg", "png", "gif", "tiff", "psd"];
    const fileExtension = currentFile.name?.split(".").pop()?.toLowerCase();

    if (imgsType.includes(fileExtension)) {
      if (!imageSources[currentFile.name]) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageSources((prev: any) => ({
            ...prev,
            [currentFile.name]: reader.result,
          }));
        };
        reader.readAsDataURL(currentFile);
      }
    }

    return (
      <div className="h-42 w-24">
        <Image src={imageSources[currentFile.name] || ""} />
      </div>
    );
  }, [currentFile, file, imageSources]);

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <Button onPress={handleRefInput} className="my-2">
        {" "}
        Upload hình ảnh
      </Button>
      {renderImage}
      <input
        ref={ref}
        hidden
        multiple={false}
        type="file"
        onChange={handleUploadFile}
        {...rest}
      />
    </div>
  );
}

export default FileUpLoad;
