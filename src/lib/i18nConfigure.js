const i18n = require("i18n");
const path = require("node:path");

i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true,
  syncFiles: true,
  cookie: "iCraftYou-locale",
});

i18n.setLocale("en");

module.exports = i18n;
