import { defineStore } from "pinia";
import dayjs from "dayjs";

export const useUserStore = defineStore("user", {
  state: () => ({
    logged: false,
    user: null,
  }),
  actions: {
    async checkActive() {
      try {
        const response:any = await $fetch("/api/users/isRegged", {
          query: { isregged: true },
        });
        if (response) {
          const { createdAt, ...data } = response;
          const formattedDate = dayjs(createdAt).format("YYYY.MM.DD");
          this.logged = true;
          this.user = { ...data, createdAt: formattedDate };
          console.log('Пользователь найден');
        } else {
          this.logged = false;
          this.user = null;
          console.log('Пользователь не найден');

        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
      return this.user;
    },
    bidding(balanse:Number, bitbalanse:Number) {
      this.user.balanse = balanse;
      this.user.bitbalanse = bitbalanse;
    }
  },
});
