import { useMemo } from "react";

import { useAppSelector } from "@/stores";
import Result from "../result/Result";
import { SubjectEnum } from "@/constants/enum";

interface IProps {
  hideChildren?: boolean;
  children: React.ReactNode;
  action: string;
  subject: string;
}

const Access = ({
  action,
  subject,
  hideChildren = false,
  children,
}: IProps) => {
  const { permissions, isLoading } = useAppSelector((state) => state.auth);

  const allow = useMemo(() => {
    if (!permissions?.length) return false;
    const hasPermission = permissions.some(
      (item: any) =>
        (item.subject === subject && item.action?.includes(action)) ||
        item.subject === SubjectEnum.ALL
    );

    return hasPermission;
  }, [action, subject, permissions]);

  if ((!allow && hideChildren) || isLoading) return null;

  return (
    <>
      {allow ? (
        children
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
        />
      )}
    </>
  );
};

export default Access;
