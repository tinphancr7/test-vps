import EstimatedCost from "./components/EstimatedCost";
import Instance from "./components/instance/Instance";
import InstanceNameForm from "./components/instance/InstanceNameForm";
import IPSelection from "./components/instance/IPSelection";
import OsCardList from "./components/os-image/OsCardList";
import SshKeysComponent from "./components/ssh-key/SSHKey";
import Team from "./components/team";
import StorageDetails from "./components/volume/StorageDetails";
import ZoneList from "./components/zone/ZoneList";

const steps = [
	{
		label: "Choose an Availability Zone",
		component: <ZoneList />,
		description:
			"An Availability Zone refers to the geographical location in which your Instance will be created.",
	},
	{
		label: "Select an team",
		component: <Team />,
		description: "Select a team to manage your resources.",
	},
	{
		label: "Select an Instance",
		component: <Instance />,
		description: "Compare our Instance offers and find the best for you.",
	},
	{
		label: "Choose an image",
		component: <OsCardList />,
		description:
			"The image that runs on your Instance. It can be an OS, an InstantApp or one of your custom images.",
	},
	{
		label: "Enter a name and optional tags",
		component: <InstanceNameForm />,
		description: "Set a unique name for your instance.",
	},
	{
		label: "Add volumes",
		component: <StorageDetails />,
		description:
			"Volumes are storage spaces used by your Instances. A block volume with a default name and 5,000 IOPS is automatically provided for your system volume. You can customize this volume and attach up up to 16 local and/or block type volumes as needed",
	},
	{
		label: "Network configuration",
		component: <IPSelection />,
		description:
			"Set up your Instance connectivity by assigning a public IP address (IPv4/IPv6), enabling direct communication between the Instance and the internet.",
	},
	{
		label: "SSH Keys",
		component: <SshKeysComponent />,
		description:
			"SSH keys are a secure way to log into your Instances through SSH. You have to set an existing public key to your project to connect to your Instance.",
	},
	{
		label: "Estimated cost",
		component: <EstimatedCost />,
		description:
			"Use this calculator to estimate the cost for this resource with your selected configurations. For this calculation, we consider that 1 month equals to 730 hours. Note that this does not represent the final cost nor engage you in consuming the chosen amount. You can delete your resources to stop billing whenever necessary.",
	},
];

const ScalewayRegister = () => {
	return (
		<div className="mx-auto max-w-5xl p-6">
			<h1 className="mb-8 text-center text-3xl font-semibold">
				Create an Instance
			</h1>

			<div className="space-y-8">
				{steps.map((step, index) => (
					<div
						key={index}
						className="rounded-lg border border-gray-200 bg-gray-50 p-6"
					>
						<div className="mb-4 flex items-center">
							<div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
								{index + 1}
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-800">
									{step.label}
								</h2>
								<p className="text-sm text-gray-600">{step.description}</p>
							</div>
						</div>
						<div className="mt-4">{step.component}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ScalewayRegister;
