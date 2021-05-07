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
    setLoading(true);
    const res = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (res) {
      setGithubUser(res.data);
      const { login, followers_url } = res.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}`),
      ])
        .then((result) => {
          const [repos, followers] = result;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "sorry are exceeded your horly rate limits");
    }
    getRequest();
    setLoading(false);
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
  }, []);

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
