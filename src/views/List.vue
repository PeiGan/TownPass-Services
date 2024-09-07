<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import NewActivity from '@/views/NewActivity.vue';
import ModifyActivity from '@/views/ModifyActivity.vue';
import FindPlace, { type Place } from '@/components/molecules/FindPlace.vue';
import SpotList from '@/components/organisms/SpotListView.vue';
import SpotDetail from '@/components/organisms/SpotDetailView.vue';
import MessageModal from '@/components/molecules/MessageModal.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { onMounted, watch } from 'vue';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import greenDotIconUrl from '/public/images/map/youbike/mappin-green.svg';
import defaultFocusIconUrl from '/public/images/map/icon_mappin-garbagetruck-green-pressed.svg';
import { mappingFormatter, getNestedValue } from '@/utils/spot-formatter';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useFormStore } from '@/stores/form';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useConnectionMessage } from '@/composables/useConnectionMessage';
import { useHandleConnectionData } from '@/composables/useHandleConnectionData';
import ServiceTabsView from '@/components/organisms/ServiceTabsView.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import serviceListJson from '../../public/mock/service_list.json';
import caseProgressJson from '../../public/mock/case_progress.json';
import type { User } from '@/stores/user';

const activeStep = ref(1);
let editIndex = ref<number | null>(null);

// 初始活動列表，包含表單的所有字段，包括圖片
const activities = ref([
  { name: '活動1', participants: 20, info: '額外資訊1', category: '食物', diet: '葷', address: '地址1', quantity: 1, notes: '備註1', photo: '圖片URL1' },
  { name: '活動2', participants: 30, info: '額外資訊2', category: '飲料', diet: '素', address: '地址2', quantity: 2, notes: '備註2', photo: '圖片URL2' }
]);

// 刪除活動
const removeActivity = (index: number) => {
  activities.value.splice(index, 1);
};

// 跳轉到新增活動的表單頁面
const navigateToCreateForm = () => {
  editIndex.value = null;
  activeStep.value = 2;
};

// 跳轉到修改活動的表單頁面
const navigateToEditForm = (index: number) => {
  editIndex.value = index;
  activeStep.value = 3;
};

// 取消按鈕回到活動列表
const onModify = () => {
  activeStep.value = 1;
};

// 確認按鈕新增或修改活動並回到列表
const onConfirm = (newActivity: { name: string; participants: number; info: string; category: string; diet: string; address: string; quantity: number; notes: string; photo: string }) => {
  if (editIndex.value !== null) {
    activities.value[editIndex.value] = newActivity;
  } else {
    activities.value.push(newActivity);
  }
  activeStep.value = 1; // 回到第一頁
};
</script>

<template>
  <div class="pb-8">
    <!-- 活動列表展示區 -->
    <form v-show="activeStep === 1" @submit.stop="">
      <section class="fixed top-0 left-0 z-10 w-screen bg-grey-50 px-4 pt-5 pb-4 flex justify-between">
        <span class="font-bold text-xl mt-4">活動列表</span>
      </section>
      <ul class="mt-4">
        <li v-for="(activity, index) in activities" :key="index"
          class="flex items-start justify-between p-4 bg-white shadow-sm mb-2 rounded">
          <div>
            <h3 class="text-lg font-semibold">{{ activity.name }}</h3>
            <p>參加人數: {{ activity.participants }}</p>
            <p>類別: {{ activity.category }}</p>
            <p>葷/素: {{ activity.diet }}</p>
            <p>地址: {{ activity.address }}</p>
            <p>份數: {{ activity.quantity }}</p>
            <p>備註: {{ activity.notes }}</p>
            <p>額外資訊: {{ activity.info }}</p>
            <div v-if="activity.photo">
              <p>照片:</p>
              <img :src="activity.photo" alt="活動照片" class="w-32 h-32 object-cover rounded-md">
            </div>
          </div>
          <div class="flex flex-col items-end">
            <BaseButton outline @click="navigateToEditForm(index)" class="mr-2">修改</BaseButton>
            <BaseButton @click="removeActivity(index)">刪除</BaseButton>
          </div>
        </li>
      </ul>
      <!-- 分隔線 -->
      <div class="w-full h-2 bg-grey-50 my-4"></div>
      <!-- 新增活動按鈕 -->
      <div class="grid grid-cols-2 gap-x-2 px-2">
        <BaseButton outline @click="$router.push({ path: '/ourmap' })">返回地圖</BaseButton>
        <BaseButton @click="navigateToCreateForm">新增活動</BaseButton>
      </div>
    </form>

    <!-- 新增活動頁面 -->
    <div v-if="activeStep === 2">
      <NewActivity @onModify="onModify" @onConfirm="onConfirm" />
    </div>

    <!-- 修改活動頁面 -->
    <div v-if="activeStep === 3">
      <ModifyActivity :submitForm="activities[editIndex]" @onModify="onModify" @onConfirm="onConfirm" />
    </div>
  </div>
</template>