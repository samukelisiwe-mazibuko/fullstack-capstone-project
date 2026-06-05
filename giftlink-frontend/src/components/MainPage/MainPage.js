import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const [gifts, setGifts] = useState([]);
  const navigate = useNavigate();

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  // Fetch gifts from backend
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/gifts`);
        setGifts(res.data);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      }
    };

    fetchGifts();
  }, [backendURL]);

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="main-page">
      <h2>Gifts</h2>

      <div className="gift-list">
        {gifts.map((gift) => (
          <div
            key={gift._id}
            className="gift-card"
            onClick={() => navigate(`/gift/${gift._id}`)}
          >
            <img
              src={gift.image || "https://via.placeholder.com/150"}
              alt={gift.name}
            />

            <h3>{gift.name}</h3>

            <p>{formatDate(gift.date_added)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;