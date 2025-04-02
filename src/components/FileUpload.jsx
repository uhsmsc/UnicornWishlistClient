import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    // Проверка формата
    const validFormats = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];
    if (!validFormats.includes(selectedFile.type)) {
      setError("Поддерживаются только SVG, PNG, JPG и GIF.");
      return;
    }

    // Проверка размера (например, не более 800x400px)
    const image = new Image();
    image.onload = () => {
      if (image.width > 800 || image.height > 400) {
        setError("Размер изображения не должен превышать 800x400 пикселей.");
        setFile(null);
      } else {
        setError(""); // Очистка ошибки
        setFile(URL.createObjectURL(selectedFile));
      }
    };
    image.src = URL.createObjectURL(selectedFile);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-52 mb-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Нажмите, чтобы загрузить,</span> или перетащите
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG или GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      {file && (
        <div className="mt-4">
          <img src={file} alt="Preview" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
