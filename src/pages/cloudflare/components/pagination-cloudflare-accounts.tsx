import usePushQueryString from "@/hooks/usePushQueryString";
import useQueryString from "@/hooks/useQueryString";
import { getPageIndex } from "@/utils/handle-param-pagination";
import { Pagination } from "@heroui/react";
import { memo, useCallback } from "react";

const PaginationCloudflareAccounts = ({
  totalPages = 0,
}: {
  totalPages: number;
}) => {
  const { pageIndex } = useQueryString();
  const pushQueryString = usePushQueryString();

  const handleOnchange = useCallback(
    (page: number) => {
      pushQueryString({ pageIndex: page });
    },
    [pushQueryString]
  );

  return (
    <>
      {totalPages === 0 ? null : (
        <Pagination
          showControls
          page={parseInt(getPageIndex(pageIndex))}
          total={totalPages}
          onChange={(page) => handleOnchange(page)}
        />
      )}
    </>
  );
};

export default memo(PaginationCloudflareAccounts);
