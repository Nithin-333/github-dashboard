import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const User = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [starredRepos, setStarredRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [recentCommits, setRecentCommits] = useState([]);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, starredRes, followersRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/starred?per_page=5`),
          fetch(`https://api.github.com/users/${username}/followers?per_page=5`)
        ]);

        const userData = await userRes.json();
        const starredData = await starredRes.json();
        const followersData = await followersRes.json();

        setProfile(userData);
        setStarredRepos(starredData);
        setFollowers(followersData);

        
    if (starredData.length > 0) {
          const [owner, repo] = [starredData[0].owner.login, starredData[0].name];
          const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`);
          const commitsData = await commitsRes.json();
          setRecentCommits(commitsData);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [username]);

  if (!profile) return <p style={{ padding: '1rem' }}>Loading user profile...</p>;

  return (
    <div className="user-profile">
      <Link to="/" className="back-to-search">Back to Search</Link>

      <h2>{profile.name} ({profile.login})</h2>
      <img src={profile.avatar_url} alt="avatar" width="100" />

      <p>{profile.bio}</p>

      <h3>Top Starred Repositories</h3>
      <ul>
        {starredRepos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.full_name}</a>
          </li>
        ))}
      </ul>

      <h3>Followers</h3>
      <ul>
        {followers.map(follower => (
          <li key={follower.id}>
            <a href={follower.html_url} target="_blank" rel="noreferrer">{follower.login}</a>
          </li>
        ))}
      </ul>

<h3>Recent Commits (from top starred repo)</h3>
  <ul>
        {recentCommits.map(commit => (
          <li key={commit.sha}>
            {commit.commit.message} - <i>{commit.commit.author.name}</i>
                                  </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
