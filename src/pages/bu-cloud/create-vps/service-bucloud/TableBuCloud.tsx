import manageGofiberAPI from "@/apis/manage-gofiber.api";
import TableControl from "@/components/table-control";
import { parseDesVpsVng } from "@/utils/parse-desc-vps-vng";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/routes/paths";
import { Button } from "@heroui/react";
import Container from "@/components/container";

function TableBuCloud() {
  const [listDataProduct, setListDataProduct] = useState([]);
  const columns = [
    { _id: "name", name: "Gói" },
    { _id: "ram", name: "Ram" },
    {
      _id: "processor",
      name: "Processor",
    },
    { _id: "storage", name: "Storage" },
    { _id: "transfer", name: "Data Transfer" },
    { _id: "m", name: "Giá" },
    { _id: "action", name: "Hành động" },
  ];
  const navigate = useNavigate();
  const handleCreateVPSBuCloud = (item: any) => {
    navigate(`${paths.bu_cloud}/${item?._id}`, {
      state: { item, keyTab: "bu-cloud" },
    });
  };
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "plan":
        return <div className="text-left"></div>;
      case "ram": {
        const data = parseDesVpsVng(item.description);
        return <p className="font-bold">{data.RAM}</p>;
      }
      case "processor": {
        const data = parseDesVpsVng(item.description);
        return <p className="font-bold">{data.CPU}</p>;
      }
      case "storage": {
        const data = parseDesVpsVng(item.description);
        return <p className="font-bold">{data.SSD}</p>;
      }
      case "transfer": {
        const data = parseDesVpsVng(item.description);
        return <p className="font-bold">{data["Data Transfer"]}</p>;
      }
      case "m": {
        const calculatorTotal = cellValue * 1.1;
        return (
          <p className="font-bold">
            {convertVnToUsd(calculatorTotal, "BuCloud")} $
          </p>
        );
      }
      case "action":
        return (
          <div className="flex gap-2 justify-center">
            <Button
              className="bg-primary text-white font-semibold"
              onPress={() => handleCreateVPSBuCloud(item)}
            >
              Khởi tạo
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const getListVPSVNGBuCloud = async () => {
    const result = await manageGofiberAPI.getAllProductsByCategoriesBuCloud(
      "3"
    );
    setListDataProduct(result.data.data);
  };
  useEffect(() => {
    getListVPSVNGBuCloud();
  }, []);

  return (
    <Container>
      <TableControl
        tableId={"bucloud"}
        columns={columns}
        data={listDataProduct}
        total={0}
        renderCell={renderCell}
      />
    </Container>
  );
}

export default TableBuCloud;
