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
  <div class="flex justify-center pt-24 font-mono">
    <div class=" m-6 lg:m-12 text-center lg:w-1/2">
      <p class="text-p-hue">
        Hi I am <span class="text-red-600"> Gracias Claude </span>
      </p>
      <h1 class="text-h-hue lg:text-3xl text-4xl font-extrabold">
        I'll Help You Build Your Dream
      </h1>
      <p class="text-p-hue">
         I've been building Web Apps since 2016 and would <span class="text-gray-400">"</span><span class="text-red-600">Love</span><span class="text-gray-400">"</span> to help you build your next big idea!
      </p>
      <p
        class="mt-4 border-b-2 font-bold cursor-pointer  hover:border-red-400 focus:outline-none inline-block lg:mt-4 hover:shadow-sm"
        
      >
        Connect with me <Icon
          data={longArrowRight}
          class="text-gray-400 hover:text-red-400"
          scale="1"
        />
      </p>
    </div>
    <!-- <div class="w-1/2 relative"><img src="https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"</div> -->
  </div>

  <!--  Arrow Icon -->
          <div class="flex justify-center mt-12 lg:mt-2 cursor-pointer" on:click={autoScroll}>
    <i class="fa fa-angle-double-down animate-bounce fa-2x text-gray-600 hover:text-red-400" />
  </div>

</main>
