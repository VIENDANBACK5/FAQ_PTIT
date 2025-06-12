import { defineConfig } from "umi";

export default defineConfig({
  title: "Diễn đàn sinh viên",
  favicons: ["/stackPTIT.png"],
  routes: [
    {
      path: "/auth",
      component: "@/layouts/AuthLayout",
      routes: [
        {
          path: "/auth/login",
          component: "@/pages/Auth/Login/index",
        },
        {
          path: "/auth/register",
          component: "@/pages/Auth/Register/index",
        },
      ],
    },
    {
      path: "/",
      component: "@/layouts/AppLayout",
      routes: [
        { path: "/", component: "@/pages/index", name: "Trang chủ" },
        { path: "questions", component: "@/pages/Questions/index" },
        {
          path: "questions/tagged/:tagname",
          component: "@/pages/Questions/components/TaggedQuestions",
        },
        { path: "question/:id", component: "@/pages/Question/Detail" },
        { path: "tags", component: "@/pages/Tags/index" },
        { path: "search", component: "@/pages/Search/index" },
        {
          path: "ask",
          component: "@/pages/Question/Create",
          wrappers: ["@/wrappers/auth", "@/wrappers/roleAuth"],
          allowedRoles: ["teacher", "student"],
        },
        // Hồ sơ công khai - không yêu cầu đăng nhập
        {
          path: "users/:id/:name",
          component: "@/pages/Profile/index",
        },
        // Hồ sơ cá nhân - yêu cầu đăng nhập và role phù hợp
        {
          path: "user",
          wrappers: ["@/wrappers/auth", "@/wrappers/roleAuth"],
          allowedRoles: ["teacher", "student"],
          routes: [
            {
              path: "saves/:id",
              component: "@/pages/Profile/components/Private/Saves",
              wrappers: [
                "@/wrappers/auth",
                "@/wrappers/roleAuth",
                "@/wrappers/profileAuth",
              ],
              allowedRoles: ["teacher", "student"],
            },
            {
              path: "settings/:id",
              component: "@/pages/Profile/components/Private/Setting",
              wrappers: [
                "@/wrappers/auth",
                "@/wrappers/roleAuth",
                "@/wrappers/profileAuth",
              ],
              allowedRoles: ["teacher", "student"],
              routes: [
                {
                  path: "profile",
                  component:
                    "@/pages/Profile/components/Private/Setting/ProfileSetting",
                },
                {
                  path: "account",
                  component:
                    "@/pages/Profile/components/Private/Setting/AccountSetting",
                },
                {
                  path: "preferences",
                  component:
                    "@/pages/Profile/components/Private/Setting/PreferencesSetting",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "dashboard",
      component: "@/layouts/AdminLayout",
      routes: [
        { path: "", component: "@/pages/Admin/Dashboard" },
        { path: "tags", component: "@/pages/Admin/Tags" },
        { path: "users", component: "@/pages/Admin/Users" },
        {
          path: "questions",
          component: "@/pages/Admin/Questions",
          allowedRoles: ["admin"],
        },
      ],
      wrappers: ["@/wrappers/auth", "@/wrappers/roleAuth"],
      allowedRoles: ["admin"],
    },

    {
      path: "*",
      component: "@/pages/404",
    },
    {
      path: "/403",
      component: "@/pages/403",
    },
  ],

  npmClient: "npm",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/model", "@umijs/plugins/dist/tailwindcss"],
  model: {},
  // mock: {
  //   include: ["src/mock/**/*.ts"],
  // },
});
