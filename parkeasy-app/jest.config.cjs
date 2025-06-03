module.exports = {
  preset: "jest-expo", // imprescindible con Expo
  setupFilesAfterEnv: ["<rootDir>/src/test/jestSetup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?expo|@react-native|react-native" +
      "|@expo|expo-google-fonts|react-clone-referenced-element" +
      "|@react-navigation)",
  ],
  testPathIgnorePatterns: ["/e2e/"],
};
