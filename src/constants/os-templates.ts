import { FaDebian, FaLinux, FaUbuntu, FaWindows } from "react-icons/fa6";
import { GrCentos } from "react-icons/gr";

export const osTemplate = [
  {
    id: "36",
    idCustom: "302 win2019",
    name: "Windows Server 2019",
    subOrderPage: 1,
    icon: FaWindows,
    img: "/imgs/icon_win.svg",
  },
  {
    id: "293",
    idCustom: "302 win2022",
    name: "Windows Server 2022",
    subOrderPage: 1,
    icon: FaWindows,
    img: "/imgs/icon_win.svg",
  },
  {
    id: "634",
    idCustom: "302 win2022",
    name: "Windows 10",
    subOrderPage: 1,
    icon: FaWindows,
    img: "/imgs/icon_win.svg",
  },
  {
    id: "1084",
    idCustom: "302 win2022",
    name: "Windows Server 2012",
    subOrderPage: 1,
    icon: FaWindows,
    img: "/imgs/icon_win.svg",
  },
  {
    id: "118",
    idCustom: "256 ubuntu20.tino.org",
    name: "Ubuntu 20",
    subOrderPage: 2,
    icon: FaUbuntu,
    img: "/imgs/ubuntu.svg",
  },
  {
    id: "118",
    idCustom: "256 ubuntu20.tino.org",
    name: "Ubuntu 24",
    subOrderPage: 2,
    icon: FaUbuntu,
    img: "/imgs/ubuntu.svg",
  },
  {
    id: "283",
    idCustom: "256 ubuntu18.tino.org",
    name: "Ubuntu 18",
    subOrderPage: 2,
    icon: FaUbuntu,
    img: "/imgs/ubuntu.svg",
  },
  {
    id: "1086",
    idCustom: "256 ubuntu22.tino.org",
    name: "Ubuntu 22",
    subOrderPage: 2,
    icon: FaUbuntu,
    img: "/imgs/ubuntu.svg",
  },
  {
    id: "122",
    idCustom: "308 centos7",
    name: "Centos 7",
    subOrderPage: 2,
    icon: GrCentos,
    img: "/imgs/icon-centos.svg",
  },
  {
    id: "121",
    idCustom: "306 debian11.tino.org",
    name: "Debian 11",
    subOrderPage: 2,
    icon: FaDebian,
    img: "/imgs/icon-debian.svg",
  },
  {
    id: "123",
    idCustom: "309 almalinux8",
    name: "Almalinux8",
    subOrderPage: 2,
    icon: FaLinux,
    img: "/imgs/icon-almalinux.svg",
  },
  {
    id: "1112",
    idCustom: "309 almalinux9",
    name: "Almalinux9",
    subOrderPage: 2,
    icon: FaLinux,
    img: "/imgs/icon-almalinux.svg",
  },
];

export const getOsDefaultUbuntu = () => {
  const find = osTemplate.find((item: any) => {
    return item.id === "1086";
  });
  return find;
};
