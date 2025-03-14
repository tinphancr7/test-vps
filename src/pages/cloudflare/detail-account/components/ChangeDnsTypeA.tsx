/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cloudflareApis from "@/apis/cloudflare-api";
import {
  Button,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ChangeDnsTypeA() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [newIp, setNewIp] = useState("");
  const handleChange = async () => {
    try {
      setIsChanging(true);
      const listIpMapping = data.map((dns) => dns?._id).join(",");
      await cloudflareApis.updateMassDnsRecord({
        ids: listIpMapping,
        ip: newIp,
      });
      toast.success("Thay đổi IP hàng loạt thành công!");
      handleSubmit();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra vui long thử lại sau!");
    } finally {
      setIsChanging(false);
    }
  };
  const handleSubmit = async () => {
    try {
      setIsSearching(true);
      const response: any = await cloudflareApis.getDnsBySearchIp({
        searchIp: search,
      });
      setData([...response?.data?.data] || []);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsSearching(false);
    }
  };
  const columns = [
    { _id: "zone_name", name: "Tên Domain", className: "" },
    { _id: "type", name: "Loại bản ghi", className: " " },
    { _id: "name", name: "Tên bản ghi", className: " " },
    { _id: "content", name: "Giá trị bản ghi", className: " " },
  ];
  const renderCell = (item: any, columnKey: string) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      default:
        return cellValue;
    }
  };
  return (
    <div className="container flex items-center gap-x-20 py-10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-2 items-end justify-start">
          <Input
            radius="sm"
            color="primary"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "h-10 data-[hover=true]:border-primary rounded border border-slate-400 ",
              label: "text-dark font-medium",
            }}
            type={"text"}
            label={"Nhập IP cần tìm"}
            placeholder={`Nhập địa chỉ IP ...`}
            value={search}
            onValueChange={setSearch}
          />
          <Button
            variant="solid"
            className={`float-right h-10 bg-primary text-light rounded text-base font-medium  max-md:text-sm`}
            isLoading={isSearching}
            onPress={handleSubmit}
          >
            Tìm kiếm
          </Button>
        </div>
        <Table
          isHeaderSticky
          classNames={{
            wrapper: `max-h-[50vh] scroll-main min-h-[200px] bg-transparent shadow-container rounded-md p-0`,
            table: "overflow-auto",
            tbody: "divide-y-1",
            th: "first:rounded-bl-none last:rounded-br-none uppercase text-center bg-primary text-light text-base font-bold",
            td: "text-base text-dark py-2 text-center group-aria-[selected=false]:group-data-[hover=true]:before:bg-gray-300/60",
          }}
          bottomContentPlacement="outside"
        >
          <TableHeader columns={columns}>
            {(column: any) => (
              <TableColumn
                key={column?._id}
                align={"start"}
                className={`text-sm font-bold  text-white`}
              >
                {column?.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isSearching}
            loadingContent={<Spinner label="Loading..." />}
            items={data}
            emptyContent={"Không có dữ liệu"}
          >
            {(item: any) => (
              <TableRow key={item?._id}>
                {(columnKey: any) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        {data.length > 0 && (
          <>
            <div className="flex gap-2 items-end justify-start">
              <Input
                radius="sm"
                color="primary"
                variant="bordered"
                labelPlacement="outside"
                classNames={{
                  inputWrapper:
                    "h-10 data-[hover=true]:border-primary rounded border border-slate-400 ",
                  label: "text-dark font-medium",
                }}
                type={"text"}
                label={"Nhập IP cần đổi"}
                placeholder={`Nhập địa chỉ IP ...`}
                value={newIp}
                onValueChange={setNewIp}
              />
              <Button
                variant="solid"
                className={`float-right h-10 bg-primary text-light rounded text-base font-medium  max-md:text-sm`}
                isLoading={isChanging}
                onPress={handleChange}
              >
                Thay đổi hàng loạt
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
