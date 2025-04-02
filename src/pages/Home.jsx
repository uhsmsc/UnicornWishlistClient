import React, { useState, useContext, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import logo1 from "../assets/logo-main.png";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import TelegramLogin from "../components/TelegramLogin.jsx";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);
  const secondBlockRef = useRef();
  const isInView = useInView(secondBlockRef, {
    triggerOnce: true,
    threshold: 0.2,
  });

  const contentVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const handleTelegramAuth = (userData, token) => {
    const normalizedUser = userData.id
      ? userData
      : { ...userData, id: userData._id };
    login(normalizedUser, token);
    setIsTelegramModalOpen(false);
    navigate("/profile", { replace: true });
  };

  const handleCreateWishlist = () => {
    if (user) {
      navigate("/profile");
    } else {
      setIsTelegramModalOpen(true);
    }
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-custom-gradient3" : "bg-custom-gradient2"
      } px-3 pt-20 lg:px-8 w-full flex flex-col min-h-svh justify-around`}
    >
      <Header />
      <motion.div
        className={`${
          theme === "dark"
            ? "bg-black/40 text-indigo-100"
            : "bg-white/30 text-black"
        } w-full rounded-2xl shadow-lg p-2 mt-5 sm:p-3 md:p-10 flex flex-col sm:flex-row items-center justify-center h-auto min-h-[70vh] md:min-h-[80vh] max-h-[80vh]`}
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left md:flex-1 mb-10 xl:ml-5">
          <h1 className="font-primary tracking-tight font-light pt-10 leading-7 pl-3 pr-3 sm:leading-7 md:leading-10 xl:leading-none text-2xl md:text-4xl lg:text-3xl xl:text-6xl mb-4">
            Добро пожаловать в UnicornWishlist!
          </h1>
          <p className="font-secondary font-extralight text-base lg:text-base xl:text-xl mb-6 pl-3 pr-4 md:pr-10">
            Легко создавайте списки желаний и делитесь ими с друзьями и близкими
          </p>
          <div className="pl-3 pr-3">
            <button
              className="w-fit bg-indigo-900 shadow-indigo-950 font-secondary text-indigo-100 px-6 py-3 rounded-2xl hover:bg-indigo-500 transition duration-300 text-base xl:text-xl"
              onClick={handleCreateWishlist}
            >
              Создать вишлист
            </button>
          </div>
        </div>
        <div className="flex md:flex-1 justify-center items-start">
          <img
            src={logo1}
            alt="Gift Blue"
            className="w-[14rem] sm:w-[15rem] md:w-[23rem] lg:w-[28rem] xl:w-[40rem] h-auto pb-10 md:pb-0"
          />
        </div>
      </motion.div>
      <footer className="py-4 text-center text-gray-500 text-sm sm:text-base">
        <p>© 2025 UnicornWishlist App</p>
      </footer>

      {/* Модальное окно авторизации через Telegram */}
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
    </div>
  );
};

export default Home;
