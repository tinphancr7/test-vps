import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
export interface ToooltipSSLProp {
  clientSSLMap: any[];
}
export default function ToooltipSSL({ clientSSLMap }: ToooltipSSLProp) {
  const [statictis, setStatictis] = useState<any>();
  const [inforTooltip, setInforTooltip] = useState<any>();
  useEffect(() => {
    const total = clientSSLMap?.reduce((acc, curr) => acc + curr?.requests, 0);
    const arrSslMap = clientSSLMap?.map((sslMap) => {
      const getRandomColor = () => {
        const colors = [
          "bg-red-500",
          "bg-blue-500",
          "bg-green-500",
          "bg-pink-500",
          "bg-orange-500",
          "bg-yellow-500",
          "bg-purple-500",
          "bg-indigo-500",
          "bg-teal-500",
          "bg-cyan-500",
        ];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
      };
      return {
        name:
          sslMap?.clientSSLProtocol !== "none"
            ? sslMap?.clientSSLProtocol
            : "Không có (không bảo mật)",
        percent: (sslMap?.requests / total) * 100,
        value: sslMap?.requests,
        color: getRandomColor(),
      };
    });

    setStatictis({
      total,
      arrSslMap,
    });
  }, [clientSSLMap]);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const screenWidth = window.innerWidth;

    let x = e.clientX;
    if (x < 0) x = 0;
    if (x > screenWidth) x = screenWidth;

    setTooltipPosition({
      x,
      y: e.clientY,
    });
  };
  const handleMouseEnter = (sslMap: any) => {
    setInforTooltip(sslMap);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return statictis?.arrSslMap?.length === 0 ? (
    <div className="w-full flex justify-center items-center gap-2 mb-10 text-[19px] font-medium">
      Không có dữ liệu!
    </div>
  ) : (
    <>
      <div className="flex gap-6 ">
        {statictis?.arrSslMap &&
          statictis?.arrSslMap?.map((sslMap: any) => (
            <div
              className={clsx(
                "flex flex-col gap-3  flex-shrink-0 border-r-1 border-r-gray-300 last:!border-r-0"
              )}
              style={{ width: `${100 / statictis?.arrSslMap?.length}%` }}
            >
              <div className="flex gap-2 items-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={clsx(
                      "animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75",
                      `${sslMap?.color}`
                    )}
                  ></span>
                  <span
                    className={clsx(
                      `relative inline-flex rounded-full h-2.5 w-2.5 `,
                      `${sslMap?.color}`
                    )}
                  ></span>
                </span>
                <p className="text-[15px]">{sslMap?.name}</p>
              </div>
              <p className="text-2xl font-semibold">{sslMap?.value}</p>
            </div>
          ))}
      </div>
      <div className="h-12 w-full flex items-center relative overflow-hidden gap-0.5">
        <div
          ref={tooltipRef}
          style={{
            top: `${tooltipPosition.y - 50}px`,
            left: `${tooltipPosition.x}px`,
          }}
          className={`${
            isHovered ? "inline-flex" : " !hidden"
          } select-none  fixed  flex`}
        >
          <div
            className={`-translate-x-1/2 select-none transition-opacity duration-500  h-10 px-2 flex-shrink-0 rounded-sm bg-gray-950 flex items-center justify-center gap-1.5`}
          >
            <p className="text-[15px] text-white">{inforTooltip?.name}: </p>
            <p className="text-[15px] text-white font-bold">
              {inforTooltip?.value}
            </p>
            <p className="text-[15px] text-white">
              ({inforTooltip?.percent?.toFixed(2)}%)
            </p>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[6px] border-t-gray-950 absolute top-full"></div>
          </div>
        </div>

        {statictis?.arrSslMap &&
          statictis?.arrSslMap?.map((sslMap: any) => (
            <div
              style={{ width: `${sslMap?.percent}%` }}
              className={clsx(
                ` h-10  hover:h-12 transition-[height,box-shadow] duration-300 ease-[cubic-bezier(.75,-0.42,.43,1.46)] hover:shadow-md `,
                `${sslMap?.color} hover:shadow-${sslMap?.color} bg-opacity-80`
              )}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => handleMouseEnter(sslMap)}
              onMouseLeave={handleMouseLeave}
            ></div>
          ))}
      </div>
    </>
  );
}
