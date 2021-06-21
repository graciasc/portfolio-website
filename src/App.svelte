<script>
  import Nav from "./components/Nav.svelte";
  import Section from "./components/Section.svelte";
  import Footer from "./components/Footer.svelte";
  import { Router } from "svelte-router-spa";
  import { routes } from "./Router";
  import "animejs/lib/anime.es.js";

  /**js*/

  let options = { gaPageviews: true };
</script>

<main>
  <div class="h-full">
    <!-- Nav bar -->
    <Nav />
    <!-- Router page -->
    <Router {routes} {options} />
  </div>
  <!-- Footer  -->
  <Footer />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
