import Access from "@/components/Access/access";
import Container from "@/components/container";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Key, useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import TabsDetail from "./components/tabs-detail";

import { IoTerminal } from "react-icons/io5";

import NotifyMessage from "@/utils/notify";
import { LiaEditSolid } from "react-icons/lia";
import { TbTerminal2 } from "react-icons/tb";
import { asyncThunkGetDetaiVpsOrtherById } from "@/stores/async-thunks/detail-vps-orther-thunk";
import vpsOrtherApis from "@/apis/vps-orther.api";

function DetailVpsOrther() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useAppSelector((state) => state.detailVpsOrther);
  console.log("isLoading: ", isLoading);
  const { isOpen: isOpenAapanel, onOpenChange: onOpenChangeAapanel } =
    useDisclosure();

  const [statusVps, setStatusVps] = useState("pending");

  useEffect(() => {
    (async () => {
      const data: any = await dispatch(
        asyncThunkGetDetaiVpsOrtherById(id as string)
      ).unwrap();
      document.title = `Vps Khác -  ${data?.domain}`;
    })();
  }, [id]);

  const handleNavigate = () => {
    navigate(paths.vps_management_orther);
  };

  const aaPanelActions = [
    {
      key: "update-aaPanel",
      label: "Cập nhật aaPanel",
      icon: LiaEditSolid,
      color: "text-primary-600",
      isDisabled: false,
    },
    {
      key: "console-aaPanel",
      label: "Truy cập panel",
      icon: TbTerminal2,
      color: "text-warning",
      isDisabled: false,
    },
  ];

  const iconClasses = "text-xl pointer-events-none flex-shrink-0";

  const handleNavigateToAaPanel = async () => {
    try {
      setStatusVps("pending");
      const data = await vpsOrtherApis.callAccessPanel(id as string);

      setStatusVps(statusVps);
      if (data?.data?.data) {
        window.open(data?.data?.data, "_blank");
      }
    } catch (error) {
      setStatusVps(statusVps);

      console.log("error: ", error);
      NotifyMessage("Có lỗi xảy ra khi truy cập panel", "error");
    }
  };

  const handleClickActionAaPanel = (actionKey: Key): void => {
    switch (actionKey) {
      case "update-aaPanel":
        onOpenChangeAapanel();
        break;

      case "console-aaPanel":
        handleNavigateToAaPanel();
        break;

      default:
        console.log("Invalid Action");
    }
  };

  return (
    <Access subject={SubjectEnum.VPS} action={ActionEnum.READ}>
      <div className="flex flex-col gap-3">
        <Container className="flex justify-between">
          <div className="flex items-start justify-start gap-6">
            <Button
              color="primary"
              className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg mt-1"
              onPress={handleNavigate}
            >
              <HiOutlineArrowLeft />
            </Button>

            <div className="flex flex-row-reverse">
              <Chip
                radius="sm"
                color="warning"
                variant="flat"
                classNames={{
                  base: "h-auto",
                  content: "pl-4 font-semibold tracking-wider text-xl py-1",
                }}
              >
                {isLoading ? (
                  <Spinner color="primary" size="sm" />
                ) : (
                  <>
                    <Chip
                      radius="sm"
                      color="primary"
                      variant="dot"
                      classNames={{
                        base: "border-0 !m-0 !p-0",
                        content: "font-semibold tracking-wide text-xs !m-0",
                      }}
                    ></Chip>
                    {data?.domain}
                  </>
                )}
              </Chip>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                {new Array(1).fill(0).map(() => (
                  <Skeleton className="rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-default-300"></div>
                  </Skeleton>
                ))}
              </>
            ) : (
              <>
                <Dropdown radius="sm">
                  <DropdownTrigger>
                    <Button
                      variant="solid"
                      radius="sm"
                      className={`text-blue-600 bg-blue-100 min-w-0 w-10 h-10`}
                    >
                      <Tooltip
                        content={"Điều khiển"}
                        classNames={{
                          base: "",
                          content: "bg-blue-500 text-light",
                        }}
                      >
                        <i>
                          <IoTerminal className="min-w-max text-base w-5 h-5" />
                        </i>
                      </Tooltip>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    variant="faded"
                    aria-label="Dropdown menu with icons"
                    itemClasses={{
                      base: "gap-3",
                    }}
                    onAction={handleClickActionAaPanel}
                  >
                    {aaPanelActions?.map((ac: any) => {
                      const Icon = ac?.icon;

                      return (
                        <DropdownItem
                          key={ac?.key}
                          startContent={
                            <Icon className={`${iconClasses} ${ac?.color}`} />
                          }
                        >
                          {ac?.label}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </>
            )}
          </div>
        </Container>

        <TabsDetail isOpen={isOpenAapanel} onOpenChange={onOpenChangeAapanel} />
      </div>
    </Access>
  );
}

export default DetailVpsOrther;
