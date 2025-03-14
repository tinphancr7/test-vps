import authApis from "@/apis/auth-apis";
import paths from "@/routes/paths";
import { useAppDispatch, useAppSelector } from "@/stores";
import { logout } from "@/stores/slices/auth-slice";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import ModalChangePassword from "./components/ModalChangePassword";
import { useEffect, useMemo, useState } from "react";
import { addCommas } from "@/utils";
import { convertVnToUsd } from "@/utils/vn-to-usd";
import { setModal } from "@/stores/slices/modal-slice";
import Modal2FA from "./components/modal-2fa";
import ModalAddWhiteListIp from "./components/modal-manage-white-list-ip";
import { SubjectEnum } from "@/constants/enum";
import { BsCart3 } from "react-icons/bs";
import Cart from "./components/cart";
import { asyncThunkGetCartInfo } from "@/stores/slices/cart-slice";
import { fetchWalletAccount } from "@/stores/slices/wallet.slice";

const URL_IMAGE = 123;

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, onOpenChange } = useDisclosure();
  const { user } = useAppSelector((state) => state.auth);
  const { domains: domainsInCart } = useAppSelector((state) => state.cart);

  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(10);
  const { topFilter, result } = useAppSelector((state) => state.wallet);
  useEffect(() => {
    const { provider } = topFilter || {};

    dispatch(
      fetchWalletAccount({
        page: 1,
        limit: 100000,
        provider,
        team: user?.team?.join(","),
      })
    );
  }, [topFilter]);

  useEffect(() => {
    if (Array.isArray(result)) {
      const accounts: any = result
        ?.filter((acc: any) => acc?.balance > 0)
        ?.map((acc: any) => ({
          id: acc?._id,
          name: `${acc?.provider?.name} (${acc?.team?.name})`,
          value: acc?.balance,
          provider: acc?.provider?.name,
        }));
      setItems(accounts);
    }
  }, [result]);

  useEffect(() => {
    dispatch(asyncThunkGetCartInfo());
  }, []);

  const handleNavigate = async (route: string) => {
    if (route === "logout") {
      await authApis.callLogout();
      dispatch(logout());

      navigate(paths.signIn);
    } else {
      navigate(route);
    }
  };
  const { permissions } = useAppSelector((state) => state.auth);
  const isAdmin = useMemo(() => {
    if (!permissions?.length) return false;

    const hasPermission = permissions.some(
      (item: any) => item.subject === SubjectEnum.ALL
    );

    return hasPermission;
  }, [permissions]);

  const handleOpenProfile = () => {};

  const handleOpen2FA = () => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Xác thực 2 bước",
        body: <Modal2FA />,
      })
    );
  };

  const handleOpenWhilteListIp = () => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Quản lý địa chỉ IP Whitelist",
        maxWidth: "!max-w-[60%]",
        body: <ModalAddWhiteListIp />,
      })
    );
  };

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 10);
  };

  const handleOpenCart = () => {
    dispatch(
      setModal({
        isOpen: true,
        placement: "right",
        title: "Giỏ hàng",
        body: <Cart />,
        maxWidth: "max-w-[40%]",
      })
    );
  };

  return (
    <div className="nav__bar shadow-navbar bg-light py-1 pl-2 pr-5 grid grid-cols-12">
      <div className="col-span-10 flex">
        <div className="flex flex-col w-full justify-center items-start py-1">
          <div className="flex flex-wrap justify-end items-center gap-2">
            {items.slice(0, visibleItems).map((item: any) => (
              <div
                key={item.id}
                className="flex gap-1.5 bg-primary bg-opacity-5 border-[0.5px] border-primary px-3 py-1 rounded-md cursor-pointer select-none transform transition-transform duration-200 active:scale-95"
              >
                <p className="text-[14px] text-black font-medium">
                  {item.name}:
                </p>
                <p className="text-[14px] text-primary font-bold">
                  {addCommas(convertVnToUsd(item.value, item?.provider)) || 0}$
                </p>
              </div>
            ))}
          </div>

          {visibleItems < items.length && (
            <button
              onClick={handleLoadMore}
              className="mt-4 px-4 py-0.5 bg-primary text-white text-[13px] rounded-full shadow-lg hover:bg-primary-dark transition duration-200"
            >
              xem thêm
            </button>
          )}
        </div>
      </div>

      <div className="col-span-1 flex items-center justify-end pr-4">
        <div className="cursor-pointer" onClick={handleOpenCart}>
          <Badge
            color="danger"
            content={domainsInCart?.length}
            shape="circle"
            classNames={{
              badge: "!-right-[15%] !-top-[15%] text-sm",
            }}
          >
            <BsCart3 className="min-w-max text-base w-5 h-5" />
          </Badge>
        </div>
      </div>

      <div className="col-span-1 flex justify-end">
        <Dropdown
          placement="bottom-start"
          classNames={{
            trigger: "cursor-pointer",
            content: "rounded-md",
          }}
        >
          <DropdownTrigger>
            <div className="flex items-center gap-1">
              <div className="flex flex-row justify-center items-center gap-2">
                <div className="w-14 h-14 flex flex-row justify-center items-center relative">
                  <Avatar
                    src={`${URL_IMAGE}/${user?.avatar}`}
                    isBordered
                    showFallback
                    className="w-10 h-10"
                  />
                </div>

                <p className="text-base text-dark font-bold uppercase">
                  {user?.name || user?.username}
                </p>
              </div>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User Actions"
            variant="flat"
            color="primary"
            classNames={{
              base: "max-md:hidden",
            }}
          >
            <DropdownItem
              key="profile"
              className="h-10 gap-2"
              showDivider
              onPress={handleOpenProfile}
            >
              <h3 className="text-base font-medium">Trang cá nhân</h3>
            </DropdownItem>

            <DropdownItem
              key="2fa"
              className="h-10 gap-2"
              showDivider
              onPress={handleOpen2FA}
            >
              <h3 className="text-base font-medium">Xác thực 2 bước</h3>
            </DropdownItem>
            {isAdmin ? (
              <DropdownItem
                key="2fa"
                className="h-10 gap-2"
                showDivider
                onPress={handleOpenWhilteListIp}
              >
                <h3 className="text-base font-medium">Quản lý IP WhiteList</h3>
              </DropdownItem>
            ) : (
              <></>
            )}

            <DropdownItem
              key="pw-change"
              className="h-10 gap-2"
              showDivider
              onPress={onOpenChange}
            >
              <h3 className="text-base font-medium">Đổi mật khẩu</h3>
            </DropdownItem>

            <DropdownItem key="logout" onPress={() => handleNavigate("logout")}>
              <h2 className="text-base font-medium">Đăng xuất</h2>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {isOpen && (
        <ModalChangePassword isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
    </div>
  );
}

export default Navbar;
