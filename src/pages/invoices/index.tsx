import paths from "@/routes/paths";
import { Navigate } from "react-router-dom";

function Invoices() {
    return <Navigate to={paths.invoices_vietstack} />;
}

export default Invoices;