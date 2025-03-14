import socket, { setAccessToken } from "@/helpers/web-socket.helper";
import { getAccessTokenFromLS } from "@/utils/auth";
import React, { useEffect } from "react";

interface SocketIOGuardProps {
  children: React.ReactNode;
}

const SocketIoGuard: React.FC<SocketIOGuardProps> = ({ children }) => {
  const accessToken = getAccessTokenFromLS();
  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      socket?.connect();
      socket?.on("connect", () => {
        console.log("connected to server success!");
      });
    }
    return () => {
      socket?.disconnect();
    };
  }, [accessToken]);
  return <>{children}</>;
};

export default SocketIoGuard;
