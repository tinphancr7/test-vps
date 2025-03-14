import { CloudflareAccount } from "@/interfaces/cloudflare";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cloudflareApis from "@/apis/cloudflare-api";
import PaginationCloudflareAccounts from "./components/pagination-cloudflare-accounts";
import useQueryString from "@/hooks/useQueryString";
import {
  getPageIndex,
  getSearchKeyword,
} from "@/utils/handle-param-pagination";
import FilterCloudflareAccount from "./components/filter-cloudflare-account";
import { Spinner } from "@heroui/react";

export const DEFAULT_PAGE_SIZE = 10;

const Cloudflare = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listAccount, setListAccount] = useState<CloudflareAccount[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const { pageIndex, pageSize, search } = useQueryString();

  const getListAccount = async () => {
    try {
      setIsLoading(true);

      const { data } = await cloudflareApis.getListAccountsCloudflare({
        pageIndex: parseInt(getPageIndex(pageIndex)),
        pageSize: DEFAULT_PAGE_SIZE,
        name: getSearchKeyword(search),
      });

      setListAccount(data.accounts);

      if (data?.totalPages !== totalPages) {
        setTotalPages(data?.totalPages);
      }
    } catch (error: any) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListAccount();
  }, [pageIndex, pageSize, search]);

  return (
    <div className="mt-10 max-w-[80%] mx-auto">
      <h1 className="text-3xl font-medium text-[#313131]">Accounts</h1>

      <FilterCloudflareAccount />

      <div className="">
        <div className="flex flex-col gap-5">
          <div className="w-full flex flex-col gap-3">
            {isLoading ? (
              <div className="flex items-center justify-center w-[400px] h-40">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              listAccount?.map((account) => (
                <div
                  className="border w-full max-w-[400px] text-xl h-12 flex items-center px-3"
                  key={account.id}
                >
                  <Link
                    to={`/cloudflare/${account.id}`}
                    className="w-full overflow-hidden line-clamp-1 whitespace-nowrap"
                  >
                    {account.name}
                  </Link>
                </div>
              ))
            )}
            {!listAccount && <div>No data</div>}
          </div>

          <PaginationCloudflareAccounts totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default Cloudflare;
