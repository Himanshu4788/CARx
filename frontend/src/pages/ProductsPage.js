import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/product/FilterSidebar";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, total, pages, currentPage } = useSelector((s) => s.products);

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    return {
      keyword: params.get("keyword") || "",
      category: params.get("category") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      sort: params.get("sort") || "",
      rating: params.get("rating") ? Number(params.get("rating")) : "",
      page: params.get("page") ? Number(params.get("page")) : 1,
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL);
  const [search, setSearch] = useState(filters.keyword);

  useEffect(() => {
    const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "" && v !== null));
    dispatch(fetchProducts(clean));
    const params = new URLSearchParams(clean).toString();
    navigate(`/products${params ? "?" + params : ""}`, { replace: true });
  }, [filters, dispatch]);

  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, keyword: search, page: 1 }));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0" }}>
          {filters.category ? filters.category.toUpperCase() : "ALL CARS"}
        </h1>
        <p style={{ color: "#666" }}>{total} products found</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        <input
          className="input-field"
          placeholder="Search toy cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
        <button type="submit" className="btn-primary" style={{ padding: "10px 20px" }}>Search</button>
      </form>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28 }}>
        {/* Sidebar */}
        <FilterSidebar filters={filters} onChange={handleFiltersChange} />

        {/* Products grid */}
        <div>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card" style={{ height: 320, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ height: "55%", background: "#1a1a1a", animation: "pulse 1.5s infinite" }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ height: 12, background: "#1a1a1a", borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 10, background: "#1a1a1a", borderRadius: 4, width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
              <h3 style={{ color: "#f0f0f0", marginBottom: 8 }}>No products found</h3>
              <p style={{ color: "#666" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                      style={{
                        width: 36, height: 36, border: "1px solid",
                        borderColor: currentPage === i + 1 ? "#e63946" : "#2a2a2a",
                        background: currentPage === i + 1 ? "#e63946" : "transparent",
                        color: "white", borderRadius: 6, cursor: "pointer", fontSize: 13
                      }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
