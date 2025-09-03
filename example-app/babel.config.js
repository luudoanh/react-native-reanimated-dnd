module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@/components": "./components",
            "@/hooks": "./hooks",
            "@/types": "./types",
            "@/context": "./context",
            "@/navigation": "./navigation",
            "@/external-lib": "./external-lib",
          },
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
