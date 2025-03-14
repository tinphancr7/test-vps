import { Skeleton } from "@heroui/react";

function SkeletonDomainsList() {
    return Array.from({ length: 5 }).map((f, i) => (
        <div key={`${f}_${i}`} className="flex flex-col gap-4">
            <div className="flex flex-col gap-6 rounded border-gray-100 border-1 p-4 shadow-lg">
                <Skeleton
                    className="h-8 rounded bg-gray-100 max-w-96"
                    isLoaded={false}
                />
                <div className="flex flex-col gap-3 w-full">
                    {Array.from({ length: 2 }).map((e, index) => (
                        <div
                            key={`${e}_${index}`}
                            className="flex justify-between items-center w-full px-3 border-b-[1.5px] last:!border-b-0 border-b-gray-100 pb-4"
                        >
                            <Skeleton
                                className="h-8 rounded bg-gray-100 max-w-56 w-full"
                                isLoaded={false}
                            />
                            <div className="flex gap-5 items-center justify-center">
                                <div className="flex flex-col gap-2 justify-end items-end">
                                    <Skeleton
                                        className="h-6 rounded bg-gray-100 w-40"
                                        isLoaded={false}
                                    />
                                    <Skeleton
                                        className="h-4 rounded bg-gray-100 w-56"
                                        isLoaded={false}
                                    />
                                </div>
                                <Skeleton
                                    className="h-10 rounded bg-gray-100 w-32"
                                    isLoaded={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ));
}

export default SkeletonDomainsList;
