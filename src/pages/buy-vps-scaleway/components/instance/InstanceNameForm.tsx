//@ts-ignore
import randomName from "@scaleway/random-name";
import { FaExclamationCircle } from "react-icons/fa";
//@ts-ignore
import { TagsInput } from "react-tag-input-component";

import { useDispatch, useSelector } from "react-redux";
import { setInstance } from "@/stores/slices/vps-scaleway-slice";
import { AppDispatch } from "@/stores";

const InstanceNameForm = () => {
  const { instance } = useSelector((state: any) => state?.scaleway);
  const dispatch = useDispatch<AppDispatch>();
  const handleRandomName = () => {
    dispatch(
      setInstance({
        name: randomName("srv"),
      })
    );
  };
  return (
    <div className="">
      {/* Instance Name Input */}
      <label
        className="mb-1 block text-base font-medium text-gray-600"
        htmlFor="instance-name"
      >
        Instance name <span className="text-red-600">*</span>
      </label>
      <div className="flex items-center rounded-lg border border-gray-3s00 bg-white p-2 ">
        <input
          type="text"
          id="instance-name"
          className="flex-grow border-none text-gray-800 placeholder-gray-500 outline-none"
          placeholder=""
          value={instance?.name || ""}
          onChange={(e) =>
            setInstance({
              name: e.target.value,
            })
          }
        />
        <span
          className="inline-block cursor-pointer px-2"
          onClick={handleRandomName}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="h-4 w-4"
          >
            <path d="m13.73 3.963.337-.732.731-.338a.345.345 0 0 0 0-.628l-.73-.338-.339-.725a.345.345 0 0 0-.628 0l-.338.731-.724.339a.345.345 0 0 0 0 .628l.731.338.338.725a.34.34 0 0 0 .621 0m-7.933 0 .338-.732.731-.338a.345.345 0 0 0 0-.628l-.73-.332-.339-.731a.34.34 0 0 0-.62 0l-.339.731-.73.339a.345.345 0 0 0 0 .628l.73.338.338.725a.34.34 0 0 0 .621 0m7.312 5.175-.338.732-.73.338a.345.345 0 0 0 0 .628l.73.338.338.732a.345.345 0 0 0 .628 0l.338-.732.724-.345a.345.345 0 0 0 0-.628l-.73-.338-.339-.732c-.117-.262-.503-.262-.62.007m-1.27-3.023L9.887 4.162a.687.687 0 0 0-.973 0L1.202 11.87a.69.69 0 0 0 0 .973l1.952 1.953c.269.27.704.27.973 0l7.705-7.709a.68.68 0 0 0 .007-.973M9.424 7.557l-.972-.973.952-.952.972.973z"></path>
          </svg>
        </span>
      </div>
      {instance.name ? (
        <p className="mt-1 flex items-center text-sm text-gray-500">
          <FaExclamationCircle className="mr-1" />
          Instance name can only contain alphanumeric characters, dots, spaces,
          and dashes.
        </p>
      ) : (
        <p className="mt-1 flex items-center text-sm font-medium text-red-500">
          Instance name is required.
        </p>
      )}

      {/* Tags Input */}
      <label
        className="mb-1 mt-4 block text-base font-medium text-gray-600"
        htmlFor="tags"
      >
        Tags
      </label>

      <TagsInput
        value={instance?.tags || []}
        onChange={(tags: any) =>
          setInstance({
            tags,
          })
        }
        name="tags"
      />
    </div>
  );
};

export default InstanceNameForm;
