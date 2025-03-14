import { AppDispatch } from "@/stores";
import { setInstance } from "@/stores/slices/vps-scaleway-slice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { twMerge } from "tailwind-merge";

const OSCardItem = ({
  name,
  menuKey,
  logoUrl,
  version,
  versionOptions,
  selected,
  disabled,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  // Define classes based on conditions
  const containerClasses = twMerge(
    `cursor-pointer border w-full rounded-lg p-4 text-center`,
    selected && !disabled
      ? "border-primary"
      : "border-gray-300 hover:border-primary",
    disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-white"
  );

  const imageClasses = twMerge(
    `mx-auto mb-2 h-10 w-10`,
    !selected ? "grayscale-[1]" : ""
  );

  const nameClasses = twMerge(
    `text-sm font-semibold`,
    disabled ? "text-gray-400" : "text-gray-800"
  );

  // Handle click event
  const handleClick = useCallback(() => {
    if (!selected && !disabled) {
      dispatch(
        setInstance({
          selectedOS: {
            name,
            menuKey,
            logoUrl,
            versionOptions,
            version,
          },
        })
      );
    }
  }, [
    selected,
    disabled,
    setInstance,
    name,
    menuKey,
    logoUrl,
    versionOptions,
    version,
  ]);

  // Handle select change
  const handleSelectChange = useCallback(
    (e: any) => {
      const selectedVersion = versionOptions.find(
        (ver: any) => ver.value === e.target.value
      );
      setInstance({
        selectedOS: {
          name,
          logoUrl,
          versionOptions,
          version: selectedVersion,
        },
      });
    },
    [setInstance, versionOptions, name, logoUrl]
  );

  return (
    <div className={containerClasses} onClick={handleClick}>
      <h3 className="mb-2 text-sm font-medium text-gray-500">{name}</h3>
      <img
        src={`/icons${logoUrl}`}
        alt={`${name} logo`}
        className={imageClasses}
      />
      <p className={nameClasses}>{name}</p>
      {versionOptions?.length > 0 && (
        <select
          className="mt-2 w-full rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-500"
          onChange={handleSelectChange}
          disabled={disabled}
        >
          {versionOptions.map((version: any) => (
            <option key={version.value} value={version.value}>
              {version.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default OSCardItem;
