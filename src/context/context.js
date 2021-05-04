import React, { useState, useEffect, createContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

export const GithubContext = createContext();

export const GitHubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGitHubUsers = async (user) => {
    toggleError();
    const res = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(res);
    if (res) {
      setGithubUser(res.data);
    } else {
      toggleError(true, "sorry are exceeded your horly rate limits");
    }
  };

  const getRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        setRequests(data.rate.remaining);
        if (data.rate.remaining === 0) {
          toggleError(true, "sorry are exceeded your horly rate limits");
        }
      })
      .catch((error) => console.log(error));
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(() => {
    getRequest();
  }, [githubUser]);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        loading,
        error,
        searchGitHubUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
