import { Image } from "@heroui/react";
import { IoClose } from "react-icons/io5";
import FileUpload from "./file-upload";

function Attachments({ files, setFiles, existingFiles, setExistingFiles }: any) {
	const handleUploadFile = (event: any) => {
        const uploadedFiles = event?.target?.files || event;

        const accepts = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
        const type = uploadedFiles[0]?.type;

        if (accepts.includes(type)) {
            const newFiles = [...files, ...Array.from(uploadedFiles)]

            setFiles(newFiles);
        }
    };

    const removeExistingFile = (index: number) => {
        setExistingFiles(existingFiles?.filter((_: any, i: number) => i !== index));
    };

    const removeFiles = (index: number) => {
        setFiles(files?.filter((_: any, i: number) => i !== index));
    };

    console.log('files: ', files);

	return (
		<div className="mt-2 px-1 flex flex-col gap-2 w-full">
			<FileUpload
				light
				label={"Đính kèm tệp từ máy tính của bạn"}
				onChange={handleUploadFile}
			/>

            <div className="my-2">
                <div className="grid grid-cols-3 gap-6 bg-gray-100/50 p-2">
                    {
                        <>
                            {existingFiles?.map((fileUrl: any, index: number) => (
                                <div key={`existing-${index}`} className="relative">
                                    <Image src={fileUrl} alt={`Uploaded ${index}`} className="w-48 h-auto" />
                                    <button
                                        onClick={() => removeExistingFile(index)}
                                        className="z-50 bg-red-100/80 hover:bg-red-200 absolute right-1 top-1 ml-1 shadow-[rgba(255_255_255_0.27)_0px_0px_0.25em_rgba(255_255_255_0.05)_0px_0.25em_1em] bg-btn-detail hover:bg-btn-detail-hover rounded-full p-1 cursor-pointer"
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                            ))}

                            {files?.map((file: any, index: number) => (
                                <div key={`new-${index}`} className="relative">
                                    <Image src={URL.createObjectURL(file)} alt={`New ${index}`} className="w-48 h-auto" />
                                    <button
                                        onClick={() => removeFiles(index)}
                                        className="z-50 bg-red-100/80 hover:bg-red-200 absolute right-1 top-1 ml-1 shadow-[rgba(255_255_255_0.27)_0px_0px_0.25em_rgba(255_255_255_0.05)_0px_0.25em_1em] bg-btn-detail hover:bg-btn-detail-hover rounded-full p-1 cursor-pointer"
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                            ))}
                        </>
                    }
                </div>
            </div>
		</div>
	);
}

export default Attachments;
