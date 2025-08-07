<script setup>
import { computed } from "vue";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const userData = computed(() => userStore.user || {});
const _id = computed(() => userData.value._id || "");
const login = computed(() => userData.value.login || "");
const password = computed(() => userData.value.password || "");
const mail = computed(() => userData.value.mail || "");
const balanse = computed(() => userData.value.balanse || 0);
const bitbalanse = computed(() => userData.value.bitbalanse || 0);
const createdAt = computed(() => userData.value.createdAt || "");
const icon = computed(() => userData.value.icon || "");
// definePageMeta({ middleware: ["check"] });
</script>
<template>
  <div class="flex justify-center ">
    <div class="max-w-[1000px] text-gray-300 text-center">
      <p class="text-7xl">
        This is <span class="text-orange-350">your</span> account!
      </p>
      <p class="text-4xl">
        Hello, <span class="text-orange-350">{{ login }}</span>!
      </p>
      <div
        class="p-5 text-gray-500 text-4xl bg-gray-200 flex flex-column items-center mt-5 mb-5 border-[5px] border-gray-300 rounded-[50px]">
        <div class="rounded-full overflow-hidden">
          <img :src="icon" class="h-[200px]" />
        </div>
        <p class="mt-5">Your wallet id: {{ _id }}</p>
        <p>Your login: {{ login }}</p>
        <p>Your password : {{ password }}</p>
        <p>Your mail: {{ mail }}</p>
        <p>Your Balanse: {{ balanse.toFixed(2) }}$</p>
        <p>Your BitBalanse: {{ bitbalanse }} LCoins</p>
        <p>Create date: {{ createdAt }}</p>
      </div>
    </div>
  </div>
</template>
