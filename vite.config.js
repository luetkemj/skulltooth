import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const GIT_HASH = process.env.GIT_HASH;
  return {
    // vite config
    base: "/skulltooth/",
    define: {
      __GIT_HASH__: JSON.stringify(GIT_HASH),
    },
  };
});
