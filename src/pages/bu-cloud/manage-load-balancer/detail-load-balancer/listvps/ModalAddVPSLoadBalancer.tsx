import digitalOceanBuCloudApi from "@/apis/digital-ocean-bucloud.api";
import digitalOceanRegionApi from "@/apis/digital-ocean-region.api";
import showToast from "@/utils/toast";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

function ModalAddVPSLoadBalancer({
  isOpenModal,
  onOpenModal,
  info,
  setRender,
}: any) {
  const [listVPS, setListVPS] = useState([]);
  const [listVPSSelected, setListVPSSelected] = useState(new Set([]));
  const [loading, setLoading] = useState(false);
  const getListVPSInRegion = async () => {
    const response =
      await digitalOceanRegionApi.getAllVPSByTeamIdInRegionBuCloud(
        info?.selectedRegion?.slug,
        info?.teamID
      );
    setListVPS(response?.data?.data);
  };

  // tìm vps chưa tồn tại trong load balancer đó
  const listVPSWithoutVPS = useMemo(() => {
    return listVPS?.filter((item: any) => {
      return !info?.droplet_ids?.includes(item.idDOVPS);
    });
  }, [listVPS, info]);

  const handleAddVPSIntoLoadBalancer = async () => {
    setLoading(true);
    const req = {
      droplet_ids: [...listVPSSelected],
    };
    const { data: add } =
      await digitalOceanBuCloudApi.addVPSIntoLoadBalancerDigitalOcean(
        info?._id,
        req
      );
    console.log(add);
    setLoading(false);
    if (!add?.status) {
      showToast("Thêm VPS vào Load Balancer không thành công", "error");
      return;
    }
    showToast("Thêm VPS vào Load Balancer thành công", "success");
    onOpenModal(false);
    setRender((prev: any) => !prev);
  };

  const handleSelectionChange = (value: any) => {
    setListVPSSelected(value);
  };
  const disableBtn = [...listVPSSelected].length === 0;

  useEffect(() => {
    getListVPSInRegion();
  }, [info]);

  return (
    <div>
      <Modal
        isOpen={isOpenModal}
        onOpenChange={(value: any) => {
          setListVPSSelected(new Set([]));
          onOpenModal(value);
        }}
        size="4xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div>
                  <p>Danh sách các VPS</p>
                  <p>Có trong khu vực - {info?.region?.name}</p>
                  <p>Thuộc team: {info?.teamOwner}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Select
                  aria-label="drop-let"
                  items={listVPSWithoutVPS}
                  radius="none"
                  variant="bordered"
                  isMultiline={true}
                  selectionMode="multiple"
                  placeholder="Chọn VPS"
                  labelPlacement="outside"
                  className="mt-4"
                  classNames={{
                    trigger: "min-h-12 py-2",
                    mainWrapper: "border-black",
                  }}
                  onSelectionChange={handleSelectionChange}
                  // selectedKeys={selectedVPSInRegion}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item: any) => (
                          <Chip radius="none" key={item?.data?.idDOVPS}>
                            {item?.data?.nameVPS} - {item?.data?.team} -{" "}
                            {item?.data?.created_by}
                          </Chip>
                        ))}
                      </div>
                    );
                  }}
                >
                  {(listVPS: any) => (
                    <SelectItem
                      key={listVPS?.idDOVPS}
                      textValue={listVPS?.nameVPS}
                    >
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">
                            <strong>{listVPS?.nameVPS}</strong>
                            {" - "}
                            <strong>{listVPS?.team}</strong>
                            {" - "}
                            <strong>{listVPS?.created_by}</strong>
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-4">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Đóng
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleAddVPSIntoLoadBalancer}
                    isDisabled={disableBtn}
                    isLoading={loading}
                  >
                    Thêm
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ModalAddVPSLoadBalancer;
