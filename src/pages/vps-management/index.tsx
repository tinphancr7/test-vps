import paths from "@/routes/paths";
import { Navigate } from "react-router-dom";

function VpsManagement() {
    return (  
        <Navigate to={paths.vps_management_vietstack} />
    );
}

export default VpsManagement;