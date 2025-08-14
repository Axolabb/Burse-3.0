<script setup>
import { definePageMeta } from '#imports'
// definePageMeta({ middleware: ["check"] }); 
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const userData = computed(() => userStore.user || {}); // Данные пользователя
let balanse = computed(() => userData.value.balanse || 0); // Баланс в долларах
let bitbalanse = computed(() => userData.value.bitbalanse || 0); // Баланс в биткоинах
async function costGetting() {
  let response = await $fetch("/api/users/burseGet");
  costs.value = response;
  actual.value = response[response.length - 1].actual;
}
const track = ref(null)
const trackHorizontalPiece = ref(20)
const trackVericalPiece = ref(20)

const tickTime = 2000

onMounted(() => {
  costGetting();
  setInterval(costGetting, tickTime);

  const TrackWatcher = new ResizeObserver(() => {
    let widthRaw = getComputedStyle(track.value).width
    let heightRaw = getComputedStyle(track.value).height
    let widthClear = parseFloat(widthRaw.replace(/[^\d.-]/g, '')) / 50
    let heightClear = parseFloat(heightRaw.replace(/[^\d.-]/g, '')) / 100
    trackHorizontalPiece.value = widthClear
    trackVericalPiece.value = heightClear
  })
  TrackWatcher.observe(track.value)
});


// Стартовые данные
let costs = ref([]); // Данные о ценах
let actual = ref(450); // Стартовая цена
// Покупка и продажа
let range = ref(1); // Количество
let tm = ref(false); // Избыток
let tf = ref(false); // Недостаток

function buy() {
  let bn = balanse.value;
  let bbn = bitbalanse.value;
  const r = range.value;
  const a = actual.value;

  let totalCost = a * r;

  if (totalCost <= bn && r !== '') {
    bn -= totalCost + totalCost / 10;

    bbn += parseFloat(range.value);

    tf.value = false;
    tm.value = false;
    $fetch("/api/users/bidding", {
      method: "patch",
      body: {
        balanse: bn,
        bitbalanse: bbn,
        user_id: userStore?.user?._id ?? null

      },
    });
    userStore.bidding(bn, bbn);
  } else {
    tm.value = true;
    setTimeout(() => {
      tm.value = false;
    }, 3000);
    return;
  }
}

function sell() {
  const r = range.value;
  let bn = balanse.value;
  let bbn = bitbalanse.value;

  if (r <= bbn && r !== '') {
    let revenue = actual.value * range.value;
    bn += revenue - revenue / 10;

    bbn -= parseFloat(range.value);

    tf.value = false;
    tm.value = false;
    $fetch("/api/users/bidding", {
      method: "patch",
      body: {
        balanse: bn,
        bitbalanse: bbn,
        user_id: userStore?.user?._id ?? null

      },
    });
    userStore.bidding(bn, bbn);
  } else {
    tf.value = true;
    setTimeout(() => {
      tf.value = false;
    }, 3000);
  }
}

let events = ref([])
// function getRandomTime() {
//   const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0')
//   const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0')
//   return `${hours}:${minutes}`
// }
const news_active = ref(false)
const news_notice_active = ref(false)
const predict_active = ref(false)
const socket = ref(null)
const lastNew = ref(null)

function predict(cost) {
  let bn = balanse.value
  cost = Number(cost)
  if (bn >= cost) {
    console.log(bn, cost)
    predict_active.value = true
    setTimeout(() => {
      predict_active.value = false
      // добавить функцию чтобы херь убиралась если в predict Array ничего нет
    }, tickTime * 5);
    $fetch("/api/users/bidding", {
      method: "patch",
      body: {
        balanse: bn - cost,
        bitbalanse: bitbalanse.value,
        user_id: userStore?.user?._id ?? null
      },
    });
    userStore.bidding(bn - cost, bitbalanse.value);
  } else {
    tm.value = true;
    setTimeout(() => {
      tm.value = false;
    }, 3000);
  }
}

