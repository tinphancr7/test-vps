import awsLightsailApis from "@/apis/aws-lightsail.api";
import { useAppSelector } from "@/stores";
import showToast from "@/utils/toast";
import { BiLinkExternal } from "react-icons/bi";
import { PiDownloadSimpleBold } from "react-icons/pi";

function ConnectTab() {
    const { instance } = useAppSelector((state) => state.awsLightsail);

    const handleDownloadKeyPair = async () => {
        try {
            const { data } = await awsLightsailApis.getAwsLightsailKeyPair(
                instance?.["vps_id"]?._id
            );

            const pemString = data?.keyPair?.privateKeyBase64;

            if (pemString) {
                const blob = new Blob([pemString], {
                    type: "application/x-pem-file",
                });
                const link = document.createElement("a");

                link.href = URL.createObjectURL(blob);
                link.download = `${data?.keyPair?.name || "keypair"}.pem`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.log(error);

            showToast("Download thất bại!", "error");
        }
    };

    return (
        <>
            <div className="text-[20px] font-semibold">
                Use your own SSH client
            </div>

            <div className="mt-4">
                Use the following credentials to connect to your instance
            </div>

            <a
                href={
                    "https://docs.aws.amazon.com/en_us/lightsail/latest/userguide/amazon-lightsail-ssh-using-terminal.html"
                }
                target="_blank"
                className="mt-2 flex items-center gap-2 text-primary-500"
            >
                <div className="text-[16px] leading-4">
                    Connect using an SSH client
                </div>
                <BiLinkExternal className="text-primary-500" />
            </a>

            <div className="mt-4 rounded-[12px] border p-4">
                <div className="text-gray-400/90 tracking-wider font-medium">CONNECT TO</div>
                <div className="text-base font-bold text-gray-500 tracking-wide">
                    TPv6: {instance?.["vps_id"]?.ipv6Addresses}
                </div>
                <div className="mt-4 text-gray-400/90 tracking-wider font-medium">USER NAME</div>
                <div className="text-2xl font-semibold">
                    {instance?.["vps_id"]?.username}
                </div>
                <div className="mt-4 text-gray-400/90 tracking-wider font-medium">SSH KEY</div>
                <button
                    onClick={handleDownloadKeyPair}
                    className="flex items-center gap-2 font-semibold text-orange-600"
                >
                    <PiDownloadSimpleBold className="text-xl" />
                    <div>Download ssh key</div>
                </button>

                <p className="mt-2">This instance was created with the personal SSH key named <b className="break-words">{instance?.['vps_id']?.sshKeyName}</b></p>
            </div>
        </>
    );
}

export default ConnectTab;
