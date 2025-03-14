import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { stringInfoVps } from "@/utils/digital-ocean";
import { Button, Tooltip } from "@heroui/react";
import { IoIosEye } from "react-icons/io";
import { SiGooglecloudstorage } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import ModalAddVPSLoadBalancer from "./ModalAddVPSLoadBalancer";
import { FaRegTrashCan } from "react-icons/fa6";
import showToast from "@/utils/toast";
import digitalOceanBuCloudApi from "@/apis/digital-ocean-bucloud.api";

function ListVPSInLoadBalancer({ info, setRender }: any) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openModalAddVPS, setOpenModalAddVPS] = useState(false);
  const columns = [
    { _id: "nameVPS", name: "Tên VPS", className: "text-left w-1/3" },
    { _id: "networks", name: "Địa chỉ IP", className: " w-1/5" },
    { _id: "actions", name: "Hành động", className: "w-1/5" },
  ];
  const handleDetailVPS = (item: any) => {
    navigate(`/vps/bu-cloud/digital-ocean/${item?._id}/overview`);
  };
  const handleRemoveVps = async (item: any) => {
    setLoading(true);
    const { data: result } =
      await digitalOceanBuCloudApi.removeVPSLoadBalancerDigitalOcean(
        item?.droplet_id,
        info
      );
    setLoading(false);
    if (!result?.status) {
      showToast("Remove VPS ra khỏi Load Balancer không thành công", "error");
      return;
    }
    showToast("Remove VPS ra khỏi Load Balancer  thành công", "success");
    setRender((prev: any) => !prev);
  };
  const isDisable = info?.status === "terminated";
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "nameVPS":
        return (
          <div className="text-left">
            <div className=" flex gap-4">
              <SiGooglecloudstorage className="my-auto" />
              <p className="font-bold text-[#0069ff]">
                {item.status !== "new" ? (
                  <Link to={`/vps/digital-ocean/${item?._id}/overview`}>
                    {item?.nameVPS}
                  </Link>
                ) : (
                  item?.nameVPS
                )}
              </p>
            </div>
            <div>
              <p>{stringInfoVps(item)}</p>
            </div>
          </div>
        );
      case "networks":
        return (
          <div className="text-center">
            <p>{item?.networks?.v4[0]?.ip_address}</p>
            <p>{item?.networks?.v4[1]?.ip_address}</p>
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2 justify-center">
            <Tooltip
              content={"Xem chi tiết"}
              color="warning"
              className={`capitalize`}
            >
              <Button
                variant="solid"
                radius="full"
                color="warning"
                className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                onPress={() => handleDetailVPS(item)}
              >
                <IoIosEye className="min-w-max text-base w-4 h-4 text-light" />
              </Button>
            </Tooltip>
            <Tooltip
              content={"Xóa VPS ra khỏi Load Balancer"}
              color="warning"
              className={`capitalize`}
            >
              <Button
                variant="solid"
                radius="full"
                color="danger"
                className={`min-w-0 w-max p-[6px] h-max min-h-max`}
                onPress={() => handleRemoveVps(item)}
              >
                <FaRegTrashCan className="min-w-max text-base w-4 h-4 text-light" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between my-4">
        <h3 className="font-bold first-letter:my-auto">
          Danh sách các VPS đang sử dụng{" "}
        </h3>
        <Button
          className="bg-primary"
          onPress={() => setOpenModalAddVPS(true)}
          isDisabled={isDisable}
        >
          <IoMdAdd className="my-auto" /> Thêm VPS
        </Button>
      </div>
      <Container>
        <TableControl
          tableId={"vpsmanagementloadbalancer"}
          columns={columns}
          data={info?.listVPSInLoadBalancer}
          total={info?.listVPSInLoadBalancer?.length || 0}
          renderCell={renderCell}
          isLoading={loading}
        />
      </Container>
      <ModalAddVPSLoadBalancer
        isOpenModal={openModalAddVPS}
        onOpenModal={setOpenModalAddVPS}
        info={info}
        setRender={setRender}
      />
    </div>
  );
}

export default ListVPSInLoadBalancer;
