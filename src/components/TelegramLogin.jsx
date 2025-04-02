import React, { useEffect, useRef } from "react";

const TelegramLogin = ({ onAuth }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/telegram`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          }
        );
        const text = await response.text();
        const data = JSON.parse(text);
        if (data.token) {
          onAuth(data.user, data.token);
        } else {
          console.error("Ошибка авторизации:", data.message);
        }
      } catch (error) {
        console.error("Ошибка при запросе авторизации:", error);
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute(
      "data-telegram-login",
      import.meta.env.VITE_TELEGRAM_BOT_USERNAME
    );
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      delete window.onTelegramAuth;
    };
  }, [onAuth]);

  return <div ref={containerRef} id="telegram-login-container"></div>;
};

export default TelegramLogin;
