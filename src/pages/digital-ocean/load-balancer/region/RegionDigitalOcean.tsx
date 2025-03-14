import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  getAllListRegion,
  setDataRegion,
} from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-region.slice";
import CardRegion from "./CardRegion";
import { Select, SelectItem } from "@heroui/react";

function RegionDigitalOcean() {
  const dispatch = useAppDispatch();
  const { selectedRegion, listRegion, selectedDataCenter } = useAppSelector(
    (state) => state.digitalOceanRegion
  );
  useEffect(() => {
    dispatch(getAllListRegion());
  }, []);
  return (
    <div className="mt-4">
      <h1 className="font-bold mb-2">Chọn Khu vực </h1>
      <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
        {listRegion?.map((item: any) => (
          <CardRegion key={item._id} region={item} />
        ))}
      </div>
      <div className="my-2">
        <h1 className="font-bold mb-2">Chọn vùng đặt dữ liệu</h1>
        <Select
          className="max-w-xs"
          radius="none"
          variant="bordered"
          aria-label="datacenter"
          selectedKeys={selectedDataCenter}
          onSelectionChange={(value: any) => {
            dispatch(
              setDataRegion({
                selectedDataCenter: value,
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
          {(selectedRegion?.data_centers || [])?.map((item: any) => (
            <SelectItem
              key={item}
              textValue={`${selectedRegion.label} - ${item}`}
            >
              {selectedRegion.label} - {item}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default RegionDigitalOcean;
