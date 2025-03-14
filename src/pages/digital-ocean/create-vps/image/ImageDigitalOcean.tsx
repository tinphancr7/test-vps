import CardImage from "./CardImage";
import { useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  getAllListImage,
  setDataImageDigitalOcean,
} from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-image.slice";

function ImageDigitalOcean() {
  const dispatch = useAppDispatch();
  const { listImage, selectedImage, selectedVersionImage }: any =
    useAppSelector((state) => state.digitalOceanImage);

  useEffect(() => {
    dispatch(getAllListImage());
  }, []);
  return (
    <div className="my-4">
      <h1 className="font-bold mb-2">Chọn hệ điều hành</h1>
      <div className="grid lg:grid-cols-6 grid-cols-2 md:grid-cols-3 gap-4 ">
        {listImage?.map((image: any) => {
          return <CardImage key={image?._id} image={image} />;
        })}
      </div>
      <div className="my-2">
        <h1 className="font-bold mb-2">Chọn phiên bản</h1>
        <Select
          className="max-w-xs"
          radius="none"
          variant="bordered"
          aria-label="datacenter"
          selectedKeys={selectedVersionImage}
          onSelectionChange={(value: any) => {
            dispatch(
              setDataImageDigitalOcean({
                selectedVersionImage: value,
              })
            );
          }}
          disallowEmptySelection={true}
          popoverProps={{
            classNames: {
              base: "p-0",
              content: "rounded-none p-0",
            },
          }}
          listboxProps={{
            className: "p-0",
            itemClasses: { base: " rounded-none" },
          }}
          classNames={{
            trigger: "border",
          }}
        >
          {selectedImage?.data?.map((version: any) => (
            <SelectItem key={version.slug} textValue={version.description}>
              {version.description}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default ImageDigitalOcean;
