import React, { useState } from "react";

const CATEGORIES = ["sports", "trucks", "vintage", "electric", "military", "luxury", "bikes", "other"];

const FilterSidebar = ({ filters, onChange }) => {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 10000]);

  const handleCategory = (cat) => {
    onChange({ ...filters, category: filters.category === cat ? "" : cat, page: 1 });
  };

  const handlePrice = () => {
    onChange({ ...filters, minPrice: priceRange[0], maxPrice: priceRange[1], page: 1 });
  };

  const handleSort = (e) => {
    onChange({ ...filters, sort: e.target.value, page: 1 });
  };

  const handleRating = (r) => {
    onChange({ ...filters, rating: filters.rating === r ? "" : r, page: 1 });
  };

  const clearAll = () => {
    setPriceRange([0, 10000]);
    onChange({});
  };

  return (
    <div className="glass-card" style={{ padding: 20, position: "sticky", top: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: "#f0f0f0", fontSize: 16 }}>FILTERS</h3>
        <button onClick={clearAll} style={{ background: "none", border: "none", color: "#e63946", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Clear All</button>
      </div>

      {/* Sort */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 8 }}>SORT BY</label>
        <select value={filters.sort || ""} onChange={handleSort} className="input-field" style={{ padding: "8px 12px" }}>
          <option value="">Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 10 }}>CATEGORY</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              style={{
                background: filters.category === cat ? "#e63946" : "transparent",
                border: `1px solid ${filters.category === cat ? "#e63946" : "#2a2a2a"}`,
                color: filters.category === cat ? "white" : "#aaa",
                padding: "7px 12px", borderRadius: 6, cursor: "pointer", textAlign: "left",
                fontSize: 13, fontWeight: 500, textTransform: "capitalize", transition: "all 0.2s"
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 10 }}>
          PRICE RANGE — ₹{priceRange[0]} – ₹{priceRange[1]}
        </label>
        <input type="range" min={0} max={10000} value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          onMouseUp={handlePrice}
          style={{ width: "100%", accentColor: "#e63946" }} />
      </div>

      {/* Rating */}
      <div>
        <label style={{ color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 10 }}>MIN RATING</label>
        <div style={{ display: "flex", gap: 6 }}>
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => handleRating(r)}
              style={{
                background: filters.rating === r ? "#e63946" : "#1a1a1a",
                border: `1px solid ${filters.rating === r ? "#e63946" : "#2a2a2a"}`,
                color: "white", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12
              }}>
              {r}★+
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
