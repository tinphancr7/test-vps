import digitalOceanApi from "@/apis/digital-ocean.api";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function ChartHTTPReqPerSeccond() {
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
    const [data, setData] = useState([]);
    const dataConvert = useMemo(() => {
        return convertData(data);
    }, [data]);

    const getData = async () => {
        const result = await digitalOceanApi.getDataChartLoadBalancerHTTPReq(
            id
        );
        if (!result?.data?.status) {
            return;
        }
        setData(result?.data?.data?.result[0].values);
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
            text: "HTTP Request per second",
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
        yAxis: {
            title: {
                text: "reqs/s",
            },
        },
        tooltip: {
            shared: true,
            formatter: function (this: any): any {
                let tooltipHtml = `<b>${moment(this.x)
                    .utcOffset(7)
                    .format("HH:mm")}</b><br/>`;
                this.points.forEach((point: any) => {
                    tooltipHtml += `Value: <b>${point.y} reqs/s</b><br/>`;
                });
                return tooltipHtml;
            },
        },
        legend: {
            enabled: false, // Tắt phần legend (chú thích)
        },
        series: [
            {
                data: dataConvert,
                pointStart: dataConvert[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(40, 167, 69, 0.3)",
            },
        ],
    };
    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default ChartHTTPReqPerSeccond;
