import CustomModal from "@/components/modal/CustomModal";
import { AppDispatch } from "@/stores";
import { setInstance } from "@/stores/slices/vps-scaleway-slice";
import { volumeSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";

// @ts-ignore
import randomName from "@scaleway/random-name";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const AddVolume = ({ isOpen, onOpenChange }: any) => {
  const { instance } = useSelector((state: any) => state?.scaleway);
  const dispatch = useDispatch<AppDispatch>();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: instance.volume.name,
      size: instance.volume.size,
      perf_iops: instance.volume.perf_iops,
    },
    resolver: yupResolver(volumeSchema),
  });

  const onSubmit = handleSubmit((values) => {
    dispatch(
      setInstance({
        volume: {
          ...instance.volume,
          ...values,
        },
      })
    );
    resetForm();
  });
  const handleRandomName = () => {
    reset({
      name: randomName("vol"),
    });
  };

  const resetForm = () => {
    reset();
    onOpenChange();
  };
  return (
    <CustomModal
      title={"Add volume"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      resetForm={resetForm}
      size={"2xl"}
    >
      <div className="">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Volume name <span className="text-red-500">*</span>
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div className="flex items-center rounded-lg border border-gray-300">
                  <input
                    type="text"
                    {...field}
                    className="w-full flex-1 rounded-md px-3 py-2 outline-none"
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
              )}
            />
            <div>
              {errors.name ? (
                <p className="text-sm text-red-500">{errors?.name?.message}</p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Volume name can only contain alphanumeric characters, spaces,
                  and dashes.
                </p>
              )}
            </div>
          </div>

          <div className="col-span-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Size <span className="text-red-500">*</span>
            </label>
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      // @ts-ignore
                      field.onChange(Math.max(1, parseInt(field.value) - 1))
                    }
                    className="rounded-l-md border border-gray-300 px-4 py-2"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                    className="w-20 items-center border-b border-t border-gray-300 p-2 text-center font-semibold outline-none"
                  />
                  <button
                    type="button"
                    //  @ts-ignore
                    onClick={() => field.onChange(parseInt(field.value) + 1)}
                    className="rounded-r-md border border-gray-300 px-4 py-2"
                  >
                    +
                  </button>
                  <span className="ml-2 text-base">GB</span>
                </div>
              )}
            />
            <div>
              {errors.size && (
                <p className="text-sm text-red-500">{errors?.size?.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor=""
          >
            Volume type <span className="text-red-500">*</span>
          </label>
          <div className="rounded-md border border-orange-300 bg-orange-50 p-4">
            <div className="flex items-center justify-between font-semibold text-primary">
              <span>Block Storage</span>{" "}
              <span className="text-gray-500">€2.15/month</span>
            </div>
            <p className="mt-1 text-sm text-gray-700">
              Volumes are storage spaces used by your Instances. A block volume
              with a default name and 5,000 IOPS is automatically provided for
              your system volume.
            </p>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                IOPS{" "}
                <span className="text-xs">(I/O Operations per Second)</span>
              </label>
              <Controller
                name="perf_iops"
                control={control}
                render={({ field }) => (
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={5000}
                        checked={field.value === 5000}
                        onChange={() => field.onChange(5000)}
                        className="text-purple-600"
                      />
                      <span>5K</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={15000}
                        checked={field.value === 15000}
                        onChange={() => field.onChange(15000)}
                        className="text-purple-600"
                      />
                      <span>15K</span>
                    </label>
                  </div>
                )}
              />
            </div>

            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-600">
                You can find your Block Storage volumes under the Block Storage
                section of the console's side menu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddVolume;
