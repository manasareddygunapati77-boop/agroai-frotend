// SearchBar.jsx
import React from "react";
import "../styles/SearchBar.css";

function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search crops, diseases, fertilizers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => onSearch(query)}>Search</button>
    </div>
  );
}

export default SearchBar;
