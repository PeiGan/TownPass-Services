<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import type { Spot } from '@/views/SurroundingServiceView.vue';
import type { Place } from '../molecules/FindPlace.vue';

const props = defineProps<{
  selectedSearchData: Place;
  selectedSpot: Spot;
}>();
const emit = defineEmits(['update:isExpandDetail']);
</script>

<template>
  <div class="pb-8 h-screen flex flex-col bg-grey-50">
    <div class="p-5 bg-white mb-4">
      <!-- title -->
      <div class="flex items-center mb-2">
        <img
          src="@/assets/images/down-icon.svg"
          class="rotate-90 mr-2"
          @click="emit('update:isExpandDetail', false)"
          alt=""
        />
        <span class="font-bold text-xl">{{ selectedSpot.name }}</span>
      </div>
      <p class="text-grey-500 text-sm">{{ selectedSpot.agency }}</p>
      <!-- custom template -->
      <div class="flex text-grey-500 mb-2">
        <span>{{ selectedSpot.distance }}公里</span>
        <span class="mx-2">|</span>
        <span class="mx-2">還剩{{ selectedSpot.quantity }}份</span>
        <span class="mx-2">|</span>
        <span class="flex">
          <template v-if="selectedSpot.quantity >= 10">
            <img src="/public/images/map/youbike/icon-info-ubike-green.svg" alt="" />
            <span class="ml-1 text-[#76A732]">{{ selectedSpot.quantity }}人正在前往</span>
          </template>
          <template v-if="selectedSpot.quantity >= 5 && selectedSpot.quantity < 10">
            <img src="/public/images/map/youbike/icon-info-ubike-yellow.svg" alt="" />
            <span class="ml-1 text-secondary-500">{{ selectedSpot.quantity }}人正在前往</span>
          </template>
          <template v-if="selectedSpot.quantity < 5">
            <img src="/public/images/map/youbike/icon-info-ubike-red.svg" alt="" />
            <span class="ml-1 text-[#E5464B]">{{ selectedSpot.quantity }}人正在前往</span>
          </template>
        </span>
        <!-- <span class="mx-2">|</span>
        <span>
          <span class="text-grey-500 mr-1">可借</span>
          <span
            class="mr-1"
            :class="
              selectedSpot.available_rent_bikes === 0 ? 'text-secondary-500' : 'text-[#76A732]'
            "
          >
            {{ selectedSpot.available_rent_bikes }}
          </span>
          <span class="text-grey-500 mr-1">可停</span>
          <span
            :class="
              selectedSpot.available_return_bikes === 0 ? 'text-[#E5464B]' : 'text-grey-950'
            "
          >
            {{ selectedSpot.available_return_bikes }}
          </span>
        </span> -->
      </div>
      <!-- address -->
      <div class="flex mb-2">
        <img src="@/assets/images/icon-geo.svg" alt="" />
        <span class="underline">{{ selectedSpot.address }}</span>
      </div>
    </div>
    <div class="p-5 bg-white">
      <p class="text-grey-500 mb-2">服務資訊</p>
      <!-- custom template -->
      <div>
        <span>食物類別：{{ selectedSpot.category }}</span>
      </div>
      <div>
        <span>飲食忌口：{{ selectedSpot.diet }}</span>
      </div>
      <div>
        <span>開始時間：{{ selectedSpot.createdAt }}</span>
      </div>
      <div>
        <span>更新時間：{{ selectedSpot.updatedAt }}</span>
      </div>
      <div>
        <img :src="selectedSpot.photo" style="width:100%;"/>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
