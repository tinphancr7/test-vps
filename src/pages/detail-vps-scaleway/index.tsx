import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import DeleteInstanceModal from "./component/DeleteInstanceModal";
import DetailItem from "./component/DetailItem";
import InstanceHeader from "./component/InstanceHeader";
import { useSelector } from "react-redux";
import { listZones } from "@/constants";
import { fetchInstanceDetail } from "@/stores/slices/vps-scaleway-slice";
import NotifyMessage from "@/utils/notify";
import scaleWayApi from "@/apis/scaleway.api";
import { convertBandwidth, convertToMemory } from "@/utils";
import { useAppDispatch } from "@/stores";

const DetailVpsScaleWay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { vpsItem } = useSelector((state: any) => state?.scaleway);
  console.log("vpsItem", vpsItem);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const findZone = (value: any) =>
    listZones.find((zone: any) => zone.value === value);

  const onOpenModal = () => setIsOpenModal(true);
  const onCloseModal = () => setIsOpenModal(false);

  const handleDeleteInstance = async ({
    deleteAssociatedIPs,
    deleteBlockStorage,
  }: any) => {
    try {
      setConfirmLoading(true);

      if (deleteAssociatedIPs) {
        await scaleWayApi.callDeleteIp({
          ip: vpsItem?.vps_id?.publicIp?.id,
          zone: vpsItem?.vps_id?.zone,
          teamId: vpsItem?.team,
        });
      }
      if (deleteBlockStorage) {
        await scaleWayApi.callUpdateInstance(vpsItem?.vps_id?.id, {
          volumes: {},
          teamId: vpsItem?.team,
        });
      }
      await scaleWayApi.callPerformAction({
        zone: vpsItem?.vps_id?.zone,
        serverId: vpsItem?.vps_id?.id,
        body: { action: "terminate", teamId: vpsItem?.team },
      });
      setConfirmLoading(false);
      navigate("/vps/bu-cloud");
      NotifyMessage("Instance deleted successfully", "success");
    } catch (error) {
      setConfirmLoading(false);
      NotifyMessage(
        // @ts-ignore
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchInstanceDetail(id));
  }, [id]);

  return (
    <div>
      {/* <Link
				to={"/vps/bu-cloud"}
				className="flex items-center gap-1 text-purple-600 hover:text-purple-600 hover:underline"
			>
				<IoIosArrowBack />{" "}
				<span className="text-base font-semibold">Back to Instances</span>
			</Link> */}

      <div className="mx-auto mt-10 max-w-4xl">
        {isOpenModal && (
          <DeleteInstanceModal
            instanceName={vpsItem?.vps_id?.name}
            onClose={onCloseModal}
            onDelete={handleDeleteInstance}
            confirmLoading={confirmLoading}
          />
        )}
        <InstanceHeader
          commercialType={vpsItem?.vps_id?.commercialType}
          name={vpsItem?.vps_id?.name}
          state={vpsItem?.vps_id?.state}
          zone={vpsItem?.vps_id?.zone}
          serverId={vpsItem?.vps_id?.id}
          teamId={vpsItem?.team}
        />
        <div className="space-y-4 rounded-lg border bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Instance information</h2>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center space-x-2">
              <span
                className={`${
                  vpsItem?.vps_id?.state === "running"
                    ? "bg-green-500"
                    : vpsItem?.vps_id?.state === "starting" ||
                      vpsItem?.vps_id?.state === "stopping"
                    ? "bg-blue-500"
                    : "bg-black"
                } inline-block h-2 w-2 rounded-full`}
              ></span>
              <span className="font-medium capitalize text-gray-700">
                {vpsItem?.vps_id?.state}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4  text-gray-600">
              <DetailItem
                label="Type"
                value={vpsItem?.vps_id?.commercialType}
              />
              <DetailItem
                label="From image"
                value={vpsItem?.vps_id?.image?.name}
              />
              <DetailItem
                label="Availability Zone"
                value={findZone(vpsItem?.vps_id?.zone)?.label || ""}
              />
              <DetailItem
                label="Cores"
                value={
                  vpsItem?.vps_id?.instanceType &&
                  vpsItem?.vps_id?.instanceType?.ncpus
                }
              />
              <DetailItem
                label="RAM"
                value={`${
                  (vpsItem?.vps_id?.instanceType &&
                    convertToMemory(vpsItem?.vps_id?.instanceType?.ram)) ||
                  0
                } GB`}
              />
              <DetailItem
                label="Local Storage"
                value={
                  vpsItem?.vps_id?.instanceType?.perVolumeConstraint?.lSsd
                    ?.minSize > 0
                    ? "Block / Local"
                    : "Block"
                }
              />
              <DetailItem
                label="Bandwidth"
                value={`${
                  (vpsItem?.vps_id?.instanceType &&
                    convertBandwidth(
                      vpsItem?.vps_id?.instanceType?.network
                        ?.sumInternalBandwidth
                    )) ||
                  0
                }`}
              />
              <DetailItem
                label="Instance ID"
                value={vpsItem?.vps_id?.id}
                copyable
              />
              <DetailItem
                label="Image ID"
                value={vpsItem?.vps_id?.image?.id}
                copyable
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <DetailItem
                label="Protected Instance option"
                value="Deactivated"
              />
              <DetailItem
                label="SSH command"
                value={`ssh root@${vpsItem?.vps_id?.publicIp?.address}`}
                copyable
              />
              <DetailItem
                label="Public DNS"
                value={`${vpsItem?.vps_id?.id}.pub.instances.scw.cloud`}
                copyable
              />
              <DetailItem
                label="NAT IP DNS"
                value={`${vpsItem?.vps_id?.id}.priv.instances.scw.cloud`}
                copyable
              />
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-5">
          <h5 className="font-semibold">Delete Instance</h5>
          <div className="flex items-center gap-10 border p-4">
            <p>
              This action will delete all volumes and data from this storage
              server. You can only delete Instances that are powered on or
              stopped. Perform regular snapshots to avoid losing data.
            </p>
            <button
              className="w-[200px] text-nowrap rounded bg-pink-600 px-4 py-2 text-white"
              onClick={onOpenModal}
            >
              Delete Instance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVpsScaleWay;
