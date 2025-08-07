<script setup>
import { ref } from "vue";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();

let login = ref("");
let password = ref("");
let mail = ref("");
let promo = ref("");
let logdata = ref(true);
let logpromo = ref(true);
let logged = ref(false);
let balanse = ref(100);
const response = await $fetch("https://randomuser.me/api")
function reg() {
  if (login.value === "" || password.value === "" || mail.value === "") {
    logdata.value = false;
  } else {
    logdata.value = true;
  }

  if (promo.value === "GoodLuck") {
    logpromo.value = true;
    if (logdata.value) {
      balanse.value += 1000;
    }
  } else if (promo.value === "") {
    logpromo.value = true;
  } else {
    logpromo.value = false;
  }

  if (logdata.value && logpromo.value) {
    logged.value = true;
    createAccount();
  } else {
    logged.value = false;
  }
}

async function createAccount() {
  await $fetch("/api/users", {
    method: "post",
    body: {
      login: login.value,
      password: password.value,
      mail: mail.value,
      balanse: balanse.value,
      bitbalanse: 0,
      icon: response.results[0].picture.large,
      logged: userStore.logged,
      user_id: userStore?.user?._id ?? null
    },
  });
  login.value = "";
  password.value = "";
  mail.value = "";
  promo.value = "";
  balanse.value = 100;
  userStore.checkActive()
}
</script>
<template>

  <section class="flex justify-center">
    <div class="text-gray-200 text-7xl text-center max-w-[1200px]">
      Let's start
      <span class="text-orange-350">trading</span>
      cryptocurrencies
      with <span class="text-orange-350">low</span>
      commissions
      <span class="text-orange-350">right today!</span>

      <div class="bg-gray-100 rounded-[30px] px-3 py-5 mt-5 text-gray-700">
        <p>Create your first account!</p>
        <input v-model="login" type="text" class="input" placeholder="Login" />
        <input v-model="password" type="text" class="input" placeholder="Password" />
        <input v-model="mail" type="text" class="input" placeholder="E-mail" />
        <p v-if="!logdata" class="error_text">Please, enter all data</p>
        <input v-model="promo" type="text" class="input" placeholder="Promocode" />
        <p v-if="!logpromo" class="error_text">Hmm, promo wasn't founded</p>
        <button class="transition-all border border-black hover:bg-orange-350 hover:scale-105 px-3 py-2 rounded-full my-3"
          @click="reg">Registration</button>
        <p class="success_text" v-if="logged">
          Great! The account has been created and logined!
        </p>
        <p class="text-2xl text-gray-300">
          ! Special promotion only for you: $1000, when you activate the
          “GoodLuck” promocode today only!
        </p>
      </div>
    </div>
  </section>
</template>

