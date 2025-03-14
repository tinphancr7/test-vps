import digitalOceanApi from "@/apis/digital-ocean.api";
import { Spinner } from "@heroui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment"; // Sử dụng moment để xử lý thời gian
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const convertData = (dataBandwidth: any, type: any) => {
    const find = dataBandwidth?.filter((item: any) => {
        return item.type === type;
    });
    if (find.length === 0) {
        return [];
    }
    const tmp = find[0];
    const transformedData = tmp?.data?.map((item: any) => {
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

function GraphsBandwidth() {
    const { id } = useParams();
    const [dataBandwidth, setDataBandwidth] = useState([]);

    const getDataBandWidthDigitalOcean = async () => {
        const result =
            await digitalOceanApi.getDataBandWithVPSBuCloudDigitalOcean(id);
        setDataBandwidth(result?.data?.data);
    };

    useEffect(() => {
        getDataBandWidthDigitalOcean();
    }, []);

    const pub_out = useMemo(() => {
        return convertData(dataBandwidth, "pub_out");
    }, [dataBandwidth]);
    const pub_in = useMemo(() => {
        return convertData(dataBandwidth, "pub_in");
    }, [dataBandwidth]);
    const pri_in = useMemo(() => {
        return convertData(dataBandwidth, "pri_in");
    }, [dataBandwidth]);
    const pri_out = useMemo(() => {
        return convertData(dataBandwidth, "pri_out");
    }, [dataBandwidth]);

    const options = {
        chart: {
            type: "area",
        },
        credits: {
            enabled: false,
        },
        title: {
            text: "Bandwidth ",
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
                text: "Data Usage", // Tiêu đề trục Y
            },
        },
        tooltip: {
            shared: true,
            formatter: function (this: any) {
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
                name: "Public Outbound",
                data: pub_out,
                pointStart: pub_out[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(0, 123, 255, 0.3)",
            },
            {
                name: "Public Inbound",
                data: pub_in,
                pointStart: pub_in[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(40, 167, 69, 0.3)",
            },
            {
                name: "Private Inbound",
                data: pri_in,
                pointStart: pri_in[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(255, 193, 7, 0.3)",
            },
            {
                name: "Private Outbound",
                data: pri_out,
                pointStart: pri_out[0]?.x,
                pointInterval: 2 * 60 * 1000,
                color: "rgba(255, 7, 7, 0.3)",
            },
        ],
    };

    if (dataBandwidth?.length >= 0) {
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

export default GraphsBandwidth;
