import paths from "@/routes/paths";
import { Navigate } from "react-router-dom";

function Dashboard() {
    return (
        <Navigate to={paths.statistics} />
    )
    /*
        return (  
            <Suspense fallback={<LazyLoadingPage />}>
                <div>Dashboard</div>
            </Suspense>
        );
    */
}

export default Dashboard;