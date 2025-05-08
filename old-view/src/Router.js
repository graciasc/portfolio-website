import Home from "./pages/Home.svelte";
import About from "./pages/About.svelte";
import ErrorPage from "./pages/Error.svelte";
import Resume from "./pages/Resume.svelte";

const routes = [
  {
    name: "/",
    component: Home,
  },
  {
    name: "/resume",
    component: Resume,
  },
  {
    name: "/about",
    component: About,
  },
  { name: "*", component: ErrorPage },
];

export { routes };
