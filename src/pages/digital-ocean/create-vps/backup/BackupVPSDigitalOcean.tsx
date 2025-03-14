import { useAppDispatch, useAppSelector } from "@/stores";
import { setDataBackupDigitalOcean } from "@/stores/slices/digital-ocean-slice/create-vps/digital-ocean-backup.slice";
import { Checkbox, cn, Radio, RadioGroup } from "@heroui/react";
import { clsx } from "@heroui/shared-utils";
import { useEffect } from "react";

function BackupsDropletDigitalOcean() {
  const { backupsOption } = useAppSelector((state) => state.digitalOceanBackup);
  const { selectedSize }: any = useAppSelector(
    (state) => state.digitalOceanSize
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setDataBackupDigitalOcean({
        backupsOption: {
          backups: false,
          rateCostForBackup: 0,
        },
      })
    );
  }, []);

  const BACKUP_OPTIONS = [
    {
      key: "weekly",
      title: "Sao lưu mỗi tuần",
      desc: "Mỗi bản backup sẽ lưu giữ dữ liệu trong 4 tuần",
      month_price: (selectedSize?.price_monthly * 20) / 100,
      drop_type_percent_cost: 20,
      img: "/images/digital-ocean/weekly_backup.svg",
    },
    // ,
    // {
    //   key: 'daily',
    //   title: 'Daily Backups',
    //   desc: 'Each backup is kept for 7 days',
    //   month_price: (selectCPU?.price_monthly * 30) / 100,
    //   drop_type_percent_cost: 30,
    //   img: '/images/digital-ocean/daily_backup.svg'
    // }
  ];
  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl flex items-center gap-4">Sao lưu</h2>

      <div className=" grid grid-cols-1 my-4">
        <Checkbox
          classNames={{
            base: cn(
              "flex text-center border-solid border  cursor-pointer p-4 gap-4 rounded-[3px] relative mx-0 max-w-full",
              {
                "border-primary bg-[#f5f9ff] rounded-bl-[0px] rounded-br-[0px] isActive":
                  backupsOption?.backups,

                "border-[#dfdfdf]": !backupsOption?.backups,
              }
            ),
          }}
          isSelected={backupsOption?.backups}
          onValueChange={(e) => {
            dispatch(
              setDataBackupDigitalOcean({
                backupsOption: {
                  ...backupsOption,
                  backups: e,
                  rateCostForBackup: BACKUP_OPTIONS[0].drop_type_percent_cost,
                },
              })
            );
          }}
        >
          <div>
            <p className="text-left ml-4 font-bold text-sm">
              Bật tự động sao lưu
            </p>
          </div>
        </Checkbox>

        {backupsOption?.backups && (
          <div
            className={clsx(
              "flex text-center border-solid border  p-4 gap-4 relative border-primary border-t-0 rounded-bl-[3px] rounded-br-[3px] bg-white"
            )}
          >
            <RadioGroup value={"weekly"} className="w-full">
              {BACKUP_OPTIONS.map((item: any) => {
                return (
                  <div
                    key={item.key}
                    className={clsx(
                      "  flex text-center border-solid border  cursor-pointer p-4 rounded-[3px] relative w-full",
                      {
                        "border-primary bg-[#f5f9ff] text-[#0069ff] isActive":
                          backupsOption?.backups,
                        "border-[#dfdfdf]": !backupsOption?.backups,
                      }
                    )}
                  >
                    <Radio
                      value={item.key}
                      className="w-full flex "
                      classNames={{
                        base: cn("max-w-full "),
                      }}
                    >
                      <div className="flex justify-between flex-col sm:flex-row ">
                        <div className="flex flex-col sm:flex-row">
                          <div
                            className={`bg-no-repeat bg-center w-[64px] h-[48px]`}
                            style={{
                              backgroundImage: `url('/digital-ocean/weekly_backup.svg')`,
                            }}
                          ></div>
                          <div className="flex flex-col">
                            <p className="text-left ml-4 font-bold text-sm">
                              {item.title}
                            </p>
                            <p className="text-left ml-4 text-sm">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-left md:text-right ml-4 font-bold text-sm">
                            {item.month_price} / tháng
                          </p>
                          <p className="text-left md:text-right ml-4 text-sm">
                            {item.drop_type_percent_cost}% của VPS
                          </p>
                        </div>
                      </div>
                    </Radio>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
}

export default BackupsDropletDigitalOcean;
