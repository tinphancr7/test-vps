import digitalOceanApi from "@/apis/digital-ocean.api";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function ChartConnections() {
    const { id } = useParams();
    const convertData = (value: any) => {
        if (!value) {
            return [];
        }
        const transformedData = value.map((item: any) => {
            const timestamp = item[0] * 1000;
            const value = parseFloat(item[1]);
            const date = new Date(timestamp);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            const label = `${hours}:${minutes}:${seconds}`;
            return {
                x: timestamp,
                y: parseFloat(value.toFixed(2)),
                label,
            };
        });
        return transformedData;
    };
    const [data, setData] = useState<any>();
    const dataConvertCurrent = useMemo(() => {
        return convertData(data?.current);
    }, [data]);
    const dataConvertLimit = useMemo(() => {
        return convertData(data?.limit);
    }, [data]);

    const getData = async () => {
        const result =
            await digitalOceanApi.getDataChartLoadBalancerConnections(id);
        setData(result?.data?.data);
    };

    useEffect(() => {
        getData();
    }, []);
    const options = {
        credits: {
            enabled: false,
        },
        chart: {
            type: "area",
        },
        title: {
            text: "Connections",
        },
        xAxis: {
            type: "datetime",
            labels: {
                formatter: function (this: any): string {
                    return moment(this.value).utcOffset(7).format("HH:mm");
                },
            },
            crosshair: {
                color: "#000",
                width: 1,
                dashStyle: "Solid",
            },
        },
        // yAxis: {
        //     title: {
        //         text: "reqs/s",
        //     },
        // },
        tooltip: {
            shared: true,
            useHTML: true, // Đảm bảo tooltip hỗ trợ HTML
            formatter: function (this: any): any {
                let tooltipHtml = `<b>${moment(this.x)
                    .utcOffset(7)
                    .format("HH:mm")}</b><br/>`;
                this.points.forEach(function (point: any) {
                    // Thêm dấu chấm màu vào trước tên series
                    tooltipHtml += `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${point.series.color};margin-right:5px;"></span>`;
                    tooltipHtml += `${point.series.name}: <b>${point.y}</b><br/>`;
                });
                return tooltipHtml;
            },
        },
        legend: {
            enabled: false, // Tắt phần legend (chú thích)
        },
        series: [
            {
                data: dataConvertCurrent,
                pointStart: dataConvertCurrent[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(0, 123, 255, 0.3)",
                name: "Current",
            },
            {
                data: dataConvertLimit,
                pointStart: dataConvertLimit[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(40, 167, 69, 0.3)",
                name: "Limit",
            },
        ],
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default ChartConnections;
