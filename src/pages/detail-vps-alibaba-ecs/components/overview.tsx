import BasicInformationInstance from "./basic-information-instance";
import ConfigurationInformation from "./configuration-info";

function Overview() {
    return (
        <div className="flex flex-col gap-3">
            <BasicInformationInstance />

            <ConfigurationInformation />
        </div>
    )
}

export default Overview;