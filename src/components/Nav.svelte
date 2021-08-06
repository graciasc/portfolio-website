<script>
    import { githubAlt, linkedin, linkedinSquare } from 'svelte-awesome/icons';
    import Icon from 'svelte-awesome/components/Icon.svelte'
</script>
<main>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
<style>
  #menu-toggle:checked + #menu {
    display:block;
  }
</style>
<div class="flex-1 font-mono">
  <!-- NAVBAR -->
  <div class="lg:px-6 py-2 my-2 px-4 border-b-2 border-gray-600 flex justify-between">
    <div>
      <!-- <img width="50px" height="50px" src="https://logos-download.com/wp-content/uploads/2016/11/EA_logo_black.png" /> -->
      <h1 class="text-black  hover:text-red-500"> <a class="a-no-style " href="/"> Gracias </a> </h1>
      <!-- show this section if theey click on the hamburger-->
      <div class="pt-3 hidden" id="menu">
        <nav class="cursor-pointer">
          <ul>
            <li class="border-transparent border-b-2 hover:border-gray-600"><a class="a-no-style"  href="/about"> About </a> </li>
            <li class="border-transparent border-b-2 hover:border-gray-600"><a class="a-no-style"  href="/about"> Resume </a></li>
            <li class="border-transparent border-b-2 hover:border-gray-600"><Icon data={githubAlt} class="text-black-400 hover:text-black-700 bg-white" scale="2"> </Icon></li>
            <li class="border-transparent border-b-2 hover:border-gray-600"><Icon data={githubAlt} class="text-black-400 hover:text-black-700 bg-white" scale="2"> </Icon></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="inline lg:hidden mt-1 ml-2">
      <label for="menu-toggle"><i class="fa fa-bars fa-lg cursor-pointer"> </i></label>
    </div>
    <input type="checkbox" id="menu-toggle" class="mt-4 hidden" />

    <div class="lg:block lg:float-right hidden cursor-pointer">
      <p class="px-2 inline  border-transparent border-b-2  hover:border-red-400 "><a class="a-no-style"  href="/about">About</a></p>
      <p class="px-2 inline border-transparent border-b-2 hover:border-red-400"><a class="a-no-style" href="/resume"> Resume</a></p>
      <p class=" px-1 border-transparent inline  border-b-2 bottom-1 relative hover:border-teal-600 focus:outline-none outline-none"><Icon data={githubAlt} class="text-black-400 hover:text-gray-700 bg-white" scale="2"> </Icon></p>
      <p class=" px-1 border-transparent inline  border-b-2 bottom-1 relative hover:border-teal-600 focus:outline-none outline-none"><Icon data={linkedinSquare} class="text-blue-600 hover:text-blue-800 bg-white" scale="2"> </Icon></p>
    </div>
  </div>
</main>

<style> 
.a-no-style {
  text-decoration: inherit;
    color: inherit;
    cursor: pointer;
}
</style>