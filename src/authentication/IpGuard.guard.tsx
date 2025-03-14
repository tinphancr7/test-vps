/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
import authApis from "@/apis/auth-apis";
import LazyLoadingPage from "@/components/lazy-loading-page";
import ForbiddenPage from "@/pages/forbidden-page";
import { RootState } from "@/stores";
import {
  setIpAllowed,
  setIpErrorMessage,
  setIpStatusMessage,
} from "@/stores/slices/ipWhiteList.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface IpGuardProps {
  children: React.ReactNode;
}

const IpGuard: React.FC<IpGuardProps> = ({ children }) => {
  const dispatch = useDispatch();
  const ipAllowed = useSelector(
    (state: RootState) => state.ipWhiteList.isIpAllowed
  );

  useEffect(() => {
    if (ipAllowed === null) {
      authApis
        .checkIpWhiteList()
        .then(() => {
          dispatch(setIpAllowed(true));
        })
        .catch((err: any) => {
          const { status, message } = err?.response?.data;
          dispatch(setIpErrorMessage(message));
          dispatch(setIpStatusMessage(Number(status)));
          dispatch(setIpAllowed(false));
        });
    }
  }, [dispatch, ipAllowed]);

  if (ipAllowed === null) {
    return <LazyLoadingPage />;
  }

  if (!ipAllowed) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
};

export default IpGuard;
