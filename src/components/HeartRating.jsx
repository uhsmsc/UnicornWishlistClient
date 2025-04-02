import React from "react";
import { FaHeart } from "react-icons/fa";


const HeartRating = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <FaHeart key={i} size={18} className={i < rating ? "text-red-500 border-black" : "text-slate-300"} />
      ))}
    </div>
  );
};

export default HeartRating;


