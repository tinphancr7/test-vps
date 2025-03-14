import Container from "@/components/container";
import { Status } from "@/components/digital-ocean/Status";
import { Button, Chip, Divider } from "@heroui/react";
import moment from "moment";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function HeaderDetailLoadBalancer({ info }: any) {
  const navigate = useNavigate();
  return (
    <div>
      <Container className="sticky top-0 bg-white z-10 h-max flex flex-col gap-5">
        <div className="flex justify-between">
          <div className=" flex gap-2">
            {/* Back to VPS VNG Page */}
            <Button
              color="primary"
              className="rounded-md min-w-max w-max py-1 px-2 min-h-max h-max text-lg mt-1"
              onPress={() =>
                navigate("/vps/bu-cloud", {
                  state: { keyTab: "digital-ocean-load-balancer" },
                })
              }
            >
              <HiOutlineArrowLeft />
            </Button>

            <div className="flex flex-col">
              <div className="flex gap-4">
                {" "}
                <Chip
                  radius="sm"
                  color="warning"
                  variant="flat"
                  classNames={{
                    base: "h-auto",
                    content: "pl-4 font-semibold tracking-wider text-xl py-1",
                  }}
                >
                  {info?.name_load_balancer}
                </Chip>
                {Status(info?.status)}
              </div>

              <Chip
                radius="sm"
                color="primary"
                variant="dot"
                classNames={{
                  base: "border-0",
                  content: "font-semibold tracking-wide text-xs",
                }}
              >
                <span>Ngày tạo:</span>
                <b className="ml-2 text-primary">
                  {moment(info?.created_at).format("DD-MM-YYYY")}
                </b>
              </Chip>
              <Chip
                radius="sm"
                color="primary"
                variant="dot"
                classNames={{
                  base: "border-0",
                  content: "font-semibold tracking-wide text-xs",
                }}
              >
                <span>Team:</span>
                <b className="ml-2 text-primary">{info?.teamOwner}</b>
              </Chip>
            </div>
          </div>
        </div>
      </Container>
      <Divider />
    </div>
  );
}

export default HeaderDetailLoadBalancer;
