<main>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
<style>
  #menu-toggle:checked + #menu {
    display:block;
  }
</style>
<div class="flex-1">
  <!-- NAVBAR -->
  <div class="lg:px-6 py-2 my-2 px-4 border-b-2 border-gray-600 flex justify-between">
    <div>
      <img width="50px" height="50px" src="https://logos-download.com/wp-content/uploads/2016/11/EA_logo_black.png" />
      <!-- show this section if theey click on the hamburger-->
      <div class="pt-3 hidden" id="menu">
        <nav class="cursor-pointer">
          <ul>
            <li class="border-transparent border-b-2 hover:border-gray-600">About</li>
            <li class="border-transparent border-b-2 hover:border-gray-600">Resume</li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="inline lg:hidden mt-1 ml-2">
      <label for="menu-toggle"><i class="fa fa-bars fa-lg cursor-pointer"> </i></label>
    </div>
    <input type="checkbox" id="menu-toggle" class="mt-4 hidden" />

    <div class="lg:inline lg:float-right hidden">
      <p class="px-2 border-transparent border-b-2 hover:border-teal-600 focus:outline-none outline-none">About</p>
      <p class="px-2 border-transparent border-b-2 hover:border-teal-600 focus:outline-none outline-none">Resume</p>
    </div>
  </div>
</div>
</main>