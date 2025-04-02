import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import WishlistDetail from "./pages/WishlistDetail";
import PublicWishlist from "./pages/PublicWishlist.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist/:wishlistId" element={<WishlistDetail />} />
        <Route path="/public-wishlist/:wishlistId" element={<PublicWishlist />} />
      </Routes>
    </Router>
  );
}

export default App;
