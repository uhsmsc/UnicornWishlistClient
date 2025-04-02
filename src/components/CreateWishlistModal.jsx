import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import "react-day-picker/style.css";

const CreateWishlistModal = ({ onClose, wishlistData, onWishlistCreated }) => {
  const navigate = useNavigate();
  const isEdit = Boolean(wishlistData);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    comment: "",
    date: null,
    bookingPrivacy: "none",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setForm({
        title: wishlistData.title || "",
        comment: wishlistData.comment || "",
        date: wishlistData.eventDate ? new Date(wishlistData.eventDate) : null,
        bookingPrivacy: wishlistData.bookingPrivacy || "none",
      });
    }
  }, [isEdit, wishlistData]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleDateSelect = (selectedDate) => {
    setForm({ ...form, date: selectedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Ошибка: пользователь не авторизован.");
      setLoading(false);
      return;
    }
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/wishlist${
        isEdit ? `/${wishlistData._id}` : ""
      }`;
      const method = isEdit ? axios.put : axios.post;
      const response = await method(
        url,
        {
          title: form.title,
          comment: form.comment,
          eventDate: form.date,
          bookingPrivacy: form.bookingPrivacy,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedWishlist = response.data.wishlist || response.data;
      if (onWishlistCreated) {
        onWishlistCreated(updatedWishlist);
      } else {
        navigate(`/wishlist/${updatedWishlist._id}`);
      }
      onClose();
    } catch (error) {
      console.error(
        "Ошибка при создании/обновлении вишлиста:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50 font-primary">
      <div className="bg-white dark:bg-black/90 rounded-2xl p-6 shadow-lg w-[350px] md:w-[430px]">
        <h2 className="font-primary text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {isEdit ? "Редактировать вишлист" : "Создать новый вишлист"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-primary block mb-1 text-gray-900 dark:text-gray-100">
              Название вишлиста <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Например: Новый год"
              value={form.title}
              onChange={handleChange("title")}
              required
              className="font-primary w-full p-2 border-0 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-gray-900 dark:text-gray-100">
              Комментарий
            </label>
            <textarea
              placeholder="Напиши комментарий к событию"
              value={form.comment}
              onChange={handleChange("comment")}
              className="w-full p-2 border-0 resize-none h-24 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-900 dark:text-gray-100">
              Дата события
            </label>
            <Popover
              open={isPopoverOpen}
              handler={setIsPopoverOpen}
              placement="bottom"
            >
              <PopoverHandler>
                <div className="relative">
                  <input
                    readOnly
                    placeholder="Выбери дату"
                    value={form.date ? format(form.date, "dd.MM.yyyy") : ""}
                    className="w-full p-2 border-0 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsPopoverOpen(true)}
                  />
                </div>
              </PopoverHandler>
              <PopoverContent className="z-[9999] mt-2">
                <DayPicker
                  mode="single"
                  selected={form.date}
                  onSelect={(selectedDate) => {
                    handleDateSelect(selectedDate);
                    setIsPopoverOpen(false);
                  }}
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative mb-4">
            <label className="block mb-1 text-gray-900 dark:text-gray-100">
              Хочешь видеть, какие желания забронированы?
            </label>
            <select
              value={form.bookingPrivacy}
              onChange={handleChange("bookingPrivacy")}
              className="appearance-none w-full p-2 rounded-md bg-slate-100 dark:bg-gray-300/20 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="with_names">Да, с именами</option>
              <option value="without_names">Да, без имен</option>
              <option value="none">Нет</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 top-7 right-3 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-gray-700 dark:text-gray-100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Создание..." : isEdit ? "Обновить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWishlistModal;
