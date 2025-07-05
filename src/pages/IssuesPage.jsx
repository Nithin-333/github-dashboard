import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const IssuesPage = () => {
  const { owner, repo } = useParams();
  const [openIssues, setOpenIssues] = useState([]);
  const [closedIssues, setClosedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("kanban"); // or "list"

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const [openRes, closedRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=10`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=10`)
        ]);

        const openData = await openRes.json();
        const closedData = await closedRes.json();

        setOpenIssues(openData || []);
        setClosedIssues(closedData || []);
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [owner, repo]);

  if (loading) return <div className="container"><p>Loading issues...</p></div>;

  return (
    <div className="container">
      <div className="back-link">
      <Link to={`/repo/${owner}/${repo}`} >
         Back to Repo Details
      </Link>
</div>
      <h1>Issues for {owner}/{repo}</h1>

      <button onClick={() => setView(view === "kanban" ? "list" : "kanban")}>
        Switch to {view === "kanban" ? "List View" : "Kanban View"}
      </button>

      {view === "kanban" ? (
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        
          <div style={{ flex: 1 }}>
            <h4> To Do </h4>
            {openIssues.map((issue) => (
              <div key={issue.id} className="repo-card" style={{ marginBottom: "1rem" }}>
                <p><strong>{issue.title}</strong></p>
                <p className="stats">#{issue.number} opened by {issue.user.login}</p>
              </div>
            ))}
          </div>

          
          <div style={{ flex: 1 }}>
            <h4> Done </h4>
            {closedIssues.map((issue) => (
              <div key={issue.id} className="repo-card" style={{ marginBottom: "1rem" }}>
                <p><strong>{issue.title}</strong></p>
                <p className="stats">#{issue.number} closed by {issue.user.login}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <h3>All Issues (List View)</h3>
          {[...openIssues, ...closedIssues].map((issue) => (
            <div key={issue.id} className="repo-card" style={{ marginBottom: "1rem" }}>
              <p><strong>{issue.title}</strong></p>
              <p className="stats">#{issue.number} — {issue.state.toUpperCase()} by {issue.user.login}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesPage;
