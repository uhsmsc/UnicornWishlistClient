import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { FaHeart } from "react-icons/fa";
import FileUpload from "./FileUpload";

const HeartRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1 cursor-pointer">
      {[...Array(5)].map((_, i) => (
        <FaHeart
          key={i}
          size={18}
          className={i < rating ? "text-red-500" : "text-slate-300"}
          onMouseEnter={() => setRating(i + 1)}
          onClick={() => setRating(i + 1)}
        />
      ))}
    </div>
  );
};

const CreateGiftModal = ({ onClose, onGiftCreated, wishlistId, giftData }) => {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("₽");
  const [photo, setPhoto] = useState("");
  const [desirability, setDesirability] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [priceError, setPriceError] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (giftData) {
      setLink(giftData.link || "");
      setTitle(giftData.title || "");
      setPrice(giftData.price || "");
      setCurrency(giftData.currency || "₽");
      setPhoto(giftData.photo || "");
      setDesirability(giftData.desirability || 1);
      setComment(giftData.comment || "");
      setImageUrl(giftData.photo || "");
    }
  }, [giftData]);

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Ошибка: пользователь не авторизован.");
        return;
      }

      let numericPrice = price.replace(/\s/g, "");

      if (numericPrice.endsWith(".")) {
        numericPrice = numericPrice.slice(0, -1);
      }
      const finalPrice = numericPrice ? Number(numericPrice) : undefined;

      const requestData = {
        link,
        title,
        price: finalPrice,
        currency,
        photo: imageUrl || photo,
        desirability,
        comment,
        wishlist: wishlistId,
      };
      const response = giftData
        ? await axios.put(
            `${import.meta.env.VITE_API_URL}/api/gift/${giftData._id}`,
            requestData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        : await axios.post(
            `${import.meta.env.VITE_API_URL}/api/gift`,
            requestData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
      console.log("Результат:", response.data);
      onGiftCreated(response.data);
      onClose();
    } catch (error) {
      console.error(
        "Ошибка при отправке данных:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e) => {
    const original = e.target.value;
    let value = original.replace(/\s+/g, "").replace(",", ".");
    const parts = value.split(".");
    let intPart = parts[0].replace(/\D/g, "");
    let decimalPart = parts[1] ? parts[1].replace(/\D/g, "") : "";

    if (decimalPart.length > 2) {
      decimalPart = decimalPart.substring(0, 2);
    }

    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    let formattedValue = formattedInt;
    if (parts.length > 1 || original.endsWith(".") || original.endsWith(",")) {
      formattedValue += "." + decimalPart;
    }

    const rawDigits = formattedValue.replace(/[\s.]/g, "");

    if (rawDigits.length > 15) {
      setPriceError(true);
      return;
    } else {
      setPriceError(false);
    }

    setPrice(formattedValue);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50 font-primary">
      <div
        ref={modalRef}
        className="bg-white dark:bg-black/90 rounded-2xl p-6 shadow-lg w-[350px] md:w-[430px] max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-primary text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {giftData ? "Редактировать подарок" : "Добавить подарок"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="font-primary block mb-1 text-gray-900 dark:text-gray-100">
            Ссылка на товар <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Укажите, где можно купить подарок"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className="font-primary w-full p-2 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Название <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Например: конструктор LEGO"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="font-primary w-full p-2 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Цена
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className={`w-full p-2 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 ${
                priceError
                  ? "border-0 border-red-500 focus:ring-red-500 mb-0"
                  : "border-0 focus:ring-blue-500 mb-4"
              }`}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`p-2 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 ${
                priceError ? "mb-0" : "mb-4"
              }`}
            >
              <option value="₽">₽</option>
              <option value="$">$</option>
              <option value="€">€</option>
              <option value="£">£</option>
            </select>
          </div>
          {priceError && (
            <p className="text-red-500 text-sm mb-2">не более 15 знаков</p>
          )}

          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            URL фото
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="font-primary w-full p-2 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Введите URL изображения"
          />

          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Загрузить фото
          </label>
          <div className="w-full mx-auto">
            <FileUpload setFile={setPhoto} />
          </div>

          <label className="block mb-1 text-gray-900 dark:text-gray-100">
            Степень желания
          </label>
          <HeartRating rating={desirability} setRating={setDesirability} />

          <label className="block mb-1 text-gray-900 dark:text-gray-100 mt-4">
            Комментарий
          </label>
          <textarea
            placeholder="Оставьте комментарий к подарку: укажите размер, цвет или другие пожелания"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border-0 resize-none h-24 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="text"
              color="red"
              onClick={onClose}
              className="font-primary"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              color="blue"
              disabled={loading}
              className="font-primary"
            >
              {loading
                ? giftData
                  ? "Обновление..."
                  : "Создание..."
                : giftData
                ? "Обновить"
                : "Создать"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGiftModal;
