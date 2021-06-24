<script>
  export let projects;
</script>

<main>
  {#each projects as project}
    <div class="bg-main relative lg:hidden">
      <div class="pl-6">
        <h1 class="text-h-hue text-2xl font-bold leading-9 pt-4">
          {project.title}
        </h1>
        <p class="text-p-hue pt-2">{project.text}</p>
        <button />
      </div>
      <div class="relative h-48 m-5">
        <img
          class="absolute inset-0 w-full h-full object-cover object-center"
          src={project.img}
        />
      </div>
    </div>
  {/each}
</main>
