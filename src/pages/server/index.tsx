import paths from "@/routes/paths";
import { Navigate } from "react-router-dom";

function Server() {
    return (  
        <Navigate to={paths.server_vietstack} />
    );
}

export default Server;