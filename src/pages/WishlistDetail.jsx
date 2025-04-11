import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button } from "@material-tailwind/react";
import CreateGiftModal from "../components/CreateGiftModal.jsx";
import defaulPicture from "../assets/present.png";
import HeartRating from "../components/HeartRating.jsx";
import { MdOutlineArrowOutward } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import Masonry from "react-masonry-css";
import { formatPrice } from "../utils/formatPrice.js";
import useClickOutside from "../hooks/useClickOutside.js";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx";

const GiftCard = ({ gift, wishlist, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const onToggleDropdown = (id) => {
    setIsDropdownOpen((prevId) => (prevId === id ? null : id));
  };

  const closeDropdown = () => {
    setIsDropdownOpen(null);
  };

  useClickOutside(dropdownRef, closeDropdown, [buttonRef]);

  const toggleComment = () => setExpanded((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current?.contains(event.target) ||
        buttonRef.current?.contains(event.target)
      ) {
        return;
      }
      closeDropdown();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col bg-white/30 dark:bg-black/40 md:bg-violet-100/40 md:dark:bg-violet-300/10 rounded-2xl shadow-md p-4 py-2">
      <div className="absolute top-4 right-2 z-10">
        <button
          ref={buttonRef}
          onClick={() => onToggleDropdown(gift._id)}
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
        {isDropdownOpen === gift._id && (
          <div
            ref={dropdownRef}
            className="absolute right-0 w-32 text-black bg-white dark:border-gray-700 shadow-lg rounded-lg overflow-hidden  z-[99999] font-primary"
          >
            <button
              onClick={() => {
                onEdit(gift);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-200 hover:bg-violet-300/20"
            >
              Редактировать
            </button>
            <button
              onClick={() => {
                onDelete(gift);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-200 hover:bg-violet-300/20"
            >
              Удалить
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-row mb-2">
        <div className="flex-none md:w-36 w-32 h-48 flex items-center justify-center overflow-hidden">
          <img
            src={gift.photo || defaulPicture}
            alt={gift.title}
            className={`object-contain ${
              gift.photo
                ? "max-w-full max-h-full rounded-xl"
                : "max-w-[80%] max-h-[80%]"
            }`}
          />
        </div>
        <div className="flex flex-col flex-grow ml-5 relative pt-3">
          <div className="flex flex-col gap-2">
            <div
              className="text-md md:text-lg md:leading-[1.2] font-primary font-bold dark:text-neutral-100 pr-4 line-clamp-2"
              title={gift.title}
            >
              {gift.title}
            </div>

            <div className="text-base font-primary text-black dark:text-neutral-200">
              {gift.price !== undefined && gift.price !== null
                ? `${formatPrice(gift.price)} ${gift.currency || "₽"}`
                : "Цена не указана"}
            </div>

            {gift.desirability && <HeartRating rating={gift.desirability} />}
            {gift.comment && (
              <div className="text-gray-600 dark:text-neutral-200 font-primary">
                <button
                  onClick={toggleComment}
                  className="text-black dark:text-neutral-200 text-sm font-primary"
                >
                  {expanded ? "Скрыть комментарий" : "Развернуть комментарий"}
                </button>
                {expanded && (
                  <p className="mt-1 mb-2 whitespace-pre-line break-words dark:text-neutral-300 text-sm">
                    {gift.comment}
                  </p>
                )}
              </div>
            )}
          </div>
          {gift.reservedBy && wishlist.bookingPrivacy !== "none" && (
            <p className="absolute -top-5 right-1 whitespace-nowrap text-neutral-800 dark:text-slate-200 bg-gradient-to-tr from-[#9da0f5] to-[#da8898] px-3 py-1 rounded-lg font-primary text-sm font-semibold">
              {wishlist.bookingPrivacy === "with_names"
                ? `Бронь: ${gift.reservedBy}`
                : "Подарок забронирован"}
            </p>
          )}
          <div className="mt-auto">
            <a href={gift.link} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outlined"
                className="h-8 px-3 py-2 font-primary text-sm normal-case dark:text-slate-200 dark:border-slate-200 flex items-center justify-center whitespace-nowrap"
              >
                <span>Купить тут</span>
                <MdOutlineArrowOutward className="ml-1 text-xl" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = ({ message, onClose }) => (
  <div
    className="bg-indigo-100 border border-indigo-400 text-indigo-700 px-4 py-3 rounded-xl mt-4 fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center min-w-64 max-w-[90%] sm:max-w-[80%]"
    role="alert"
  >
    <div className="flex-grow text-center whitespace-normal break-words">
      <strong className="font-bold font-primary">Успех! </strong>
      <span className="font-primary">{message}</span>
    </div>
    <span className="cursor-pointer ml-2" onClick={onClose}>
      <svg
        className="fill-current h-6 w-6 text-indigo-500"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
      </svg>
    </span>
  </div>
);

const WishlistDetail = () => {
  const { wishlistId } = useParams();
  const { theme } = useContext(ThemeContext);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState(null);
  const [notification, setNotification] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteGift, setDeleteGift] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotAuthorized(true);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${wishlistId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Ошибка получения вишлиста");
        }
        const data = await res.json();
        setWishlist(data.wishlist);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка получения вишлиста:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setNotAuthorized(true);
        setLoading(false);
      }
    };
    fetchWishlist();

    window.addEventListener("userLoggedIn", fetchWishlist);
    window.addEventListener("focus", fetchWishlist);

    return () => {
      window.removeEventListener("userLoggedIn", fetchWishlist);
      window.removeEventListener("focus", fetchWishlist);
    };
  }, [wishlistId]);

  const handleShare = () => {
    const publicLink = `${window.location.origin}/public-wishlist/${wishlistId}`;
    navigator.clipboard
      .writeText(publicLink)
      .then(() => {
        setNotification("Ссылка на вишлист скопирована в буфер обмена!");
        setTimeout(() => setNotification(""), 3000);
      })
      .catch((err) => console.error("Ошибка копирования ссылки:", err));
  };

  const handleRequestDeleteGift = (gift) => {
    setDeleteGift(gift);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteGift = async (giftId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotAuthorized(true);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gift/${giftId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Ошибка удаления подарка");
      setWishlist((prev) => ({
        ...prev,
        gifts: prev.gifts.filter((gift) => gift._id !== giftId),
      }));
    } catch (err) {
      console.error("Ошибка удаления подарка:", err);
    }
  };

  const handleEditGift = (gift) => {
    setGiftToEdit(gift);
    setIsGiftModalOpen(true);
  };

  const breakpointColumnsObj = {
    default: 3,
    1280: 2,
    800: 1,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }
  if (notAuthorized) {
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
  if (!wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Вишлист не найден
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
      <div className="flex flex-col w-full px-3 pt-20 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center my-4 gap-y-4">
          <div className="flex gap-2 order-1 md:order-2 w-full justify-end">
            <Button
              variant="outlined"
              onClick={() => {
                setGiftToEdit(null);
                setIsGiftModalOpen(true);
              }}
              className="w-full md:w-auto dark:text-slate-200 dark:border-slate-200 font-primary py-2 px-3 text-xs"
            >
              Добавить подарок
            </Button>
            <Button
              variant="outlined"
              onClick={handleShare}
              className="w-full md:w-auto dark:text-slate-200 dark:border-slate-200 font-primary text-xs flex py-2 px-3 items-center justify-center"
            >
              <MdContentCopy className="mr-1 text-xl" /> Поделиться
            </Button>
          </div>
          <h1 className="px-2 text-2xl font-primary font-bold dark:text-indigo-100 order-2 md:order-1 text-left w-full ">
            {wishlist.title}
          </h1>
        </div>

        {wishlist.comment && (
          <p className="mb-6 px-2 font-primary dark:text-indigo-100">
            {wishlist.comment}
          </p>
        )}

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {wishlist.gifts?.length ? (
            wishlist.gifts.map((gift) => (
              <div key={gift._id}>
                <GiftCard
                  gift={gift}
                  wishlist={wishlist}
                  onEdit={handleEditGift}
                  onDelete={(giftId) => handleRequestDeleteGift(giftId)}
                />
              </div>
            ))
          ) : (
            <p>Пока подарков нет.</p>
          )}
        </Masonry>

        {isGiftModalOpen && (
          <CreateGiftModal
            wishlistId={wishlist._id}
            onClose={() => {
              setIsGiftModalOpen(false);
              setGiftToEdit(null);
            }}
            onGiftCreated={(newGift) =>
              setWishlist((prev) => ({
                ...prev,
                gifts: giftToEdit
                  ? prev.gifts.map((gift) =>
                      gift._id === newGift._id ? newGift : gift
                    )
                  : [...(prev.gifts || []), newGift],
              }))
            }
            giftData={giftToEdit}
          />
        )}
      </div>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification("")}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (deleteGift) {
            handleDeleteGift(deleteGift._id);
          }
          setIsDeleteModalOpen(false);
        }}
        itemType="gift"
        itemName={deleteGift?.title || ""}
      />
    </div>
  );
};

export default WishlistDetail;
