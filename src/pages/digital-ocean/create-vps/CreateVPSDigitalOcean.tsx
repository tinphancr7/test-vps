import { useEffect } from "react";
import AddStorageDigitalOcean from "./add-storage/AddStorageDigitalOcean";
import BackupsDropletDigitalOcean from "./backup/BackupVPSDigitalOcean";
import ConfirmBuyVPS from "./button-confirm/ConfirmBuyVPS";
import ImageDigitalOcean from "./image/ImageDigitalOcean";
import NameVPSDigitalOcean from "./name-vps/NameVPSDigitalOcean";
import RegionDigitalOcean from "./region/RegionDigitalOcean";
import SizeDigitalOcean from "./size/SizeDigitalOcean";
import { useAppDispatch } from "@/stores";
import { setDataAddStorageDigitalOcean } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-storage.slice";
import Container from "@/components/container";

function CreateVPSDigitalOcean({ type }: any) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(
            setDataAddStorageDigitalOcean({
                addStorage: {},
                statusCustomStorage: "IDLE",
                isSelectedCustomStorage: false,
                isSelectAddStorage: false,
            })
        );
    }, []);

    return (
        <Container className="overflow-auto scroll-main pb-0">
            <p className="font-bold text-2xl">Tạo VPS bằng Digital Ocean</p>
            <RegionDigitalOcean />
            <ImageDigitalOcean />
            <SizeDigitalOcean />
            <AddStorageDigitalOcean />
            <BackupsDropletDigitalOcean />
            <NameVPSDigitalOcean />
            <ConfirmBuyVPS type={type} />
        </Container>
    );
}

export default CreateVPSDigitalOcean;
