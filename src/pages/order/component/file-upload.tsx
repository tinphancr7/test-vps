import { Button, Image } from "@heroui/react";
import { useRef, useMemo } from "react";

function FileUpload({ src, onChange, ...rest }: any) {
    const ref = useRef<any>(null);

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
            onChange(files);
        }
    };

    const handleUploadFile = (event: any) => {
        onChange(event);
    };

    const renderImage = useMemo(() => {
        return (
            <div className="relative transition-all ease-linear duration-100">
                <Image
                    src={src || ""}
                    alt="NextUI Album Cover"
                    removeWrapper
                    className="w-full h-full"
                />

                <p className="transition-all ease-linear duration-100 absolute top-1/2 left-1/4 min-w-max -translate-x-[20%] -translate-y-[50%] text-dark font-medium text-sm text-wrap bg-light/80 rounded-full py-1 px-2">
                    Thả file vào đây hoặc click để tải lên
                </p>
            </div>
        )
    }, [src]);

    return (
        <div className="relative w-full h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
            <Button
                radius="sm"
                variant="bordered"
                className="px-0 py-0 min-w-full w-max h-48 border-dashed hover:border-primary"
                onPress={handleRefInput}
            >
                {renderImage}
            </Button>

            <input
                ref={ref}
                hidden
                accept="image/jpg image/jpeg image/png image/gif"
                multiple={false}
                type="file"
                onChange={handleUploadFile}
                {...rest}
            />
        </div>
    );
}

export default FileUpload;