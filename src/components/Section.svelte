<script>
  import Icon from "svelte-awesome/components/Icon.svelte";
  import { longArrowRight } from "svelte-awesome/icons";

  let scrollY;

  function autoScroll() {
    //scroll to Y after click
    scrollY = 605
  }
</script>

<svelte:window bind:scrollY={scrollY}/>

<main>
  <!-- Section -->  
  <div class="flex justify-center pt-24 font-mono cursor-pointer">
    <div class=" m-6 lg:m-12 text-center lg:w-1/2">
      <p class="text-p-hue">
        Hi I am <span class="text-red-600"> Gracias Claude </span>
      </p>
      <h1 class="text-h-hue lg:text-3xl text-4xl font-extrabold">
        I'll Help You Build Your Dream
      </h1>
      <p class="text-p-hue">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s
      </p>
      <p
        class="mt-4 border-b-2 font-bold border-teal-600 focus:outline-none inline-block lg:mt-4 hover:shadow-sm"
        
      >
        Connect with me <Icon
          data={longArrowRight}
          class="text-gray-400 bg-white"
          scale="1"
        />
      </p>
    </div>
    <!-- <div class="w-1/2 relative"><img src="https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"</div> -->
  </div>

  <!--  Arrow Icon -->
          <div class="flex justify-center mt-12 lg:mt-10 cursor-pointer" on:click={autoScroll}>
    <i class="fa fa-angle-double-down animate-bounce fa-2x text-gray-600" />
  </div>

</main>
