import awsLightsailApis from "@/apis/aws-lightsail.api";
import showToast from "@/utils/toast";
import { BiLinkExternal } from "react-icons/bi";
import { PiDownloadSimpleBold } from "react-icons/pi";

function DownloadKeyPair({ instance }: any) {
    const handleDownloadSSHKey = async () => {
        try {
            const { data }: any = await awsLightsailApis.getAwsLightsailKeyPair(
                instance?._id
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
            showToast("Download KeyPair thất bại!", "error");
        }
    };

    return (
        <div className="">
            <div className="text-lg font-semibold">Use your own SSH client</div>
            <div className="mt-4">
                Sử dụng thông tin xác thực sau để kết nối với phiên bản của bạn
            </div>

            <a
                href={
                    "https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-ssh-in-amazon-lightsail"
                }
                target="_blank"
                className="mt-2 flex items-center gap-2 text-primary"
            >
                <div className="text-sm leading-3">
                    Connect using an SSH client
                </div>
                <BiLinkExternal className="text-primary" />
            </a>

            <div className="mt-4 rounded-[12px] border p-4">
                <div className="text-gray-400">CONNECT TO</div>
                <div className="text-sm font-semibold text-gray-500">
                    TPv6: {instance?.ipv6Addresses || ""}
                </div>
                <div className="mt-4 text-gray-400">USER NAME</div>
                <div className="text-2xl font-semibold">
                    {instance?.username || ""}
                </div>
                <div className="mt-4 text-gray-400">SSH KEY</div>
                <button
                    onClick={handleDownloadSSHKey}
                    className="flex items-center gap-2 font-semibold text-orange-600"
                >
                    <PiDownloadSimpleBold className="text-xl" />
                    <div>Download ssh key</div>
                </button>
            </div>
        </div>
    );
}

export default DownloadKeyPair;
