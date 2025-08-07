<script setup>
import { useUserStore } from "~/stores/user";
import {useState} from '#app'
const userStore = useUserStore();
let login = useState("login", () => "");
let password = useState("password", () => "");
let mail = useState("mail", () => "");
let check = useState("check", () => null);
async function loginning() {
  
  let response = await $fetch("/api/users", {
    method: "patch",
    body: {
      login: login.value,
      password: password.value,
      mail: mail.value,
      isLogged: userStore.logged,
      user_id: userStore?.user?._id ?? null
    },
  });
  if (response == true) {
    check.value = true;
    login.value = "";
    password.value = "";
    mail.value = "";
    userStore.checkActive();
  } else {
    check.value = false;
  }
}


</script>
<template>
  <div class="flex justify-center text-center mb-52">
    <div class="max-w-[1000px] text-gray-200">
      <p class="text-7xl">
        Login to <span class="text-orange-350">your</span> account <br />
        and <span class="text-orange-350">start</span> trading!
      </p>
      <form class="flex flex-column gap-3 mt-5">
        <p class="text-4xl">Login to your account</p>
        <input type="login" class="input text-gray-700" v-model="login" placeholder="Login" />
        <input type="password" class="input text-gray-700" v-model="password" placeholder="Password" />
        <input type="mail" class="input text-gray-700" v-model="mail" placeholder="E-mail" />
        <p class="success_text" v-if="check == true">
          Success!
        </p>
        <p class="error_text" v-if="check == false">
          There is no such account yet!
        </p>
        <div @click="loginning"
          class="text-4xl  border border-white rounded-full px-3 py-1 hover:scale-110 hover:bg-orange-350 transition-all">
          Login</div>
      </form>
    </div>
  </div>
</template>
