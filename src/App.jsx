import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RepoDetails from "./pages/RepoDetails";
import IssuesPage from "./pages/IssuesPage";
import UserProfile from "./pages/UserProfile"; 

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repo/:owner/:repo" element={<RepoDetails />} />
          <Route path="/repo/:owner/:repo/issues" element={<IssuesPage />} />
          <Route path="/user/:username" element={<UserProfile />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
