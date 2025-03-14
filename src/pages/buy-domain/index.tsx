/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import suppliesDomainApi from "@/apis/supplies-domain.api";
import Access from "@/components/Access/access";
import { ActionEnum, SubjectEnum } from "@/constants/enum";
// import { Skeleton } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { toast } from "react-toastify";
import DynadotsList from "./components/dynadots-list";
// import GodaddysList from "./components/godaddys-list";
import GnameList from "./components/gname-list";

import SkeletonDomainsList from "./components/skeleton-domains-list";
import EpikList from "./components/epik-list";
import NameList from "./components/name-list";
import NameCheapList from "./components/namecheap-list";

interface IListDomain {
  /*
	godaddy: {
		domains?: any;
		error?: string;
		index?: number;
	};
  */
	namecheap: {
		domains?: any;
		error?: string;
    index?: number;
	};
	dynadots: {
		domains?: any;
		error?: string;
		index?: number;
	};
	gname: {
		domains?: any;
		error?: string;
		index?: number;
	};
	epik: {
		domains?: any;
		error?: string;
		index?: number;
	};
	name: {
		domains?: any;
		error?: string;
		index?: number;
	};
}
export default function BuyDomainPage() {
  const [domainName, setDomainName] = useState("");
  const [searchResult, setSearchResult] = useState<IListDomain | null>(null);
  const [loading, setLoading] = useState(false);
  const [highlightedProvider, setHighlightedProvider] = useState<string | null>(null);
  const observerRefs = useRef<Record<string, IntersectionObserver | null>>({});

  const handleSearch = async () => {
    if (!domainName.trim()) {
      toast.error("Vui lòng nhập tên miền!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await suppliesDomainApi.searchDomain({
        domain_name: domainName,
      });

      const response = data?.data;

			if (
				["godaddy", "namecheap", "dynadots", "gname", "epik", "name"].every(
					(i) => Object.keys(response).includes(i)
				)
			) {
				const listDomain: IListDomain = {
          /*
					godaddy: Object.keys(response["godaddy"]).includes("error")
						? {error: response["godaddy"].error}
						: {
							  ...response["godaddy"]
						  },
          */
					namecheap: Object.keys(response["namecheap"]).includes("error")
						? {error: response["namecheap"].error}
						: {
                ...response["namecheap"],
						  },
					dynadots: Object.keys(response["dynadots"]).includes("error")
						? {error: response["dynadots"].error}
						: {
								...response["dynadots"],
						  },
					gname: Object.keys(response["gname"]).includes("error")
						? {error: response["gname"].error}
						: {
								...response["gname"],
						  },
					epik: Object.keys(response["epik"]).includes("error")
						? {error: response["epik"].error}
						: {
								...response["epik"],
						  },
					name: Object.keys(response["name"]).includes("error")
						? {error: response["name"].error}
						: {
								...response["name"],
						  },
				};

        setSearchResult(listDomain);
      } else {
        setSearchResult(null);
      }
    } catch (err: any) {
      toast.error("Lỗi kết nối máy chủ vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const providers = ["godaddy", "dynadots", "gname", "epik", "name"];

    providers.forEach((provider) => {
      const element = document.getElementById(`provider-${provider}`);

      if (!element) return;

      observerRefs.current[provider] = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHighlightedProvider(provider);
          }
        },
        { threshold: 0.5 },
      );

      observerRefs.current[provider]?.observe(element);
    });

    return () => {
      Object.values(observerRefs.current).forEach((observer) => observer?.disconnect());
    };
  }, [searchResult]);

  return (
    <Access subject={SubjectEnum.DOMAIN} action={ActionEnum.CREATE}>
      <div className="flex flex-col gap-5 w-full" style={{ padding: "40px 120px" }}>
        <div className="flex w-full">
          <div className="border-1 !border-r-0  border-gray-200 w-full rounded-l-md">
            <input
              type="text"
              value={domainName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  !loading && handleSearch();
                }
              }}
              onChange={(e) => setDomainName(e.target.value)}
              className="w-full h-full py-2.5 rounded-l-md px-2.5 outline-none font-normal text-[14px]"
              placeholder="Nhập tên miền cần mua ở đây..."
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="group text-[13px] flex-shrink-0 px-5 font-medium text-white text-center bg-primary  rounded-r-md flex justify-center items-center gap-1 overflow-hidden"
          >
            <span className="group-active:scale-90 transition-transform duration-150 ease-out flex items-center gap-1">
              {loading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <IoIosSearch size={16} /> Tìm kiếm
                </>
              )}
            </span>
          </button>
        </div>

        {loading ? (
          <SkeletonDomainsList />
        ) : (
          <>
            {searchResult && Object.keys(searchResult)?.length > 0 ? (
              <>
                {Object.keys(searchResult).map((key) => {
                  const isActive = highlightedProvider === key;

									switch (key) {
                    /*
										case "godaddy":
											return (
												<div id="provider-godaddy" key={key}>
													<GodaddysList
														isActive={isActive}
														domains={searchResult[key]?.domains}
														name={domainName}
														index={searchResult[key]?.index || 0}
														error={searchResult[key]?.error}
													/>
												</div>
											);
                    */
                   
                    case "namecheap":
                      return (
                        <div id="provider-name-cheap" key={key}>
                          <NameCheapList
                            isActive={isActive}
                            domains={searchResult[key]?.domains}
                            name={domainName}
                            index={searchResult[key]?.index || 0}
                            error={searchResult[key]?.error}
                          />
                        </div>
                      );

                    case "dynadots":
                      return (
                        <div id="provider-dynadots" key={key}>
                          <DynadotsList
                            isActive={isActive}
                            domains={searchResult[key]?.domains}
                            name={domainName}
                            index={searchResult[key]?.index || 0}
                            error={searchResult[key]?.error}
                          />
                        </div>
                      );

                    case "gname":
                      return (
                        <div id="provider-gname" key={key}>
                          <GnameList
                            isActive={isActive}
                            domains={searchResult[key]?.domains}
                            name={domainName}
                            index={searchResult[key]?.index || 0}
                            error={searchResult[key]?.error}
                          />
                        </div>
                      );
                    
                    case "epik":
                      return (
                        <div id="provider-epik" key={key}>
                          <EpikList
                            isActive={isActive}
                            domains={searchResult[key]?.domains}
                            name={domainName}
                            index={searchResult[key]?.index || 0}
                            error={searchResult[key]?.error}
                          />
                        </div>
                      );
                    
                    case "name":
                      return (
                        <div id="provider-name" key={key}>
                          <NameList
                            isActive={isActive}
                            domains={searchResult[key]?.domains}
                            name={domainName}
                            index={searchResult[key]?.index || 0}
                            error={searchResult[key]?.error}
                          />
                        </div>
                      );
                  }
                })}
              </>
            ) : (
              <div className="flex gap-10 pt-16 justify-center items-start w-full">
                <img
                  src="/imgs/registrar.svg"
                  alt="Nhập tên miền để tìm kiếm tên miền cần mua!"
                  className="w-[300px]"
                />
                <div className="max-w-[400px] flex-shrink-0 pt-5">
                  <h1 className="text-2xl font-bold text-gray-800">Tìm kiếm & Sở hữu Tên Miền!</h1>
                  <p className="text-gray-600 mt-2">
                    Khám phá và đăng ký tên miền lý tưởng cho thương hiệu của bạn từ các nhà cung
                    cấp hàng đầu như
                    <span className="font-semibold text-primary">
                      {" "}
                      NameCheap, GoDaddy, Gname, Epik, Enom
                    </span>{" "}
                    và <span className="font-semibold text-primary">Dynadot.</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Access>
  );
}
