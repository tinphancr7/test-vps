import { useEffect } from "react";
import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/stores";
import { fetchIps, setInstance } from "@/stores/slices/vps-scaleway-slice";
const IPSelection = () => {
  const { instance, existIps } = useSelector((state: any) => state?.scaleway);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch data here
    if (instance.zone.value) {
      dispatch(
        fetchIps({
          page: 1,
          perPage: 10,
          zone: instance.zone.value,
        })
      );
    }
  }, [instance.zone.value]);

  const handleChange = (e: any) => {
    dispatch(
      setInstance({
        ipv4: e.target.id,
        publicIps: e.target.id === "new-ipv4" ? [] : instance?.publicIps,
      })
    );
  };
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Select an IP</h3>

      {/* Public IPv4 Card */}
      <div className="space-y-4 rounded-lg border border-primary p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="ipv4"
            checked
            className="mt-1 text-primary"
          />
          <div>
            <label htmlFor="ipv4" className="font-medium text-gray-800">
              Public IPv4
            </label>
            <p className="text-sm text-gray-500">
              A public IP will be attached to your Instance. You can move this
              IP to another Instance at any time.
            </p>
          </div>
        </div>

        <div className="space-y-3 pl-7">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="ipv4-option"
              id="new-ipv4"
              className="text-primary"
              checked={instance?.ipv4 === "new-ipv4"}
              onChange={handleChange}
            />
            <label htmlFor="new-ipv4" className="font-medium text-gray-800">
              Allocate a new IPv4
            </label>
            <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
              €0.004
            </span>
          </div>
          <p className="pl-7 text-sm text-gray-500">
            Allocate a new IPv4 address for the Instance.
          </p>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="ipv4-option"
              id="existing-ipv4"
              className="text-primary"
              checked={instance?.ipv4 === "existing-ipv4"}
              onChange={handleChange}
            />
            <label
              htmlFor="existing-ipv4"
              className="font-medium text-gray-800"
            >
              Select existing IPv4(s)
            </label>
          </div>
          {instance?.ipv4 === "existing-ipv4" && (
            <div>
              <p className="pb-2 text-base font-medium text-gray-500">
                Attach up to 5 IPs to the Instance.{" "}
                <span className="text-red-600">*</span>
              </p>
              <Select
                isMulti
                onChange={(selectedOptions) => {
                  setInstance({
                    publicIps:
                      selectedOptions?.map((option: any) => {
                        return option?.value;
                      }) || [],
                  });
                }}
                placeholder="Select IP (s)"
                menuPosition="fixed"
                options={existIps}
                name="colors"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          )}
        </div>
      </div>

      {/* Public IPv6 Card */}
      {/* <div className="border border-primary rounded-lg p-4 space-y-4">
				<div className="flex items-start space-x-3">
					<input
						type="checkbox"
						id="ipv6"
						checked
						className="text-primary mt-1"
					/>
					<div>
						<label htmlFor="ipv6" className="font-medium text-gray-800">
							Public IPv6
						</label>
						<p className="text-sm text-gray-500">
							Activate this option to have a globally routed IPv6 address for
							your Instance. This option gives a unique IPv6 address to your
							Instance (/64).
						</p>
					</div>
				</div>

				<div className="pl-7 space-y-3">
					<div className="flex items-center space-x-3">
						<input
							type="radio"
							name="ipv6-option"
							id="new-ipv6"
							className="text-primary"
						/>
						<label htmlFor="new-ipv6" className="text-gray-800 font-medium">
							Allocate a new IPv6
						</label>
						<span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-1 rounded-lg">
							FREE
						</span>
					</div>
					<p className="pl-7 text-sm text-gray-500">
						Allocate a new IPv6 address for the Instance.
					</p>

					<div className="flex items-center space-x-3">
						<input
							type="radio"
							name="ipv6-option"
							id="existing-ipv6"
							className="text-primary"
						/>
						<label
							htmlFor="existing-ipv6"
							className="text-gray-800 font-medium"
						>
							Select existing IPv6(s)
						</label>
					</div>
				</div>
			</div> */}
    </div>
  );
};

export default IPSelection;
