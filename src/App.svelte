<script>
	
	import Nav from './components/Nav.svelte'

	export let name;
</script>

<main>
	<div class="h-full font-mono">
		<!-- Nav bar -->
		<Nav/>
	  
		<!-- Section -->
		<div class="flex justify-center pt-24">
		  <div class=" m-6 lg:m-12 text-center lg:w-1/2">
			<p class="text-p-hue">Hi I am <span class="text-red-600"> Gracias Claude </span></p>
			<h1 class="text-h-hue lg:text-3xl text-4xl font-extrabold">I'll Help You Build Your Dream</h1>
			<p class="text-p-hue">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button class="">Connect with me</button> <i class="fa fa-long-arrow-right animate-pulse text-gray-600"> </i>
		  </div>
		  <!-- <div class="w-1/2 relative"><img src="https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"</div> -->
		</div>
	  
		<!--  Arrow Icon -->
		<div class="flex justify-center mt-12 lg:mt-20">
		  <i class="fa fa-angle-double-down animate-bounce fa-2x text-gray-600"> </i>
		</div>
	  
		<div class="border-b-2 border-gray-700 pt-6 lg:p-24"></div>
	  
		<!-- DESKTOP Section -->
		<h1 id="demo"></h1>
		<div class="lg:flex justify-center m-5 lg:m-24 bg-main relative hidden" id="section">
		  <div class="w-1/2 p-6">
			<h1 class="text-h-hue text-4xl font-bold leading-9 pt-4">The projects I've Worked on...</h1>
			<p class="text-p-hue text-lg pt-6">Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button></button>
		  </div>
		  <div class="w-1/2 relative p-24">
			<img class="absolute inset-0 w-full h-full object-cover object-center" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1" />
		  </div>
		</div>
	  
		<div class="lg:flex lg:justify-center m-5 lg:m-24 bg-main hidden relative" id="section2">
		  <div class="w-1/2 p-6">
			<h1 class="text-h-hue text-4xl font-bold leading-9 pt-4">The projects I've Worked on...</h1>
			<p class="text-p-hue text-xl pt-6">Ipsum is simply dummy text of the printing and typesettings industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button></button>
		  </div>
		  <div class="w-1/2 relative p-24">
			<img class="absolute inset-0 w-full h-full object-cover object-center" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1" />
		  </div>
		</div>
	  
		<div class="lg:flex lg:justify-center hidden m-5 lg:m-24 bg-main relative" id="section3">
		  <div class="w-1/2 p-6">
			<h1 class="text-h-hue text-4xl font-bold leading-9 pt-4">The projects I've Worked on...</h1>
			<p class="text-p-hue text-xl pt-6">Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button></button>
		  </div>
		  <div class="w-1/2 relative p-24">
			<img class="absolute inset-0 w-full h-full object-cover object-center" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1" />
		  </div>
		</div>
	  
		<!-- Mobile Sections -->
		<div class="bg-main relative lg:hidden">
		  <div class="pl-6">
			<h1 class="text-h-hue text-2xl font-bold leading-9 pt-4">The projects I've Worked on...</h1>
			<p class="text-p-hue pt-2">Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button></button>
		  </div>
		  <div class="relative h-48 m-5">
			<img class="absolute inset-0 w-full h-full object-cover object-center" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1" />
		  </div>
		</div>
	  
		<div class="bg-main relative lg:hidden">
		  <div class="pl-6">
			<h1 class="text-h-hue text-2xl font-bold leading-9 pt-4">The projects I've Worked on...</h1>
			<p class="text-p-hue pt-2">Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button></button>
		  </div>
		  <div class="relative h-48 m-5">
			<img class="absolute inset-0 w-full h-full object-cover object-center" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1" />
		  </div>
		</div>
	  
		<div class="bg-main relative lg:hidden">
		  <div class="pl-6">
			<h1 class="text-h-hue text-2xl font-bold leading-9 pt-4">The projects I've Worked on...</h1>
			<p class="text-p-hue pt-2">Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
			<button></button>
		  </div>
		  <div class="relative h-48 m-5">
			<img class="absolute inset-0 w-full h-full object-cover object-center" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1" />
		  </div>
		</div>
	  
		<!-- Footer  -->
	  
		<div class="sticky flex justify-between bg-secondary-hue w-full text-center border-t border-grey p-4 pin-b">
		  <div>
			<h1 class="font-bold">Contact</h1>
			<p>Ipsum</p>
			<p>Ipsum</p>
		  </div>
		  <div>
			<h1 class="font-bold">About</h1>
			<p>Ipsum</p>
			<p>Ipsum</p>
		  </div>
		  <div>
			<h1 class="font-bold">Check us out</h1>
			<p>Ipsum</p>
			<p>Ipsum</p>
		  </div>
		</div>
	  </div>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
  </style>