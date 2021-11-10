<script>
  import { githubAlt, linkedin, linkedinSquare } from "svelte-awesome/icons";
  import Icon from "svelte-awesome/components/Icon.svelte";
  $: toggle = false;
  $: border = "border-gray-600";
  $: activeAbout = "";
  $: activeResume = "";

  const handleMenuToggle = (e) => {
    // show menu below
    toggle = !toggle;
    if (toggle) {
      border = "border-red-600";
      return;
    }
    border = "border-gray-600";
  };

  const close = (menu = "") => {
    toggle = false;
    switch (menu) {
      case "about":
        activeAbout = "border-red-400";
        activeResume = "";
        break;
      case "resume":
        activeAbout = "";
        activeResume = "border-red-400";
        break;
      default:
        activeAbout = "";
        actoveResume = "";
        break;
    }
  };
</script>

<main>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <style></style>
  <div class="flex-1 font-mono">
    <!-- NAVBAR -->

    <div
      class={`lg:px-6 py-2 my-2 px-4 border-b-2 ${border} flex justify-between`}
    >
      <div>
        <!-- <img width="50px" height="50px" src="https://logos-download.com/wp-content/uploads/2016/11/EA_logo_black.png" /> -->
        <h1 class="text-black  hover:text-red-500" on:click={() => close()}>
          <a class="a-no-style " href="/"> Gracias </a>
        </h1>
        <!-- show this section if theey click on the hamburger-->
        <div class="pt-3 hidden" id="menu">
          <nav class="cursor-pointer">
            <ul>
              <li class="border-transparent border-b-2 hover:border-gray-600">
                <a class="a-no-style" href="/about"> About </a>
              </li>
              <li class="border-transparent border-b-2 hover:border-gray-600">
                <a
                  class="a-no-style"
                  href="https://personal-foto.s3.us-west-1.amazonaws.com/resume.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLWVhc3QtMiJIMEYCIQCsUfO5bqOz4TsFhkN4VQyi3V7AvdEb4%2FivN5svAmT3WAIhAKtjLTMX7eAzN1Hcp1xjkDTRy3ng1jZHayikg%2FKgbaiNKv8CCPX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNTYzOTgwNTMzNTc4Igwl7ydcaO4XrAordNEq0wIvdrU1aROT852rMYW0N3upE%2Fk%2FqDIpdTcyxOHTQUmcTdfKKe7j8J0%2BbaSv39klH1fPZU%2BuGgcawstMABJWiJ7vt%2Bm2YRgar0YA4%2FpqRMEokqVoPjNDqofOZcD3reIJBhQZcKLKVqtVYbaM0leSwKeLC5VS%2F%2BrmhwOF2rQXDclPnE57KNHVYAmdYXQoJ90mf3JdJkSq3l4sYt9MWhMS8hy8jI%2Fp7Hrrs2T04x0MMrfNg9xi3pgFzlbVtNt05UgohXkIct8w8aJ%2FxaGHEep1Zf3FNEZXK4mMqtmyxGOGdjv1IZiGatyAc77mhzUaG8fUupsZnaS385GK94ZsZ4vXIFYaDm2c044Hi%2Fk%2Fg5zum6Ystsm%2FCaRYSvPPI3YdX4vGEB0X0ZI1Op%2BHEmOjZot%2Fvgo7CIWVHcaVgdGeRFlhdc7zt%2FZMe0BkN81h2Aa0wG8oFiTVkRAw8b%2BwjAY6sgI2hfDT3laNrDUo3ANvxnW53D0txRjeOf3fd619DuqAvO9GQKz%2BuRflHD%2Fjn6EhH05g87aUrTGm13NqkZU1ouXY2BeJ95vfxYDNq1d3bVgBv0ePY6sSsOTg23%2F1xfdrQJvNPvfQoqrBfQgk3rlpC2MYj8Q%2BqFJLFL6iIF%2Bco2f2dYbSaRs%2BnPVx6BYSIXqKip4nkminpAM7JqDxr4iS4x2Ez3p3UMhryvxpKhix7dc9PY%2BQV8TjCF3aW0PjnllNrWlupiyQpuNESOX7ZqPXAiOLp9fBt0L2h%2FNLAfeK%2Bf7fRW1qKwgXdHhTdmB5mVeTchzTIgGUBeJub6q7C7LAgd4K0VNwM5LMbRjzleWOvVcxBEhklqaQvihyahLk%2BoOdGx4f1SDd2tRZaac3Qc9O7xaI%2Fn4%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20211110T194341Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYGT6375FBD5GML6E%2F20211110%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=4173e903c1e3c0b3b797921e4d360cfd8103c88abddcbff9877265b594cb05d7"
                  download
                >
                  Resume
                </a>
              </li>
              <li class="border-transparent border-b-2 hover:border-gray-600">
                <Icon
                  data={githubAlt}
                  class="text-black-400 hover:text-black-700 bg-white"
                  scale="2"
                />
              </li>
              <li class="border-transparent border-b-2 hover:border-gray-600">
                <Icon
                  data={githubAlt}
                  class="text-black-400 hover:text-black-700 bg-white"
                  scale="2"
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="inline lg:hidden mt-1 ml-2">
        <label on:click={handleMenuToggle}>
          {#if !toggle}
            <i class="fa fa-bars fa-lg cursor-pointer" />
          {:else if toggle}
            <i class="fa fa-times fa-lg cursor-pointer float-right" />
          {:else}{/if}
        </label>
      </div>
      <!-- <input type="checkbox" id="menu-toggle" class="mt-4 hidden" /> -->

      <div class="lg:block lg:float-right hidden cursor-pointer">
        <p
          class={`px-2 inline  border-transparent border-b-2  hover:border-red-400 ${activeAbout}`}
        >
          <a class="a-no-style" on:click={() => close("about")} href="/about"
            >About</a
          >
        </p>
        <p
          class="px-2 inline border-transparent border-b-2 hover:border-red-400"
        >
          <a
            target="_blank"
            class="a-no-style"
            href="https://personal-foto.s3.us-west-1.amazonaws.com/resume.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLWVhc3QtMiJIMEYCIQCsUfO5bqOz4TsFhkN4VQyi3V7AvdEb4%2FivN5svAmT3WAIhAKtjLTMX7eAzN1Hcp1xjkDTRy3ng1jZHayikg%2FKgbaiNKv8CCPX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNTYzOTgwNTMzNTc4Igwl7ydcaO4XrAordNEq0wIvdrU1aROT852rMYW0N3upE%2Fk%2FqDIpdTcyxOHTQUmcTdfKKe7j8J0%2BbaSv39klH1fPZU%2BuGgcawstMABJWiJ7vt%2Bm2YRgar0YA4%2FpqRMEokqVoPjNDqofOZcD3reIJBhQZcKLKVqtVYbaM0leSwKeLC5VS%2F%2BrmhwOF2rQXDclPnE57KNHVYAmdYXQoJ90mf3JdJkSq3l4sYt9MWhMS8hy8jI%2Fp7Hrrs2T04x0MMrfNg9xi3pgFzlbVtNt05UgohXkIct8w8aJ%2FxaGHEep1Zf3FNEZXK4mMqtmyxGOGdjv1IZiGatyAc77mhzUaG8fUupsZnaS385GK94ZsZ4vXIFYaDm2c044Hi%2Fk%2Fg5zum6Ystsm%2FCaRYSvPPI3YdX4vGEB0X0ZI1Op%2BHEmOjZot%2Fvgo7CIWVHcaVgdGeRFlhdc7zt%2FZMe0BkN81h2Aa0wG8oFiTVkRAw8b%2BwjAY6sgI2hfDT3laNrDUo3ANvxnW53D0txRjeOf3fd619DuqAvO9GQKz%2BuRflHD%2Fjn6EhH05g87aUrTGm13NqkZU1ouXY2BeJ95vfxYDNq1d3bVgBv0ePY6sSsOTg23%2F1xfdrQJvNPvfQoqrBfQgk3rlpC2MYj8Q%2BqFJLFL6iIF%2Bco2f2dYbSaRs%2BnPVx6BYSIXqKip4nkminpAM7JqDxr4iS4x2Ez3p3UMhryvxpKhix7dc9PY%2BQV8TjCF3aW0PjnllNrWlupiyQpuNESOX7ZqPXAiOLp9fBt0L2h%2FNLAfeK%2Bf7fRW1qKwgXdHhTdmB5mVeTchzTIgGUBeJub6q7C7LAgd4K0VNwM5LMbRjzleWOvVcxBEhklqaQvihyahLk%2BoOdGx4f1SDd2tRZaac3Qc9O7xaI%2Fn4%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20211110T194341Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYGT6375FBD5GML6E%2F20211110%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=4173e903c1e3c0b3b797921e4d360cfd8103c88abddcbff9877265b594cb05d7"
            download
          >
            Resume</a
          >
        </p>
        <p
          class=" px-1 border-transparent inline  border-b-2 bottom-1 relative hover:border-teal-600 focus:outline-none outline-none"
        >
          <Icon
            data={githubAlt}
            class="text-black-400 hover:text-gray-700 bg-white"
            scale="2"
          />
        </p>
        <p
          class=" px-1 border-transparent inline  border-b-2 bottom-1 relative hover:border-teal-600 focus:outline-none outline-none"
        >
          <Icon
            data={linkedinSquare}
            class="text-blue-600 hover:text-blue-800 bg-white"
            scale="2"
          />
        </p>
      </div>
    </div>
  </div>
  {#if toggle === true}
    <div class="px-3 font-mono grid ">
      <nav class="cursor-pointer block">
        <ul>
          <li
            class={`table border-transparent border-b-2 hover:border-red-400 ${activeAbout}`}
          >
            <a on:click={() => close("about")} class="a-no-style" href="/about">
              About
            </a>
          </li>
          <li
            class={`table border-transparent border-b-2 hover:border-red-400 ${activeResume}`}
          >
            <a
              on:click={() => close("resume")}
              target="_blank"
              class="a-no-style"
              href="https://personal-foto.s3.us-west-1.amazonaws.com/resume.pdf?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLWVhc3QtMiJIMEYCIQCsUfO5bqOz4TsFhkN4VQyi3V7AvdEb4%2FivN5svAmT3WAIhAKtjLTMX7eAzN1Hcp1xjkDTRy3ng1jZHayikg%2FKgbaiNKv8CCPX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNTYzOTgwNTMzNTc4Igwl7ydcaO4XrAordNEq0wIvdrU1aROT852rMYW0N3upE%2Fk%2FqDIpdTcyxOHTQUmcTdfKKe7j8J0%2BbaSv39klH1fPZU%2BuGgcawstMABJWiJ7vt%2Bm2YRgar0YA4%2FpqRMEokqVoPjNDqofOZcD3reIJBhQZcKLKVqtVYbaM0leSwKeLC5VS%2F%2BrmhwOF2rQXDclPnE57KNHVYAmdYXQoJ90mf3JdJkSq3l4sYt9MWhMS8hy8jI%2Fp7Hrrs2T04x0MMrfNg9xi3pgFzlbVtNt05UgohXkIct8w8aJ%2FxaGHEep1Zf3FNEZXK4mMqtmyxGOGdjv1IZiGatyAc77mhzUaG8fUupsZnaS385GK94ZsZ4vXIFYaDm2c044Hi%2Fk%2Fg5zum6Ystsm%2FCaRYSvPPI3YdX4vGEB0X0ZI1Op%2BHEmOjZot%2Fvgo7CIWVHcaVgdGeRFlhdc7zt%2FZMe0BkN81h2Aa0wG8oFiTVkRAw8b%2BwjAY6sgI2hfDT3laNrDUo3ANvxnW53D0txRjeOf3fd619DuqAvO9GQKz%2BuRflHD%2Fjn6EhH05g87aUrTGm13NqkZU1ouXY2BeJ95vfxYDNq1d3bVgBv0ePY6sSsOTg23%2F1xfdrQJvNPvfQoqrBfQgk3rlpC2MYj8Q%2BqFJLFL6iIF%2Bco2f2dYbSaRs%2BnPVx6BYSIXqKip4nkminpAM7JqDxr4iS4x2Ez3p3UMhryvxpKhix7dc9PY%2BQV8TjCF3aW0PjnllNrWlupiyQpuNESOX7ZqPXAiOLp9fBt0L2h%2FNLAfeK%2Bf7fRW1qKwgXdHhTdmB5mVeTchzTIgGUBeJub6q7C7LAgd4K0VNwM5LMbRjzleWOvVcxBEhklqaQvihyahLk%2BoOdGx4f1SDd2tRZaac3Qc9O7xaI%2Fn4%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20211110T194341Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYGT6375FBD5GML6E%2F20211110%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=4173e903c1e3c0b3b797921e4d360cfd8103c88abddcbff9877265b594cb05d7"
              download
            >
              Resume
            </a>
          </li>
        </ul>
      </nav>
    </div>
  {/if}
</main>

<style>
  .a-no-style {
    text-decoration: inherit;
    color: inherit;
    cursor: pointer;
  }
</style>
