const config = {
  api: {
    token: import.meta.env.VITE_API_TOKEN || "",
    host: import.meta.env.VITE_API_HOST || "http://localhost:3001",
  },
};

export default config;
