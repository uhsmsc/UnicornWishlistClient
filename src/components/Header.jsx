import React, {
  useState,
  useEffect,
  useContext,
  forwardRef,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext.jsx";
import Switcher from "./Switcher.jsx";
import {
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TelegramLogin from "./TelegramLogin.jsx";
import { useWindowSize } from "../hooks/useWindowSize";
import { AuthContext } from "../context/AuthContext.jsx";
import useClickOutside from "../hooks/useClickOutside.js";

const Header = forwardRef(({ autoOpenLogin = false }, ref) => {
  const { user, login, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize();

  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const menuRef = useRef(null);
  const avatarButtonRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false), [avatarButtonRef]);

  useEffect(() => {
    if (autoOpenLogin && !user) {
      setIsTelegramModalOpen(true);
    }
  }, [autoOpenLogin, user]);

  const handleTelegramAuth = (userData, token) => {
    const normalizedUser = userData.id
      ? userData
      : { ...userData, id: userData._id };
    login(normalizedUser, token);
    setIsTelegramModalOpen(false);
    navigate("/profile", { replace: true });
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setIsVisible(window.scrollY < 50 || window.scrollY < lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const confirmLogout = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    logout();
    navigate("/");
    setIsLogoutModalOpen(false);
  };

  const isProfilePage = location.pathname === "/profile";
  const isSmallScreen = width && width < 1024;

  return (
    <>
      <motion.header
        ref={ref}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: isVisible ? "0%" : "-100%", opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full pt-7 px-5 lg:px-10 md:pr-10 flex justify-between items-center z-50"
      >
        <Link to="/">
          <span
            className={`font-primary text-xl ${
              theme === "dark" ? "text-indigo-100" : "text-black"
            }`}
          >
            UnicornWishlist
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Switcher />
          {user ? (
            (!isProfilePage || !isSmallScreen) && (
              <div className="relative lg:block">
                <button
                  ref={avatarButtonRef}
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <Avatar
                    src={user.photo_url || user.avatar}
                    alt={user.name || "avatar"}
                    size="md"
                  />
                </button>
                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-32 text-black bg-white dark:border-gray-700 shadow-lg rounded-lg overflow-hidden  z-[99999] font-primary"
                  >
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>
                      <button className="font-primary block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 hover:bg-violet-300/20">
                        Профиль
                      </button>
                    </Link>
                    <button
                      onClick={confirmLogout}
                      className="font-primary block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 hover:bg-violet-300/20"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <Button
              size="sm"
              variant="outlined"
              onClick={() => setIsTelegramModalOpen(true)}
              className="text-xs font-primary md:text-sm dark:text-indigo-100 dark:border-indigo-100"
            >
              Войти
            </Button>
          )}
        </div>
      </motion.header>

      <Dialog open={isTelegramModalOpen} handler={setIsTelegramModalOpen}>
        <DialogHeader className="font-primary">
          Войти через Telegram
        </DialogHeader>
        <DialogBody divider>
          <p className="mb-4 font-primary">
            Нажмите на кнопку ниже, чтобы авторизоваться через Telegram.
          </p>
          <TelegramLogin onAuth={handleTelegramAuth} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsTelegramModalOpen(false)}
            className="font-primary"
          >
            Отмена
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={isLogoutModalOpen} handler={setIsLogoutModalOpen}>
        <DialogHeader className="font-primary">
          Подтверждение выхода
        </DialogHeader>
        <DialogBody divider className="font-primary">
          Вы действительно хотите выйти? <br />
          Для полной безопасности завершите сессию в Telegram.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsLogoutModalOpen(false)}
            className="font-primary mr-1"
          >
            Отмена
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleConfirmLogout}
            className="font-primary"
          >
            Выйти
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
});

export default Header;
