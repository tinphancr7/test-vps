import { IconType } from "react-icons";

export interface SidebarItem {
    subject: string; 
    action: string;
    href: string;
    title: React.ReactElement | string;
    icon?: IconType;
}