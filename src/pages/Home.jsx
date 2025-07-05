import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&page=${page}&per_page=10`
      );
      const data = await response.json();
      setRepos(data.items || []);
    } catch (error) {
      console.error("Error fetching repos:", error);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [page]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="container">
      <h1>GitHub Repository Search</h1>

      <div className="search-box">
        <input
          type="text"
          value={query}
          placeholder="Search repository. . . . . ."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => { setPage(1); handleSearch(); }}>Search</button>
      </div>

      {repos.map((repo) => (
        <div key={repo.id} className="repo-card">
          <Link to={`/repo/${repo.owner.login}/${repo.name}`}>
            <h3>{repo.full_name}</h3>
          </Link>
          <p>{repo.description}</p>
          <div className="stats">
            Star: {repo.stargazers_count} | Forks: {repo.forks_count}
          </div>
        </div>
      ))}

      {repos.length > 0 && (
        <div className="next">
          <button onClick={handlePrev} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Home;
