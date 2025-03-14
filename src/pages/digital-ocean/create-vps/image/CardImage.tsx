import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataImageDigitalOcean } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-image.slice";
import { Image } from "@heroui/react";

function CardImage({ image }: any) {
  const { selectedImage }: any = useAppSelector(
    (state) => state.digitalOceanImage
  );
  const dispatch = useAppDispatch();
  return (
    <>
      <div
        className={`border py-4 px-8 flex flex-col text-center justify-center items-center hover:cursor-pointer hover:bg-[#F1F1F1] ${
          selectedImage._id === image._id
            ? "border-primary bg-[#F1F1F1] text-primary"
            : ""
        }`}
        onClick={() =>
          dispatch(
            setDataImageDigitalOcean({
              selectedImage: image,
              selectedVersionImage: new Set([image.data[0].slug]),
            })
          )
        }
      >
        <Image
          alt=""
          src={
            selectedImage._id === image._id
              ? `/digital-ocean-image/${image._id}/select.png`
              : `/digital-ocean-image/${image._id}/unSelect.png`
          }
          width={50}
          height={50}
          className="mx-auto mb-4"
        />
        {image._id}
      </div>
    </>
  );
}

export default CardImage;
