import { osTemplate } from "@/constants/os-templates";
import { Avatar } from "@heroui/react";
import { useMemo } from "react";

function RenderIconOs({ osName }: { osName: string }) {
    const src = useMemo(() => {
        const findOs = osTemplate?.find(os => os?.name === osName);

        if (findOs) {
            return findOs.img;
        }

        return "/images/server-icon.svg"
    }, [osName]);

    return (
        <Avatar 
            src={src} 
            isBordered
            className="w-8 h-8 text-large bg-transparent ring-default ring-1" 
        />
    );
}

export default RenderIconOs;