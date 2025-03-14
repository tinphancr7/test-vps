import digitalOceanApi from "@/apis/digital-ocean.api";
import Container from "@/components/container";
import TableControl from "@/components/table-control";
import { useAppSelector } from "@/stores";
import { eventAction } from "@/utils/digital-ocean";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function HistoryActionVPS() {
    const { id } = useParams();
    const [listAction, setListAction] = useState<any>({});
    const historyAction = useAppSelector(
        (state) => state.table["historyAction"]
    );
    const getListActionVPS = async (query: any) => {
        const result = await digitalOceanApi.getActionDigitalOcean({
            ...query,
            id,
        });
        setListAction(result?.data?.data);
    };

    useEffect(() => {
        const query: any = {};

        const cPageSize = historyAction?.pageSize
            ? // eslint-disable-next-line no-unsafe-optional-chaining
              [...historyAction?.pageSize][0]
            : 10;
        query["pageIndex"] = historyAction?.pageIndex || 1;
        query["pageSize"] = cPageSize;
        getListActionVPS(query);
    }, [historyAction]);

    const columns = [
        { _id: "event", name: "Sự kiện", className: "text-left w-1/3" },
        {
            _id: "time",
            name: "Thời gian",
        },
        { _id: "exec_time", name: "Thời gian thực hiện", className: "" },
    ];
    const renderCell = (item: any, columnKey: string) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            case "event": {
                if (item?.status === "errored") {
                    return (
                        <div className="text-left">
                            <p>{eventAction(item?.type)}</p>
                            <p className="text-red-500">Lỗi khi thực hiện</p>
                        </div>
                    );
                }
                return <p className="text-left">{eventAction(item?.type)}</p>;
            }
            case "time":
                return (
                    <p>
                        {moment(item?.started_at).format("DD-MM-YYYY HH:mm:ss")}
                    </p>
                );
            case "exec_time": {
                const startTime = moment(item?.started_at);
                const completedTime = moment(item?.completed_at);

                const executionDuration = completedTime.diff(
                    startTime,
                    "seconds"
                );
                // Nếu thời gian thực thi >= 60 giây, chuyển đổi thành phút và giây
                if (executionDuration >= 60) {
                    const minutes = Math.floor(executionDuration / 60);
                    const seconds = executionDuration % 60;
                    return <p>{`${minutes} Phút ${seconds} Giây`}</p>;
                }
                return <p>{executionDuration + " Giây"}</p>;
            }
            default:
                return cellValue;
        }
    };

    return (
        <div className="p-4">
            <h3 className=" mb-4 text-2xl">Lịch sử sự kiện </h3>
            <Container>
                <TableControl
                    tableId={"historyAction"}
                    columns={columns}
                    data={listAction?.item}
                    total={listAction?.totalPages || 0}
                    renderCell={renderCell}
                />
            </Container>
        </div>
    );
}

export default HistoryActionVPS;
