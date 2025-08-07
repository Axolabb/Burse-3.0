<script setup>
// definePageMeta({ middleware: ["check"] }); 
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const userData = computed(() => userStore.user || {}); // Данные пользователя
let activeId = computed(() => userData.value._id || "");
let balanse = computed(() => userData.value.balanse || 0); // Баланс в долларах
let bitbalanse = computed(() => userData.value.bitbalanse || 0); // Баланс в биткоинах
async function costGetting() {
  let response = await $fetch("/api/users/burseGet");
  costs.value = response;
  actual1.value = response[response.length - 1].actual1;
}
const track = ref(null)
const trackHorizontalPiece = ref(20)
const trackVericalPiece = ref(20)
onMounted(() => {
  costGetting();
  setInterval(costGetting, 2000);

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
let actual1 = ref(450); // Стартовая цена
// Покупка и продажа
let range = ref(1); // Количество
let tm = ref(false); // Избыток
let tf = ref(false); // Недостаток

function buy() {
  let bn = balanse.value;
  let bbn = bitbalanse.value;
  const r = range.value;
  const a = actual1.value;

  let totalCost = a * r;

  if (totalCost <= bn) {
    bn -= totalCost - actual1.value / 10;

    bbn += parseFloat(range.value);

    tf.value = false;
    tm.value = false;
    $fetch("/api/users/bidding", {
      method: "patch",
      body: {
        balanse: bn,
        bitbalanse: bbn,
      },
    });
    userStore.bidding(bn, bbn);
  } else {
    tm.value = true;
    return;
  }
}

function sell() {
  const r = range.value;
  let bn = balanse.value;
  let bbn = bitbalanse.value;

  if (r <= bbn) {
    let revenue = actual1.value * range.value;
    bn += revenue - actual1.value / 10;

    bbn -= parseFloat(range.value);

    tf.value = false;
    tm.value = false;
    $fetch("/api/users/bidding", {
      method: "patch",
      body: {
        balanse: bn,
        bitbalanse: bbn,
      },
    });
    userStore.bidding(bn, bbn);
  } else {
    tf.value = true;
  }
}

</script>
<template>
  <div class="flex justify-center">
    <p class="default_text ">Course of Ⓛ-coin! <span class="text-yellow-200">Ⓛ-coin = {{
      actual1
        }}$ </span> </p>
  </div>
  <div class="px-20 h-[80vh] flex  justify-around items-center">
    <div class="max-w-80 flex-column w-full">
      <div class="text-3xl text-gray-200 ">
        <p :class="[tm === true ? 'text-red-500' : '']">Balanse: {{ balanse.toFixed(2) }}<span
            class="text-green-300">$</span></p>
        <p :class="[tf === true ? 'text-red-500 ' : '']">BitBalanse: {{
          bitbalanse
        }}<span class="text-yellow-200"> Ⓛ-coins</span> </p>
      </div>
      <div class="flex flex-column gap-2 text-4xl">
        <p class="text-gray-200 text-2xl">Input a quantity of <span class="text-yellow-200 ">Ⓛ-coins </span>to <span
            class="text-green-300 text-2xl">buy</span><span class="text-yellow-200">/</span><span
            class="text-red-400">sell</span></p>
        <input type="number" class="rounded bg-gray-200 py-1 px-3 text-gray-800" v-model="range" min="1"
          placeholder="Ⓛ-coins">
        <a class="bg-green-400 rounded py-1 px-3 text-gray-800 cursor-pointer no-underline hover:scale-105 transition-all hover:bg-green-500 hover:text-gray-200"
          @click="buy">Buy {{ range }} Ⓛ =
          {{ (range * actual1 + actual1 / 10).toFixed(2) }}$</a>
        <a class="bg-red-400 rounded py-1 px-3 text-gray-800 cursor-pointer no-underline hover:scale-105 transition-all hover:bg-red-500 hover:text-gray-200"
          @click="sell">Sell {{ range }} Ⓛ =
          {{ (range * actual1 - actual1 / 10).toFixed(2) }}$</a>
        <span class="text-xl text-gray-800 ">Fee - 10% of the purchase amount</span>
      </div>
    </div>

    <div ref="track" class="max-w-[1000px]  relative h-full w-full border border-white flex items-end pt-[100px]  ">  
      <div class="absolute flex flex-col-reverse w-full opacity-10 ">  
        <div class=" text-left z-100 border-top border-white  bg-red-500"  v-for="i in Math.ceil(actual1/10)+3"  
        :style="{ height: 25*trackVericalPiece + 'px' }"><span class="text-white text-4xl pl-3"> {{ i*25 }} $</span></div> 
      </div>
      <div class="relative shrink-0  border" v-for="cost in costs" :class="[cost.color === 'red' ? 'scale-y-[-1]' : '']"
        :style="{
          bottom: cost.bottom*trackVericalPiece + 'px',
          height: cost.costTOB*trackVericalPiece + 'px',
          width: trackHorizontalPiece + 'px'
        }">
        <div class="origin-bottom-left w-px left-0 bottom-0 absolute z-[1]" :style="{
          'background-color': cost.color,
          height: Math.sqrt(Math.pow(cost.costTOB*trackVericalPiece, 2) + Math.pow(trackHorizontalPiece, 2)) + 'px',
          transform: 'rotate(' + ((Math.atan2(trackHorizontalPiece/trackVericalPiece, cost.costTOB)) * (180 / Math.PI)) + 'deg)',
        }"></div>
        <div class="w-px h-px  absolute right-0 top-0 z-[10] "
          :class="[cost.color === 'red' ? 'bg-red-300' : 'bg-green-300']"></div>
      </div>
      <span class="absolute text-right bg-white w-[100%] h-px w-100 transition-all z-100"  
        :style="{ bottom: actual1*trackVericalPiece + 'px' }"><span class="relative top-[-4vh] text-white text-4xl ">{{ actual1
        }}$</span></span>
    </div>
  </div>
</template>
