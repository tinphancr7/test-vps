import { useEffect } from "react";

import { fetchZones } from "@/stores/async-thunks/up-cloud.thunk";
import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import { setZone } from "@/stores/slices/upcloud/server.slice";
import { Spinner } from "@heroui/react";

export default function UpCloudLocation() {
  const dispatch = useAppDispatch();

  const zone = useAppSelector(
    (state: RootState) => state.upCloudServer.server.zone
  );
  const zones = useAppSelector(
    (state: RootState) => state.upcloudLocation.zones
  );
  const isPending = useAppSelector(
    (state: RootState) => state.upcloudLocation.loading
  );

  // Fetch zones on component mount
  useEffect(() => {
    dispatch(fetchZones());
  }, [dispatch]);

  const getImageByNameId = (id: string) => {
    switch (id) {
      case "au-syd1":
        return "/upcloud/zones/au.png";
      case "de-fra1":
        return "/upcloud/zones/de.png";
      case "es-mad1":
        return "/upcloud/zones/es.png";
      case "fi-hel1":
      case "fi-hel2":
        return "/upcloud/zones/fi.png";
      case "nl-ams1":
        return "/upcloud/zones/nl.png";
      case "pl-waw1":
        return "/upcloud/zones/pl.png";
      case "se-sto1":
        return "/upcloud/zones/se.png";
      case "sg-sin1":
        return "/upcloud/zones/sg.png";
      case "uk-lon1":
        return "/upcloud/zones/uk.png";
      default:
        return "/upcloud/zones/us.png";
    }
  };

  const getCountryByNameSlug = (id: string) => {
    switch (id) {
      case "au-syd1":
        return "Australia";
      case "de-fra1":
        return "Germany";
      case "es-mad1":
        return "Spain";
      case "fi-hel1":
      case "fi-hel2":
        return "Finland";
      case "nl-ams1":
        return "Netherlands";
      case "pl-waw1":
        return "Poland";
      case "se-sto1":
        return "Sweden";
      case "sg-sin1":
        return "Singapore";
      case "uk-lon1":
        return "United Kingdom";
      default:
        return "USA";
    }
  };

  const handleLocationChange = (id: string) => {
    dispatch(setZone(id));
  };

  return (
    <div className="rounded-sm border-b-[1px] border-b-gray-300">
      <div className="border-b-1 flex w-full items-center gap-3 border-b-gray-200 px-4 py-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          style={{ color: "#ffb44d" }}
        >
          <path
            fill="#ffb44d"
            fillRule="nonzero"
            d="M8 20c0-6.29 4.84-11.45 11-11.959V6h2v2.041C27.16 8.55 32 13.71 32 20h2v2h-2.166c-.898 5.354-5.342 9.506-10.834 9.959V34h-2v-2.041C13.508 31.506 9.064 27.354 8.166 22H6v-2zm12 10c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10m0-4a6 6 0 1 1 0-12 6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8"
          ></path>
        </svg>
        <p className="text-[22px]">Khu vực</p>
      </div>
      {isPending ? (
        <div className="flex min-h-36 w-full flex-col items-center justify-center gap-3">
          <Spinner />
        </div>
      ) : (
        <div className="flex w-full flex-wrap px-4 py-5">
          <div className="grid w-full grid-cols-3 gap-2">
            {zones?.map((location) => (
              <div
                key={location._id}
                onClick={() => handleLocationChange(location.id)}
                className={`flex w-full cursor-pointer items-center rounded border p-4 hover:border-up-cloud-primary ${
                  zone === location.id ? "border-up-cloud-primary" : ""
                }`}
              >
                <div className="relative">
                  <input
                    type="radio"
                    name="location"
                    value={location.id}
                    checked={zone === location.id}
                    onChange={() => handleLocationChange(location.id)}
                    className="mr-3 h-4 w-4 appearance-none rounded-full border-2 border-gray-300 checked:border-up-cloud-primary checked:bg-up-cloud-primary focus:outline-none"
                  />
                  <span
                    className={`absolute right-1/2 top-1/3 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/4 rounded-full bg-white ${
                      zone === location.id && "bg-white"
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold uppercase">{location.id}</span>
                  <span className="text-sm font-bold text-gray-500">
                    {getCountryByNameSlug(location.id)}
                  </span>
                </div>
                <img
                  src={getImageByNameId(location.id)}
                  alt={`${location.description} Flag`}
                  className="ml-auto h-[27px] w-10"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
