import { Button, Checkbox, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/stores";
import ViewPrice from "./view-price";
import { getVCpus, generateInstanceFamilyNameBody, calculatorFeeProvisionedPerformance } from "./utils";
import { BILL_METHODS, INTERNET_BILL_METHODS, performanceLevelsList } from "./constants";
import { setAutoRenew, setIsSubmitting, setPeriod } from "@/stores/slices/alibaba-ecs.slice";
import { systemDiskCategories } from "./utils";
import { asyncThunkGetPriceAlibabaEcs } from "@/stores/async-thunks/alibaba-ecs-thunk";
import alibabaEcsApis, { AlibabaEcsInstanceChargeType } from "@/apis/alibaba-ecs.api";
import showToast from "@/utils/toast";
import { useLocation } from "react-router-dom";
import paths from "@/routes/paths";
import buCloudAlibabaEcsApis from "@/apis/bu-cloud-alibaba-ecs.api";

const duration = [
  { key: "1", label: "1 Month" },
  { key: "2", label: "2 Month" },
  { key: "3", label: "3 Month" },
  { key: "6", label: "6 Month" },
  { key: "12", label: "1 Year" },
];

export const Billing = () => {
	const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const {
    teamId,
    price,
    instanceChargeType,
    zone,
    region,
    instanceType,
    platform,
    internetMaxBandwidthOut,
    category,
    provisionedIopsEnabled,
    provisionedIops,
    size,
    internetChargeType,
    versionPlatform,
    deleteWithInstance,
    period,
    performanceLevel,
    autoRenew,
    password,
    pwConfirm,
    isInValidPw,
    regionsList,
    zonesList,
    imagesList,
    instanceTypesList,
    categoriesList,
    isSubmitting
  } = useAppSelector((state) => state.alibabaEcs);

  useEffect(() => {
    const payload: any = {};

    if (region && zone && instanceType && versionPlatform[platform] && category && size) {
      payload['RegionId'] = region;
      payload['ZoneId'] = zone;
      payload['InstanceType'] = instanceType;
      payload['ImageId'] = versionPlatform[platform];
      payload['SystemDisk.Category'] = category;
      payload['SystemDisk.Size'] = size;
      payload["InternetChargeType"] = internetChargeType;
      payload["Period"] = period;

      if (category === "cloud_essd" && performanceLevel) {
        payload["SystemDisk.PerformanceLevel"] = performanceLevel;
      }

      if (internetMaxBandwidthOut) {
        payload['InternetMaxBandwidthOut'] = internetMaxBandwidthOut;
      }

      dispatch(asyncThunkGetPriceAlibabaEcs(payload));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, instanceType, internetChargeType, internetMaxBandwidthOut, performanceLevel, period, platform, region, size, versionPlatform, zone]);

  const billMethodName = useMemo(() => {
    if (!instanceChargeType) return '';

    const findOne = BILL_METHODS?.find((it: any) => it?.value === instanceChargeType);


    return findOne?.label || "";
  }, [instanceChargeType]);

  const regionName = useMemo(() => {
    if (!region || !regionsList) return '';

    const findOne = regionsList?.find((it: any) => it?.RegionId === region);


    return findOne?.LocalName || "";
  }, [region, regionsList]);

  const zoneName = useMemo(() => {
    if (!zone || !zonesList) return '';

    const findOne = zonesList?.find((it: any) => it?.ZoneId === zone);


    return findOne?.LocalName || "";
  }, [zone, zonesList]);

  const imageName = useMemo(() => {
    if (!versionPlatform || !platform) return ''

    const findOne = imagesList?.find((it: any) => it?.ImageId === versionPlatform[platform]);

    return findOne?.OSNameEn;
  }, [platform, versionPlatform, imagesList]);

  const instanceTypeName = useMemo(() => {
    if (!instanceType) return '';

    const findOne = instanceTypesList?.find((tst: any) => tst?.InstanceTypeId === instanceType);

    if(!findOne) return '';

    return `${generateInstanceFamilyNameBody(instanceType)} / ${instanceType} (${getVCpus(instanceType)} vCPU ${findOne?.MemorySize})`;
  },[instanceType, instanceTypesList]);

  const internetChargeTypeName = useMemo(() => {
    const findOne: any = INTERNET_BILL_METHODS?.find((it: any) => it?.value === internetChargeType);

    return findOne?.label;
  }, [internetChargeType]);

  const categorySystemDiskName = useMemo(() => {
    const arrList = systemDiskCategories(categoriesList || []);

    const findOne = arrList?.find((it: any) => it?.value === category);

    const joinLabels = [
      findOne?.label || '',
      `${size}GiB`,
      deleteWithInstance ? 'Release with Instance' : '',
    ];

    if (category === 'cloud_essd') {
      const findPerformanceLevel = performanceLevelsList?.find(
        (it: any) => it?.value === performanceLevel
      );

      if (findPerformanceLevel) {
        joinLabels.push(findPerformanceLevel?.label);
      }
    }

    return joinLabels?.filter((it => it))?.join(' ');;
  }, [categoriesList, category, deleteWithInstance, performanceLevel, size]);

  const errorMessagePw = useMemo(() => {
    if (!password) return 'Nhập mật khẩu';

    if (!pwConfirm) return 'Xác nhận mật khẩu';

    if (isInValidPw) return isInValidPw;

    return '';
  }, [password, pwConfirm, isInValidPw]);

  const handleCreateInstance = async () => {
    try {
      dispatch(setIsSubmitting(true));

      const payload: any = {
        TeamId: teamId,
        InstancePrice: String(price?.OriginalPrice),
        InstanceName: platform,
        InstanceChargeType: AlibabaEcsInstanceChargeType.POST_PAID,
        RegionId: region,
        ZoneId: zone,
        InstanceType: instanceType,
        ImageId: versionPlatform[platform],
        Category: category,
        Period: period,
        Size: size,
        DeleteWithInstance: deleteWithInstance,
        InternetChargeType: internetChargeType,
        InternetMaxBandwidthOut: internetMaxBandwidthOut,
        Password: password,
        AutoRenew: autoRenew,
      };

      if (category === 'cloud_auto' && provisionedIopsEnabled) {
        payload['ProvisionedIops'] = provisionedIops;
        payload['ProvisionedPerformanceFee'] = String(
          calculatorFeeProvisionedPerformance(provisionedIops)
        );
      }

      if (category === 'cloud_essd') {
        payload['PerformanceLevel'] = performanceLevel;
      }

      if (pathname === paths.vps_alibaba_ecs) {
        const { data } = await alibabaEcsApis.createInstance(payload);
  
        if (data?.status === 1) {
          showToast("Tạo VPS - Alibaba ECS thành công!", "success");
        }
      } else {
        const { data } = await buCloudAlibabaEcsApis.createInstance(payload);
  
        if (data?.status === 1) {
          showToast("Tạo VPS - Alibaba ECS thành công!", "success");
        }
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Tạo VPS - Alibaba ECS thất bại!", "error");

      console.log('error: ', error);
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  return (
    <div className="h-full">
      <div className="h-full flex flex-col list-none py-3">
        <div className="grid relative flex-1">
          <div className="w-full absolute h-full z-40">
            <div className="h-full flex flex-col relative px-4">
              <div className="overflow-auto flex-1 flex flex-col gap-2">
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Phương thức thanh toán
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">{billMethodName}</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">Region</div>
                  <div className="col-span-7 text-sm tracking-wide">{regionName}</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">Zone</div>
                  <div className="col-span-7 text-sm tracking-wide">{zoneName}</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Loại mạng
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">VPC</div>
                </div>
                {/* <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    vSwitch
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">
                    [Default]vsw-t4nugqb1jp5o8zi00bwjb
                  </div>
                </div> */}
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Loại Instance
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">{instanceTypeName}</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">Hệ điều hành</div>
                  <div className="col-span-7 text-sm tracking-wide">{imageName}</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Đĩa hệ thống
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">
                    {categorySystemDiskName}
                  </div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Băng thông công cộng
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">{internetChargeTypeName}</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Thông tin xác thực
                  </div>
                  <div className="col-span-7 text-sm tracking-wide">
                    Mật khẩu tùy chỉnh 
                    {errorMessagePw && (
                      <span className="text-danger text-sm"> - {errorMessagePw}</span>
                    )}
                  </div>
                </div>
                {/* <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">Tag</div>
                  <div className="col-span-7 text-sm">No Tags Added</div>
                </div>
                <div className="p-1 grid grid-cols-12">
                  <div className="col-span-5 text-base font-medium">
                    Metadata Access Mode
                  </div>
                  <div className="col-span-7 text-sm">
                    Normal Mode and Security Hardening Mode
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div
            className={`absolute p-4 bottom-0 left-0 w-full bg-white z-50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-medium">Thời gian</div>
              <div className="w-[120px]">
                <Select
                  isRequired
                  selectedKeys={new Set([period])}
                  aria-label="Select duration"
                  classNames={{
                    trigger: "bg-white rounded-none border",
                    popoverContent: "rounded-none",
                  }}
                  disallowEmptySelection={false}
                  onSelectionChange={(value) => dispatch(setPeriod([...value][0]))}
                >
                  {duration.map((animal) => (
                    <SelectItem key={animal.key} textValue={animal.label}>{animal.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-base font-medium">Auto-renewal</div>
              <Checkbox
                isSelected={autoRenew}
                onValueChange={(value) => dispatch(setAutoRenew(value))}
              >
                <p className="text-left text-base">Bật tính năng tự động gia hạn</p>
              </Checkbox>
            </div>
            {autoRenew && (
              <p className="text-[13px] text-gray-500">
                Thời hạn gia hạn: 1 tháng. Đảm bảo số dư tài khoản của bạn đủ.
              </p>
            )}
          </div>
        </div>

        <div className="rightPartOperation px-4 pt-2 w-full z-[1060] bottom-0 h-auto">
          <ViewPrice />
          
          {/* <div className="attention mb-[6px] flex items-center">
            <Checkbox defaultSelected></Checkbox>
            <span className="flex items-center gap-2 text-sm">
              <span>
                <Link to="#">ECS Term of Service</Link>
                <div></div>
              </span>
              <span>
                <Link to="#">Product Terms of Service</Link>
              </span>
            </span>
          </div> */}
          <div className="order flex items-center gap-2">
            <Button
              className="w-full rounded-sm bg-primary"
              onPress={handleCreateInstance}
              isDisabled={!!isInValidPw}
              isLoading={isSubmitting}
            >
              <span className="font-semibold tracking-wider text-white text-xl">
                Tạo đơn hàng
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
