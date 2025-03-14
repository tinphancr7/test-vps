import { useAppSelector } from "@/stores";

function StorageTab() {
    const { instance } = useAppSelector(
        (state) => state.awsLightsail
    );

    return (
        <div>
            <div className="text-2xl">System Disk</div>
            <div className="mt-4 flex items-start gap-4 rounded-[12px] border p-4">
                <div>
                    <img
                        className="w-[64px]"
                        src="/imgs/aws/system-disk.png"
                        alt=""
                    />
                </div>

                <div className="w-full">
                    <div className="text-xl font-semibold tracking-wide">System_Disk</div>
                    <div className="text-gray-500">
                        {instance?.['vps_id']?.hardware?.disks?.[0]?.sizeInGb} GB, block storage
                        disk
                    </div>
                    <div className="mt-2 min-w-full border-t pt-2">
                        Disk path: <b>{instance?.['vps_id']?.hardware?.disks?.[0]?.path}</b>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StorageTab;
