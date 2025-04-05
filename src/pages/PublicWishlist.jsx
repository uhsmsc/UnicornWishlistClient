import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import defaulPicture from "../assets/present.png";
import HeartRating from "../components/HeartRating.jsx";
import { MdOutlineArrowOutward } from "react-icons/md";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button, Input } from "@material-tailwind/react";
import BookGiftModal from "../components/BookGiftModal.jsx";
import Masonry from "react-masonry-css";

const PublicWishlist = () => {
  const { wishlistId } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGiftId, setActiveGiftId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reserverName, setReserverName] = useState("");
  const { theme } = useContext(ThemeContext);
  const [expandedComments, setExpandedComments] = useState({});

  const breakpointColumnsObj = {
    default: 3,
    1280: 2,
    1024: 1,
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/public/wishlist/${wishlistId}`
        );
        if (!res.ok) {
          throw new Error("Ошибка загрузки вишлиста");
        }
        const data = await res.json();
        setWishlist(data.wishlist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [wishlistId]);

  const handleReserveGift = async () => {
    if (!reserverName.trim()) {
      alert("Введите ваше имя для бронирования");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gift/reserve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ giftId: activeGiftId, reserverName }),
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка бронирования подарка");
      }

      const { gift } = await res.json();
      setWishlist((prev) => ({
        ...prev,
        gifts: prev.gifts.map((g) =>
          g._id === activeGiftId ? { ...g, reservedBy: reserverName } : g
        ),
      }));

      setModalOpen(false);
      setReserverName("");
      setActiveGiftId(null);
    } catch (err) {
      console.error("Ошибка бронирования:", err);
    }
  };

  const toggleComment = (giftId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [giftId]: !prev[giftId],
    }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  if (!wishlist)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Вишлист не найден
      </div>
    );

  const formatPrice = (value) => {
    const number = Number(value);
    if (isNaN(number)) return "";
    const parts = number.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts[1] === "00" ? parts[0] : `${parts[0]}.${parts[1]}`;
  };

  const GiftCard = ({ gift }) => (
    <div className="relative flex flex-col bg-white/30 dark:bg-black/40 md:bg-violet-100/40 md:dark:bg-violet-300/10 rounded-2xl shadow-md p-4 py-2">
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
        <div className="flex flex-col gap-2 flex-grow ml-5 relative pt-3">
          <div className="text-md md:text-xl font-primary font-bold dark:text-neutral-100">
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
                onClick={() => toggleComment(gift._id)}
                className="text-black dark:text-neutral-200 text-sm font-primary"
              >
                {expandedComments[gift._id]
                  ? "Скрыть комментарий"
                  : "Развернуть комментарий"}
              </button>
              {expandedComments[gift._id] && (
                <p className="mt-1 whitespace-pre-line break-words dark:text-neutral-300 text-sm">
                  {gift.comment}
                </p>
              )}
            </div>
          )}
          {gift.reservedBy && wishlist.bookingPrivacy !== "none" && (
            <p className="absolute -top-5 right-1 whitespace-nowrap text-neutral-800 dark:text-slate-200 bg-gradient-to-tr from-[#9da0f5] to-[#da8898] px-3 py-1 rounded-lg font-primary text-sm font-semibold">
              {wishlist.bookingPrivacy === "with_names"
                ? `Бронь: ${gift.reservedBy}`
                : "Подарок забронирован"}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-3 my-0 sm:my-2">
        <div className="flex-none md:w-36 w-32">
          <a href={gift.link} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outlined"
              className="w-full h-10 px-3 py-2 font-primary text-sm normal-case dark:text-slate-200 dark:border-indigo-200 flex items-center justify-center whitespace-nowrap"
            >
              <span>Купить тут</span>
              <MdOutlineArrowOutward className="ml-1 text-xl" />
            </Button>
          </a>
        </div>
        <div className="flex-1">
          <Button
            onClick={() => {
              if (!gift.reservedBy) {
                setActiveGiftId(gift._id);
                setModalOpen(true);
              }
            }}
            variant="gradient"
            disabled={!!gift.reservedBy}
            className={`w-full h-10 px-3 md:px-5 py-2 font-primary text-sm normal-case text-slate-200 flex items-center justify-center ${
              gift.reservedBy
                ? "from-[#e9636e]/80 to-[#ec94a5]/80"
                : "from-[#e9636e] to-[#ec94a5]"
            }`}
          >
            {gift.reservedBy ? "Забронировано" : "Забронировать"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`relative min-h-screen w-full ${
        theme === "dark" ? "bg-custom-gradient3" : "bg-custom-gradient2"
      }`}
    >
      <Header />
      <div className="pt-20 flex flex-col w-full px-3 pb-8 lg:pb-12 lg:px-8">
        <h1 className="pt-8 pb-3 px-2 text-2xl font-primary font-bold text-gray-800 dark:text-gray-100">
          {wishlist.title}
        </h1>
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
          {wishlist.gifts?.map((gift) => (
            <div key={gift._id} className="mb-4">
              <GiftCard gift={gift} wishlist={wishlist} />
            </div>
          ))}
        </Masonry>
      </div>
      <BookGiftModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-center font-primary text-lg font-bold text-gray-900 dark:text-white">
            Введите ваше имя для бронирования
          </h3>
          <Input
            type="text"
            placeholder="Ваше имя"
            value={reserverName}
            onChange={(e) => setReserverName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-0 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setModalOpen(false)}
              variant="text"
              className="text-gray-700 dark:text-gray-300"
            >
              Отмена
            </Button>
            <Button onClick={handleReserveGift} color="blue">
              Подтвердить
            </Button>
          </div>
        </div>
      </BookGiftModal>
    </div>
  );
};

export default PublicWishlist;
