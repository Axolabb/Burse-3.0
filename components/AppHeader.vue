<template>
  <p class="h-24"></p>
  <div
    class="w-full top-0 fixed bg-gradient-to-b from-[#1b1b1bcc] via-[#1b1b1bcc] via-90%  to-[#8e8e8e00] z-[1] px-20 text-4xl">
    <div class=" flex items-center justify-between ">
      <a href="/" class="text-white no-underline ">
        <div class="flex items-center  ">
          <img src="assets\logov.png" class="h-[10vh] rounded" />
          <span class="header_text ">VueBit</span>
        </div>
      </a>
      <div class="flex gap-5 text-white">
        <a class="header_text " href="/">Home</a>
        <a class="header_text" href="/market">Market</a>
        <a class="header_text" href="/account">Account </a>
      </div>
      <div class="bg-white hover:scale-110 transition-all text-black">
        <a  href="/login" class=" hover:bg-orange-500 text-inherit no-underline transition-all bg-inherit hover:bg-orange-500 hover:text-white  rounded px-3 py-2 ">
          <span class="no-underline text-inherit ">Login </span>
        </a>
      </div>
    </div>
  </div>
</template>


