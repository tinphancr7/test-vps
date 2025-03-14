function NetworkDigitalOcean({ info }: any) {
    const findPublicIPV4 = info?.networks?.v4.filter((item: any) => {
        return item.type === "public";
    });

    const findPrivateIPV4 = info?.networks?.v4.filter((item: any) => {
        return item.type === "private";
    });

    const findIPV6 = info?.networks?.v6.filter((item: any) => {
        return item.type === "public";
    });
    return (
        <div className="p-4">
            <p className="text-2xl ">Public Network</p>
            <div className="grid grid-cols-4 my-4">
                <div>
                    <p className="font-bold">PUBLIC IPV4 ADDRESS </p>
                    <p>{findPublicIPV4 && findPublicIPV4[0].ip_address}</p>
                </div>
                <div>
                    <p className="font-bold">PUBLIC GATEWAY </p>
                    <p>{findPublicIPV4 && findPublicIPV4[0].gateway}</p>
                </div>
                <div>
                    <p className="font-bold">SUBNET MASK </p>
                    <p>{findPublicIPV4 && findPublicIPV4[0].netmask}</p>
                </div>
            </div>

            <div className="grid grid-cols-2  my-8">
                <div>
                    <p className="font-bold">PUBLIC IPV6 ADDRESS </p>
                    <p>{findIPV6 && findIPV6[0]?.ip_address}</p>
                </div>
                <div>
                    <p className="font-bold">PUBLIC IPV6 GATEWAY </p>
                    <p>{findIPV6 && findIPV6[0]?.gateway}</p>
                </div>
            </div>
            <p className="text-2xl">Private Network</p>
            <div className="grid grid-cols-4 my-4">
                <div>
                    <p className="font-bold">PRIVATE IPV4 ADDRESS </p>
                    <p>{findPrivateIPV4 && findPrivateIPV4[0].ip_address}</p>
                </div>
                <div>
                    <p className="font-bold">PRIVATE GATEWAY </p>
                    <p>{findPrivateIPV4 && findPrivateIPV4[0].gateway}</p>
                </div>
                <div>
                    <p className="font-bold">SUBNET MASK </p>
                    <p>{findPrivateIPV4 && findPrivateIPV4[0].netmask}</p>
                </div>
            </div>
        </div>
    );
}
export default NetworkDigitalOcean;
