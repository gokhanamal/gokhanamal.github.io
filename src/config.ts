export const SITE = {
  website: "https://gnamal.com/", // replace this with your deployed domain
  author: "Gökhan Namal",
  profile: "https://gnamal.com/",
  desc: "Notes on building, investing, and life.",
  title: "Gökhan Namal",
  // Social preview image (OpenGraph/Twitter)
  ogImage: "assets/home.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/gokhanamal/gokhanamal.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Los_Angeles", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
