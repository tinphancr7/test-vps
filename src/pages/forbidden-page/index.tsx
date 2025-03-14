import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { Helmet } from "react-helmet";
import "./forbidden-page.css";
const ErrorPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { statusMessageCode } = useSelector(
    (state: RootState) => state.ipWhiteList
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    const handleTouchMove = (event: TouchEvent) => {
      setMousePosition({
        x: event.touches[0].clientX / window.innerWidth,
        y: event.touches[0].clientY / window.innerHeight,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const eyePosition = {
    cx: 115 + 30 * mousePosition.x,
    cy: 50 + 30 * mousePosition.y,
  };

  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="error-page flex flex-col justify-start py-10 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="robot-error"
          viewBox="0 0 260 118.9"
          role="img"
        >
          <defs>
            <clipPath id="white-clip">
              <circle id="white-eye" fill="#cacaca" cx="130" cy="65" r="20" />
            </clipPath>
            <text id="text-s" className="error-text" y="106">
              403
            </text>
          </defs>

          <path
            className="alarm"
            fill="#e62326"
            d="M120.9 19.6V9.1c0-5 4.1-9.1 9.1-9.1h0c5 0 9.1 4.1 9.1 9.1v10.6"
          />
          <use xlinkHref="#text-s" x="-0.5px" y="-1px" fill="black" />
          <use xlinkHref="#text-s" fill="#2b2b2b" />

          <g id="robot">
            <g id="eye-wrap">
              <use xlinkHref="#white-eye" />
              <circle
                id="eyef"
                className="eye"
                clipPath="url(#white-clip)"
                fill="#000"
                stroke="#2aa7cc"
                strokeWidth="2"
                strokeMiterlimit="10"
                cx={eyePosition.cx}
                cy={eyePosition.cy}
                r="11"
              />
              <ellipse
                id="white-eye"
                fill="#2b2b2b"
                cx="130"
                cy="40"
                rx="18"
                ry="12"
              />
            </g>
            <circle
              className="lightblue"
              cx="105"
              cy="32"
              r="2.5"
              id="tornillo"
            />
            <use xlinkHref="#tornillo" x="50" />
            <use xlinkHref="#tornillo" x="50" y="60" />
            <use xlinkHref="#tornillo" y="60" />
          </g>
        </svg>

        <h1 className="text-xl mt-4">
          {statusMessageCode === 42
            ? "Địa chỉ IP của bạn không nằm trong danh sách IP White List!"
            : "Địa chỉ IP của bạn cần được Admin cho phép truy cập!"}
        </h1>
        <div className="flex gap-2 justify-center items-center mt-2">
          <h1 className="text-lg">Vui lòng liên hệ</h1>
          <h2>
            {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://t.me/botulenh86"
              className="text-teal-500 hover:text-white"
            >
              RAIDEN!
            </a>
          </h2>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