onMounted(() => {

  setInterval(() => {
    if (lastNew.value) {
      // let sex = getComputedStyle(lastNew.value).height
      console.log(lastNew.value)
      // Сделать систему плавного появления события и потом перейти к AI

    }
  }, 1000);
  if (sessionStorage.getItem('events')) {
    events.value = JSON.parse(sessionStorage.getItem('events'))
  }
  socket.value = new WebSocket('ws://localhost:8080')
  socket.value.onopen = () => {
    console.log('Соединение установлено')
    // socket.value.send('Привет, сервер!')
  }

  socket.value.onmessage = (event) => {
    if (events.value.length >= 10) {
      events.value.shift()
    }
    events.value.push(JSON.parse(event.data))
    news_notice_active.value = true
    sessionStorage.setItem('events', JSON.stringify(events.value))
  }

  socket.value.onclose = () => {
    console.log('Соединение закрыто')
  }
})
</script>
<template>
  <div class="flex justify-center">
    <p class="default_text ">Course of Ⓛ-coin! <span class="text-yellow-200">Ⓛ-coin = {{
      actual
    }} $ </span> </p>
  </div>
  <div class="px-20 h-[80vh] flex  justify-around items-center relative overflow-x-hidden">

    <div class="overflow-hidden border relative border-white max-w-[1000px] h-full w-full">

      <div ref="track" class="relative h-full w-full flex items-end transition-all right-0"
        :class="[predict_active === true ? 'right-[20%] ' : '']"
        :style="{ top: Math.floor(actual / 100) * trackVericalPiece * 100 + 'px' }">
        <div class="absolute w-full opacity-10 transition-all right-0"
          :class="[predict_active === true ? 'right-[-20%]' : '']">
          <div class="absolute w-full h-full text-left  z-100 border-b-4 border-dashed border-gray-300 "
            v-for="i in Math.ceil(actual / 10) + 4" :style="{ bottom: i * 20 * trackVericalPiece + 'px' }"><span
              class="text-white  text-4xl bg-[#1b1b1b] relative  top-[-1.25rem]  px-3 select-none "> {{ i * 20
              }}$</span>
          </div>
        </div>
        <div class="absolute flex flex-row-reverse w-full h-full opacity-10"
          :style="{ bottom: Math.floor(actual / 100) * trackVericalPiece * 100 + 'px' }">
          <div class="w-1/5 items-end justify-end z-100 flex border-r-4 border-dashed border-gray-300" v-for="i in 5">
            <span class="text-white text-4xl relative bg-[#1b1b1b] pb-3"
              :class="[i == 1 ? 'right-[1rem]' : 'right-[-4.5rem]']"> {{ i == 1 ? 'now' : `-${(i - 1) * 10} ticks`
              }}</span>
          </div>
          <div
            class="w-1/5 right-[-20%] pr-3 h-full absolute items-end justify-end z-100 flex border-r-4 border-dashed border-gray-300">
            <span class="text-white text-4xl relative bg-[#1b1b1b] pb-3">+10 ticks</span>
          </div>
        </div>

        <div class="relative overflow-visible " v-for="cost in costs" :style="{
          bottom: cost.bottom * trackVericalPiece + 'px',
          height: cost.costTOB * trackVericalPiece + 'px',
          width: trackHorizontalPiece + 'px'
        }">

          <svg :class="[cost.color === 'red' ? 'scale-y-[-1]' : '']"
            :viewBox="`0 0 ${trackHorizontalPiece} ${cost.costTOB * trackVericalPiece}`" :width="trackHorizontalPiece"
            :height="cost.costTOB * trackVericalPiece" class="absolute left-0 bottom-0 z-[0]">
            <line stroke-linecap="square" x1="0" :y1="cost.costTOB * trackVericalPiece" :x2="trackHorizontalPiece"
              y2="0" :stroke="cost.color" stroke-width="2" />
          </svg>


          <div class="w-[5px] rounded-full h-[5px]  absolute right-[-2.5px] z-[100] border border-white"
            :class="[cost.color === 'green' ? 'bg-green-300 top-[-2.5px]' : 'bg-red-300 bottom-[-2.5px]']"></div>
        </div>

        <div class="w-full text-right absolute border-b transition-all z-[9999]"
          :style="{ bottom: actual * trackVericalPiece + 'px' }"><span class="text-white text-4xl mr-3 ">{{ actual
          }}$</span></div>
      </div>
    </div>
    <div class="max-w-96 flex-column w-full">
      <div class="text-3xl text-gray-200 ">
        <p :class="[tm === true ? 'text-red-500' : '']">Balanse: {{ balanse.toFixed(2) }}<span
            class="text-green-300">$</span></p>
        <p :class="[tf === true ? 'text-red-500 ' : '']">BitBalanse: {{
          bitbalanse
        }}<span class="text-yellow-200"> Ⓛ-coins</span> </p>
      </div>
      <div class="flex flex-column  gap-2 text-4xl">
        <p class="text-gray-200 text-2xl">Input a quantity of <span class="text-yellow-200 ">Ⓛ-coins </span>to <span
            class="text-green-300 text-2xl">buy</span><span class="text-yellow-200">/</span><span
            class="text-red-400">sell</span></p>
        <input type="number" class="rounded bg-gray-200 py-1 px-3 text-gray-800" v-model="range" min="1"
          placeholder="Ⓛ-coins"
          @keydown="(array) => { if (!/^[0-9]$/.test(array.key) && array.key !== 'Backspace') { array.preventDefault() } }">
        <a class="bg-green-400 rounded py-1 px-3 text-gray-800 cursor-pointer no-underline hover:scale-105 transition-all hover:bg-green-500 hover:text-gray-200"
          @click="buy">Buy {{ range }} Ⓛ =
          {{ (range * actual + actual * range / 10).toFixed(2) }}$</a>
        <a class="bg-red-400 rounded py-1 px-3 text-gray-800 cursor-pointer no-underline hover:scale-105 transition-all hover:bg-red-500 hover:text-gray-200"
          @click="sell">Sell {{ range }} Ⓛ =
          {{ (range * actual - actual * range / 10).toFixed(2) }}$</a>
        <a class="bg-yellow-300 rounded py-1 px-3 text-gray-800 cursor-pointer no-underline hover:scale-105 transition-all hover:bg-yellow-400 "
          @click="predict(balanse < 1500 ? 1500 : (1500 + balanse / 10).toFixed(2))">Buy a predict - {{ balanse < 1500 ?
            1500 : (1500 + balanse / 10).toFixed(2) }}$</a>
            <span class="text-xl text-gray-800 ">Fee - 10% of the purchase amount</span>
      </div>
    </div>
    <div class="absolute  flex right-[-30vw] top-0 h-full transition-all"
      :class="[news_active === true ? 'right-[0]' : 'right-[-30vw]']"><span
        class="text-4xl bg-gray-200 h-fit rounded-l-full cursor-pointer relative right-[-2rem] pr-10 py-3 pl-3 mt-3 select-none"
        @click="() => { news_active = !news_active; news_notice_active = false }">News <span
          class="bg-red-500 w-2 h-2 absolute rounded-full opacity-0 transition-all"
          :class="[!news_active && news_notice_active ? 'opacity-100' : '']"></span></span>
      <div class="bg-gray-200 overflow-y-auto box-border max-h-[80vh] rounded p-3 z-10 max-w-[30vw] min-w-[30vw]">
        <div class="justify-end flex  flex-col-reverse transition-all">
          <div class="border-b-4 min-h-[20vh] border-dashed border-gray-300 mt-3 relative " v-for="(event, i) in events"
            :ref="events.length - 1 === i ? 'lastNew' : null">
            <p class="text-2xl bold">{{ event.name }}</p>
            <p class="text-xl">{{ event.text }}</p>
            <p class="text-xl text-right">{{ events.length - 1 === i ? 'now' : event.time }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>