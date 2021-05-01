import React, { useState, useEffect, createContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

export const GitHubContext = createContext();

export const GitHubProvider = ({ children }) => {
  return (
    <GitHubContext.Provider value={"hello"}>{children}</GitHubContext.Provider>
  );
};
