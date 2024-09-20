self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/auth/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/auth/login.js"
    ],
    "/auth/register": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/auth/register.js"
    ],
    "/creatures": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/creatures.js"
    ],
    "/creatures/newCreature": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/creatures/newCreature.js"
    ],
    "/roles/caregiver": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/roles/caregiver.js"
    ],
    "/roles/teacher": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/roles/teacher.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];