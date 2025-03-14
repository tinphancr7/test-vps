import digitalOceanApi from "@/apis/digital-ocean.api";
import { Spinner } from "@heroui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

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
            y: value,
            label,
        };
    });
    return transformedData;
};

function GraphsCPU() {
    const { id } = useParams();
    const [dataCPU, setDataCPU] = useState<any>([]);

    const getDataCPUVPSDigitalOcean = async () => {
        const result = await digitalOceanApi.getDataCPUVPSBuCloudDigitalOcean(
            id
        );
        setDataCPU(result?.data?.data);
    };
    useEffect(() => {
        getDataCPUVPSDigitalOcean();
    }, []);

    const systemCPU = useMemo(() => {
        return convertData(dataCPU?.systemCPU?.values);
    }, [dataCPU]);
    const userCPU = useMemo(() => {
        return convertData(dataCPU?.userCPU?.values);
    }, [dataCPU]);

    const options = {
        credits: {
            enabled: false,
        },
        chart: {
            type: "area",
        },
        title: {
            text: "CPU ",
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
                text: "Data Usage",
            },
        },
        tooltip: {
            shared: true,
            formatter: function (this: any): any {
                let tooltipHtml = `<b>${moment(this.x)
                    .utcOffset(7)
                    .format("HH:mm")}</b><br/>`;
                this.points.forEach((point: any) => {
                    tooltipHtml += `${point.series.name}: <b>${point.y} </b><br/>`;
                });
                return tooltipHtml;
            },
        },
        series: [
            {
                name: "System",
                data: systemCPU,
                pointStart: systemCPU[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(0, 123, 255, 0.3)",
            },
            {
                name: "User",
                data: userCPU,
                pointStart: userCPU[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(40, 167, 69, 0.3)",
            },
        ],
    };

    if (Object.keys(dataCPU).length >= 0) {
        return (
            <div>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        );
    }
    return (
        <div className="flex justify-center">
            <Spinner label="Loading..." />
        </div>
    );
}

export default GraphsCPU;
