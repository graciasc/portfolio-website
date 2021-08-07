<script>
  import Hero from "../components/Section.svelte";
  import MobileSection from "../screens/mobile/ProjectSection.svelte";
	import { fade } from 'svelte/transition';

  const projects = [
    {
      title: "Coming Soon!",
      text: "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1",
    },
    {
      title: "Coming Soon!",
      text: "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1",
    },
  ];
  // do animation based on y
   let y;
   let visible = false
   console.log(visible)
   $: if (y === 0) {
     //add button to unfade below
     visible = true
  }
</script>
<!-- <svelte:window on:scrollY={handleKeydown}/>  -->
<svelte:window bind:scrollY={y}/>

<main>
  <Hero scrollY={y}/>
  <!-- Spacing -->
  <div class="border-b-2 border-gray-700 pt-6 lg:p-12 " />
  <!-- DESKTOP Section -->
  {#if visible}
  {#each projects as project, i}
    <div
      transition in:fade="{{ duration: 2000 }}"
      class="lg:flex justify-center m-5 lg:m-24 bg-main relative hidden"
      id={`section${i}`}
    >
      <div class="w-1/2 p-6">
        <h1 class="text-h-hue text-4xl font-bold leading-9 pt-4">
          {project.title}
        </h1>
        <p class="text-p-hue text-lg pt-6">{project.text}</p>
        <button />
      </div>
      <div class="w-1/2 relative p-24">
        <img
          class="absolute inset-0 w-full h-full object-cover object-center"
          src={project.img}
        />
      </div>
    </div>
    {/each}
    {/if}

  <!-- Mobile Sections -->
  <MobileSection {projects} />

  <!-- <div class="bg-main relative lg:hidden">
    <div class="relative h-48 m-5">
      <img
        class="absolute inset-0 w-full h-full object-cover object-center"
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1"
      />
    </div> -->
  <!-- </div> -->
</main>
