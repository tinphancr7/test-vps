import {useMemo} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {useAppSelector} from "@/stores";
import moment from "moment";

function Charts() {
	const {service, vm} = useAppSelector((state) => state.detailVps);

	// Memoize common dataX (dates) for both CPU and Memory charts
	const dataX = useMemo(() => {
		if (service?.extra_details?.usage?.log) {
			return Object.keys(service.extra_details.usage.log).map((key) =>
				moment(key).format("DD/MM/YYYY HH:mm")
			);
		}
		return [];
	}, [service]);

	// Memoize CPU usage data
	const listCpus = useMemo(() => {
		if (service?.extra_details?.usage?.log) {
			const series = Object.keys(service.extra_details.usage.log).map((key) => [
				moment(key).format("DD/MM/YYYY HH:mm"),
				Number(
					(
						(service.extra_details.usage.log[key]?.cpu /
							service.extra_details.usage.log[key]?.maxcpu) *
						100
					).toFixed(2)
				),
			]);
			return {dataX, series: [{name: "CPU", data: series}]};
		}
		return {dataX: [], dataY: []};
	}, [service, dataX]);

	// Memoize Memory usage data
	const listMem = useMemo(() => {
		if (service?.extra_details?.usage?.log) {
			const total = dataX.map((date) => [date, vm?.memory]);
			const series = Object.keys(service.extra_details.usage.log).map((key) => [
				moment(key).format("DD/MM/YYYY HH:mm"),
				Number(
					(
						service.extra_details.usage.log[key]?.mem *
						service.extra_details.usage.log[key]?.mem_unit
					).toFixed(2)
				),
			]);
			return {
				dataX,
				series: [
					{name: "Tổng", data: total},
					{name: "Usage", data: series},
				],
			};
		}
		return {dataX: [], series: []};
	}, [service, vm, dataX]);

	// Memoize Memory usage data
	const listDisk = useMemo(() => {
		if (service?.extra_details?.usage?.log) {
			const series = Object.keys(service.extra_details.usage.log).map((key) => [
				moment(key).format("DD/MM/YYYY HH:mm"),
				Number(service.extra_details.usage.log[key]?.maxdisk.toFixed(2)),
			]);
			return {
				dataX,
				series: [{name: "Disk IO", data: series}],
			};
		}
		return {dataX: [], series: []};
	}, [service, vm, dataX]);

	// CPU chart options
	const optionsCpu = useMemo(() => {
		return {
			chart: {type: "spline", height: 600},
			title: {text: "CPU usage %"},
			xAxis: {categories: listCpus.dataX, minPadding: 0.05, maxPadding: 0.05},
			yAxis: {
				max: 100,
				tickInterval: 10,
				labels: {format: "{value}%"},
				title: {text: "Percentage"},
			},
			plotOptions: {
				spline: {
					marker: {radius: 4, lineColor: "#666666", lineWidth: 1},
				},
			},

			series: listCpus.series,
		};
	}, [listCpus]);

	// Memory chart options
	const optionsMem = useMemo(() => {
		return {
			chart: {type: "spline", height: 600},
			title: {text: "Memory usage"},
			xAxis: {categories: listMem.dataX},
			yAxis: {title: {text: "MBytes"}, labels: {format: "{value}"}},
			tooltip: {crosshairs: true, shared: true},
			plotOptions: {
				spline: {
					marker: {radius: 4, lineColor: "#666666", lineWidth: 1},
				},
			},
			series: listMem.series,
		};
	}, [listMem]);

	// Disk chart options

	const optionsDisk = useMemo(() => {
		return {
			chart: {type: "spline", height: 600},
			title: {text: "Disk IO"},
			xAxis: {categories: listMem.dataX},
			yAxis: {title: {text: "Bytes/s"}, labels: {format: "{value}"}},
			tooltip: {crosshairs: true, shared: true},
			plotOptions: {
				spline: {
					marker: {radius: 4, lineColor: "#666666", lineWidth: 1},
				},
			},
			series: listDisk.series,
		};
	}, [listDisk]);

	return (
		<div className="space-y-10 overflow-auto scroll-main max-h-[72dvh]">
			<HighchartsReact highcharts={Highcharts} options={optionsCpu} />
			<HighchartsReact highcharts={Highcharts} options={optionsMem} />
			<HighchartsReact highcharts={Highcharts} options={optionsDisk} />
		</div>
	);
}

export default Charts;
