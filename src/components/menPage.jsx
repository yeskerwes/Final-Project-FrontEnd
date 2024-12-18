import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/genderPage.css"; 

const MenPage = () => {
  const [sneakers, setSneakers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [sortOption, setSortOption] = useState("price-asc");

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/sneakers?gender=men"
        );
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setSneakers(data);
      } catch (err) {
        setHasError(true);
        console.error("Error fetching sneaker data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);

    const sortedSneakers = [...sneakers].sort((a, b) => {
      if (e.target.value === "price-asc") {
        return a.currentPrice - b.currentPrice;
      } else if (e.target.value === "price-desc") {
        return b.currentPrice - a.currentPrice;
      } else if (e.target.value === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (e.target.value === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
    setSneakers(sortedSneakers);
  };

  return (
    <div className="gender-page">
      <div className="filters">
        <ul>
          <li>Product Type</li>
          <li>Mens Footwear Size</li>
          <li>Gender Neutral Footwear Size</li>
          <li>Width</li>
          <li>Mens Clothing Size</li>
          <li>Accessory Size</li>
          <li>Accessory Type</li>
          <li>Color</li>
          <li>Model</li>
          <li>Technology</li>
          <li>Fit</li>
          <li>Price</li>
        </ul>
      </div>

      <div className="products">
        <div className="sort-dropdown">
          <label htmlFor="sort">Sort:</label>
          <select
            id="sort"
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </select>
        </div>

        <div className="product-grid">
          {isLoading && <p>Loading sneakers...</p>}
          {hasError && <p>Error loading sneakers. Please try again later.</p>}
          {!isLoading && !hasError && sneakers.length === 0 && (
            <p>No sneakers available.</p>
          )}
          {!isLoading &&
            !hasError &&
            sneakers.map((sneaker) => (
              <div key={sneaker.id} className="product-card">
                <Link to={`/sneakers/${sneaker.id}`}>
                  <img
                    src={sneaker.imageUrl || "/placeholder-image.jpg"}
                    alt={sneaker.title}
                    className="product-image"
                  />
                </Link>
                <h3>{sneaker.title}</h3>
                <p>{sneaker.category}</p>
                <p>${sneaker.currentPrice.toFixed(2)}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenPage;
