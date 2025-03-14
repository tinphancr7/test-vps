import Container from "@/components/container";
import { useAppDispatch, useAppSelector } from "@/stores";
import { getZoneAnalytic } from "@/stores/async-thunks/cloud-flare-ssl.thunk";
import { CircularProgress, Tab, Tabs } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { PiBookOpenText } from "react-icons/pi";
import { useParams } from "react-router-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";

// Tabs for different time ranges
const tabs = [
  { label: "24 giờ", value: 24 },
  { label: "7 ngày", value: 24 * 7 },
  { label: "30 ngày", value: 24 * 30 },
];

function CloudflareOverview() {
  const { domainName } = useAppSelector((state) => state.cloudFlareSsl);

  const { id: zone_id = "" } = useParams();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState("24");
  const [options, setOptions] = useState([]);
  const { loadingAnalytic } = useAppSelector((state) => state.cloudFlareSsl);

  // Get the datetime range based on the selected tab
  const getLast24Hours = (hour: number) => {
    const parseTime = hour * 60 * 60 * 1000;
    const now = new Date();
    const past24Hours = new Date(now.getTime() - parseTime);
    now.setSeconds(0, 0);
    past24Hours.setSeconds(0, 0);
    now.setMinutes(0, 0);
    past24Hours.setMinutes(0, 0);
    return {
      datetimeStart: past24Hours.toISOString(),
      datetimeEnd: now.toISOString(),
    };
  };

  // Sync the extremes of the charts for zooming
  const syncExtremes = (e: any) => {
    if (e.trigger !== "syncExtremes") {
      Highcharts.charts.forEach((chart: any) => {
        if (chart && chart.xAxis[0].setExtremes) {
          chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
            trigger: "syncExtremes",
          });
        }
      });
    }
  };

  // Fetch analytic data and process it
  const fetchDataAnalytic = async (
    { hour, type }: { hour: number; type: "date" | "datetime" },
    tabValue?: string
  ) => {
    const { datetimeStart, datetimeEnd } = getLast24Hours(hour);

    const response = await dispatch(
      getZoneAnalytic({
        zone_id,
        since:
          type === "date"
            ? moment(datetimeStart).format("YYYY-MM-DD")
            : datetimeStart,
        until:
          type === "date"
            ? moment(datetimeEnd).format("YYYY-MM-DD")
            : datetimeEnd,
        type,
      })
    ).unwrap();

    const data: any = response?.data?.viewer?.zones[0]?.zones || [];
    const dataset: any = {
      unique: {
        name: "Unique Visitors",
        unit: "",
        data: [],
      },
      requests: {
        name: "Total Requests",
        unit: "",
        data: [],
      },
      perCached: {
        name: "Percent Cached",
        unit: "%",
        data: [],
      },
      served: {
        name: "Total Data Served",
        unit: "kB",
        data: [],
      },
      dataCached: {
        name: "Data Cached",
        unit: "kB",
        data: [],
      },
    };

    const categories = data?.map((it: any) =>
      Number(tabValue) > 24
        ? moment(it?.dimensions?.timeslot).format("DD MMMM")
        : moment(it?.dimensions?.timeslot).format("hh:mm A")
    );

    // Process the data from the API response
    for (const item of data) {
      const uniq = item?.uniq?.uniques || 0;
      const requests = item?.sum?.requests || 0;
      const perCached = item?.sum?.cachedBytes
        ? parseFloat(
            ((item?.sum?.cachedBytes / item?.sum?.bytes || 0) * 100).toFixed(2)
          )
        : 0;
      const served = Math.round(item?.sum?.bytes / 1000);
      const dataCached = Math.round(item?.sum?.cachedBytes / 1000);

      dataset?.unique?.data?.push(uniq);
      dataset?.requests?.data?.push(requests);
      dataset?.perCached?.data?.push(perCached);
      dataset?.served?.data?.push(served);
      dataset?.dataCached?.data?.push(dataCached);
    }

    // Generate chart options based on the dataset
    const optionsConfig: any = Object.keys(dataset).map((key) => ({
      chart: {
        height: 130,
        marginLeft: 40,
        spacingTop: 20,
        spacingBottom: 20,
        zooming: {
          type: "x",
        },
        events: {
          load: function () {
            const chart = this;
            if (!chart.series) return;

            chart.container.onmousemove = function (e) {
              const event = chart.pointer.normalize(e);
              Highcharts.charts.forEach((syncedChart) => {
                if (syncedChart && syncedChart.pointer) {
                  syncedChart.pointer.onContainerMouseMove(event);
                }
              });
            };
          },
        },
      },
      title: {
        text: dataset[key]?.name || "",
        align: "left",
        margin: 0,
        x: 30,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        crosshair: true,
        labels: {
          enabled: false,
        },
        events: {
          setExtremes: syncExtremes,
        },
        categories,
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          enabled: false,
        },
      },
      tooltip: {
        shared: true, // Để đảm bảo tooltip hiển thị trên tất cả biểu đồ
        formatter: function () {
          return `
                    <b>${this.x}</b><br/>
                    ${this.series.name}: <b>${this.y}</b> ${
            this.series.userOptions.tooltip.valueSuffix || ""
          }
                    `;
        },
      },
      series: [
        {
          data: dataset[key]?.data || [],
          name: dataset[key]?.name || "",
          type: "area",
          color: "#4693ff",
          fillOpacity: 0.3,
          tooltip: { valueSuffix: " " + dataset[key]?.unit },
          marker: { enabled: true },
        },
      ],
    }));

    setOptions(optionsConfig);
  };

  useEffect(() => {
    if (zone_id) {
      fetchDataAnalytic({ hour: Number(tab), type: "datetime" }, tab);
    }
  }, [zone_id]);

  const handleChangeTab = (value: any) => {
    setTab(value);

    const payload: { hour: number; type: "date" | "datetime" } = {
      hour: Number(value),
      type: "datetime",
    };

    if (Number(value) > 24) {
      payload["type"] = "date";
    }

    fetchDataAnalytic(payload, value);
  };

  const rangeTimeTab = useMemo(() => {
    const { datetimeStart, datetimeEnd } = getLast24Hours(Number(tab));
    return `${moment(datetimeStart).format("DD MMMM")} — ${moment(
      datetimeEnd
    ).format("DD MMMM")}`;
  }, [tab]);

  return (
    <div className="flex flex-col gap-3 scroll-main h-full overflow-auto p-1">
      <Container className="p-4">
        <p className="text-base mb-3">
          Giám sát tính bảo mật và hiệu suất của {domainName}. Cấu hình sản phẩm
          và dịch vụ từ menu.
        </p>

        <a
          className="flex gap-2 items-center cursor-pointer px-4 rounded-full bg-transparent text-sm border border-primary-500 w-max h-7 text-primary-500 hover:bg-primary-100/50"
          target="_blank"
          rel="noopener noreferrer"
          href="https://developers.cloudflare.com/fundamentals/"
        >
          <PiBookOpenText className="w-4 h-4" />
          Xem lại các nguyên tắc cơ bản của Cloudflare
        </a>
      </Container>

      <Container className="p-4">
        <div className="flex justify-between gap-2">
          <Tabs
            aria-label="Options"
            color="primary"
            variant="solid"
            classNames={{
              tabList:
                "gap-6 w-max min-w-96 relative rounded-none p-0 overflow-x-auto pb-0",
              cursor: "w-full bg-primary",
              tab: "px-2",
              tabContent:
                "group-data-[selected=true]:font-bold uppercase font-medium text-sm tracking-wider",
            }}
            onSelectionChange={handleChangeTab}
          >
            {tabs?.map((item) => (
              <Tab key={item?.value} title={<span>{item.label}</span>} />
            ))}
          </Tabs>

          <p className="uppercase tracking-wider text-base font-medium">
            {rangeTimeTab}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {loadingAnalytic ? (
            <div className="flex items-center justify-center h-96">
              <CircularProgress color="primary" size="lg" />
            </div>
          ) : (
            !!options?.length &&
            options?.map((ot, index) => (
              <div key={index}>
                <HighchartsReact highcharts={Highcharts} options={ot} />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}

export default CloudflareOverview;
