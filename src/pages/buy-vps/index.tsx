import paths from "@/routes/paths";
import { Navigate } from "react-router-dom";

function BuyVps() {
    return <Navigate to={paths.vps_vietstack} />;
}

export default BuyVps;