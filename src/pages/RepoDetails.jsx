import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';









export default function RepositoryDetails() {




  const { owner, repo } = useParams();
  const [details, setDetails] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      setLoading(true);
            try {
              const [repoRes, contribRes, langRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
              ]);

              const repoData = await repoRes.json();
              const contribData = await contribRes.json();
              const langData = await langRes.json();

        setDetails(repoData);
        setContributors(contribData);
        setLanguages(langData);
      } catch (err) {
        console.error("Error loading repo details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [owner, repo]);

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!details) return <p className="p-4 text-red-600">Error loading repository details.</p>;

  return (
    <div className="repo-details">
     
      <Link to="/" className="back-link">
 Back to Repo Search
</Link>

      <h1>Repository Details</h1>

      <h2 className="text-2xl font-bold text-purple-700 mb-2">{details.full_name}</h2>
      <p className="text-gray-700 mb-4">{details.description}</p>

      <div className="stats mb-4">
        <span className="mr-4"> Stars: {details.stargazers_count}</span>
        <span> Forks: {details.forks_count}</span>
      </div>

      <div className="languages mb-6">
        <h3 className="text-lg font-semibold mb-1">Languages Used:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {Object.entries(languages).map(([lang, bytes]) => (
            <li key={lang}>{lang} — {bytes} bytes</li>
          ))}
        </ul>
      </div>

      <div className="contributors mb-6">
        <h3 className="text-lg font-semibold mb-1">Top Contributors:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {contributors.map((contributor) => (
            <li key={contributor.id}>
              <Link 
                to={`/user/${contributor.login}`} 
                style={{ color: "#6f42c1", textDecoration: "none" }}
              >
                {contributor.login}
              </Link> ({contributor.contributions} contributions)
            </li>
          ))}
        </ul>
      </div>

      <div className="buttons mt-4">
  <Link to={`/repo/${owner}/${repo}/issues`}>
    <button className="view-issues-button">
      View Issues
    </button>
  </Link>
</div>

    </div>
  );
}
