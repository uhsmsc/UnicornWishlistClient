import React, { useContext, useEffect, useState, useRef } from "react";
import Header from "../components/Header.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import CreateWishlistModal from "../components/CreateWishlistModal.jsx";
import defaulPicture from "../assets/present.png";
import { IoLogOutOutline } from "react-icons/io5";
import getDeclension from "@dubaua/get-declension";
import CreateGiftModal from "../components/CreateGiftModal.jsx";
import { useNavigate } from "react-router-dom";
import useClickOutside from "../hooks/useClickOutside.js";

const WishlistCard = ({ wishlist, onEdit, onDelete, onAddGift }) => {
  const navigate = useNavigate();
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavigation = () => {
    if (!isGiftModalOpen) {
      navigate(`/wishlist/${wishlist._id}`);
    }
  };

  const giftCount = wishlist.gifts ? wishlist.gifts.length : 0;
  const giftText = getDeclension({
    count: giftCount,
    one: "желание",
    few: "желания",
    many: "желаний",
  });

  const onToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleGiftCreated = (newGift) => {
    setIsGiftModalOpen(false);
    onAddGift(wishlist._id, newGift);
    navigate(`/wishlist/${wishlist._id}`);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-between cursor-pointer"
      onClick={handleNavigation}
    >
      <div className="shrink-0 rounded-2xl shadow-md p-4 bg-white/40 dark:bg-violet-300/10 flex flex-col items-center justify-between w-[205px] h-[270px]">
        <div className="grid grid-cols-2 grid-rows-2 gap-3 pt-2 relative w-full h-full">
          {wishlist.gifts && wishlist.gifts.length > 0 ? (
            wishlist.gifts
              .slice(0, 4)
              .map((gift, index) => (
                <img
                  key={index}
                  src={gift.photo || defaulPicture}
                  alt={`gift-${index}`}
                  className="w-[70px] h-[70px] object-cover rounded-xl"
                />
              ))
          ) : (
            <div className="absolute inset-0 flex items-center flex-col text-center justify-center">
              <p className="font-primary text-gray-600 dark:text-slate-300 m-3 text-sm">
                В этом вишлисте еще нет подарков
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGiftModalOpen(true);
                }}
                className="font-primary font-bold text-[#ee7580] dark:text-[#a4a6f1]"
              >
                Добавить
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col text-left mt-3">
          <div className="text-lg font-primary line-clamp-2 font-semibold dark:text-slate-300">
            {wishlist.title}
          </div>
          <div className="text-sm font-primary text-gray-600 dark:text-slate-300">
            {giftText}
          </div>
        </div>
      </div>
      {isGiftModalOpen && (
        <CreateGiftModal
          wishlistId={wishlist._id}
          onClose={() => setIsGiftModalOpen(false)}
          onGiftCreated={handleGiftCreated}
        />
      )}
      <div className="absolute top-4 right-0 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleDropdown();
          }}
          className="p-1 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 6v.01M12 12v.01M12 18v.01"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 w-32 text-black bg-white dark:border-gray-700 shadow-lg rounded-lg overflow-hidden  z-[99999] font-primary"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(wishlist);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-200 hover:bg-violet-300/20"
            >
              Редактировать
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(wishlist);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-200 hover:bg-violet-300/20"
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileUserInfo = ({ profile, theme }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const wishlistCount = profile.wishlists ? profile.wishlists.length : 0;
  const wishlistText = getDeclension({
    count: wishlistCount,
    one: "вишлист",
    few: "вишлиста",
    many: "вишлистов",
  });

  const confirmLogout = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    logout();
    navigate("/");
    setIsLogoutModalOpen(false);
  };

  return (
    <div
      className={`lg:hidden ${
        theme === "dark"
          ? "bg-black/40 text-indigo-100"
          : "bg-white/30 text-black"
      } rounded-2xl shadow-lg pl-3 py-3 flex flex-col gap-4 relative`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-4">
          <Avatar src={profile.avatar} alt="avatar" size="xxl" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm font-primary text-gray-500 mb-3">
              {wishlistText}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="text"
          onClick={confirmLogout}
          className="h-7 mr-1 dark:border-white/80 text-black/70 border-black/70 text-[10px] md:text-xs font-bold w-fit pl-2 pr-2 dark:text-white/80 flex items-center gap-1 font-primary self-start"
        >
          ВЫЙТИ
          <IoLogOutOutline className="h-6 w-5" />
        </Button>
      </div>

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
    </div>
  );
};

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const { user, initialized } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!initialized);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [isCreateWishlistModalOpen, setIsCreateWishlistModalOpen] =
    useState(false);
  const [isDeleteWishlistModalOpen, setIsDeleteWishlistModalOpen] =
    useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState(null);
  const [wishlistToEdit, setWishlistToEdit] = useState(null);
  const wishlistCount = profile?.wishlists ? profile.wishlists.length : 0;

  const wishlistText = getDeclension({
    count: wishlistCount,
    one: "вишлист",
    few: "вишлиста",
    many: "вишлистов",
  });

  const handleAddGift = (wishlistId, newGift) => {
    setProfile((prev) => ({
      ...prev,
      wishlists: prev.wishlists.map((w) =>
        w._id === wishlistId ? { ...w, gifts: [...w.gifts, newGift] } : w
      ),
    }));
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfile(null);
  };

  const handleDeleteWishlist = async (wishlist) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotAuthorized(true);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${wishlist._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Ошибка удаления вишлиста");
      setProfile((prev) => ({
        ...prev,
        wishlists: prev.wishlists.filter((w) => w._id !== wishlist._id),
      }));
      setIsDeleteWishlistModalOpen(false);
    } catch (err) {
      console.error("Ошибка удаления вишлиста:", err);
    }
  };

  const handleEditWishlist = (wishlist) => {
    setWishlistToEdit(wishlist);
    setIsCreateWishlistModalOpen(true);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      setNotAuthorized(true);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка запроса");
      setProfile(data.user);
      setLoading(false);
    } catch (err) {
      console.error("Ошибка получения профиля:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setNotAuthorized(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      setProfile(null);
      return;
    }
    fetchProfile();
  }, [user, initialized]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-custom-gradient3" : "bg-custom-gradient2"
        }`}
      >
        <Header autoOpenLogin={true} />
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen w-full ${
        theme === "dark" ? "bg-custom-gradient3" : "bg-custom-gradient2"
      }`}
    >
      <Header />
      <div className="flex flex-col w-full gap-5 md:gap-0 px-3 pt-20 pb-8 lg:pb-12 lg:px-8">
        <MobileUserInfo profile={profile} theme={theme} />
        <div
          className={`relative ${
            theme === "dark"
              ? "bg-black/40 text-indigo-100"
              : "bg-white/30 text-black"
          } rounded-2xl md:mt-5 shadow-lg p-5 md:p-8 min-h-[50vh] lg:min-h-[80vh]`}
        >
          <div className="flex justify-start gap-4 items-center mb-3">
            <h2 className="text-xl md:text-2xl font-primary font-bold">
              Мои вишлисты
            </h2>
            <Button
              size="sm"
              variant="outlined"
              className="px-2 md:px-3 py-2 font-primary text-[11px] lg:text-[13px] dark:text-indigo-100 dark:border-indigo-100"
              onClick={() => setIsCreateWishlistModalOpen(true)}
            >
              Создать вишлист
            </Button>
          </div>
          <p className="text-sm font-primary text-gray-500 mb-3 hidden lg:block">
            {wishlistText}
          </p>
          <div className="overflow-x-auto pb-5 snap-x scroll-smooth custom-scrollbar flex flex-nowrap md:flex-wrap gap-3 py-2 justify-start">
            {profile?.wishlists?.map((wishlist) => (
              <WishlistCard
                key={wishlist._id}
                wishlist={wishlist}
                onEdit={handleEditWishlist}
                onDelete={handleDeleteWishlist}
                onAddGift={handleAddGift}
              />
            ))}
          </div>
        </div>
      </div>
      {isCreateWishlistModalOpen && (
        <CreateWishlistModal
          onClose={() => {
            setIsCreateWishlistModalOpen(false);
            setWishlistToEdit(null);
          }}
          wishlistData={wishlistToEdit}
          onWishlistCreated={(updatedWishlist) => {
            if (wishlistToEdit) {
              setProfile((prev) => ({
                ...prev,
                wishlists: prev.wishlists.map((w) =>
                  w._id === updatedWishlist._id ? updatedWishlist : w
                ),
              }));
            } else {
              setProfile((prev) => ({
                ...prev,
                wishlists: [...(prev.wishlists || []), updatedWishlist],
              }));
            }
          }}
        />
      )}
      <Dialog
        open={isDeleteWishlistModalOpen}
        handler={() => setIsDeleteWishlistModalOpen(false)}
      >
        <DialogHeader>Удалить вишлист</DialogHeader>
        <DialogBody>
          <p>Вы уверены, что хотите удалить вишлист?</p>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsDeleteWishlistModalOpen(false)}
          >
            Отмена
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() =>
              wishlistToDelete && handleDeleteWishlist(wishlistToDelete)
            }
          >
            Удалить
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Profile;
