import ChartConnections from "./ChartConnections";
import ChartHTTPReqPerSeccond from "./ChartHTTPReqPerSeccond";
function FrontendLoadBalancer() {
    // const listChart = [
    //     {
    //         name: "HTTP Request per second",
    //         key: "frontend_http_requests_per_second",
    //     },
    //     {
    //         name: "Connections",
    //         key: "frontend_connections_current",
    //     },
    //     {
    //         name: "Load Balancer CPU Utilization",
    //         key: "frontend_cpu_utilization",
    //     },
    //     {
    //         name: "Traffic Received/Sent",
    //         key: "",
    //     },
    //     {
    //         name: "HTTP Response",
    //         key: "frontend_http_responses",
    //     },
    //     {
    //         name: "TLS Connections",
    //         key: [
    //             "frontend_tls_connections_limit",
    //             "frontend_tls_connections_current",
    //             "frontend_tls_connections_exceeding_rate_limit",
    //         ],
    //     },
    // ];
    return (
        <div>
            <h3 className="font-bold">Frontend</h3>
            <div className="">
                <ChartHTTPReqPerSeccond />
                <ChartConnections />
            </div>
        </div>
    );
}

export default FrontendLoadBalancer;
