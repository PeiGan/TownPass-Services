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
import defineComponent from 'vue';
import type { User } from '@/stores/user';

const activeStep = ref(1);
let editIndex = ref<number | null>(null);

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};

useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);

// 初始活動列表，包含表單的所有字段，包括圖片

//const data = await fetch('http://localhost:3000/getbyuserid',{ userid: user?.value.id });
//const activities = ref(await data.json());

const activities = ref([]);

onMounted( async () => {
  const userid = (user.value? user.value.id : "");
  await axios.post('http://localhost:3000/getbyuserid', { userid: userid }).then((response) => {
    activities.value = response.data;
  });
});

/*
const activities = ref([
   { name: '活動1', category: '食物', diet: '葷', address: '地址1', quantity: 1, notes: '備註1', photo: '圖片URL1' },
   { name: '活動2', category: '飲料', diet: '素', address: '地址2', quantity: 2, notes: '備註2', photo: '圖片URL2' }
]);
*/

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
  console.log(index);
  editIndex.value = index;
  activeStep.value = 3;
};



const handleClick = async (index: number, data) => {
  console.log(data._id);
  navigateToEditForm(index);
};

// 取消按鈕回到活動列表
const onModify = () => {
  activeStep.value = 1;
};

// 確認按鈕新增或修改活動並回到列表
const onConfirm = (newActivity: { _id: string; name: string; participants: number; info: string; category: string; diet: string; address: string; quantity: number; notes: string; photo: string }) => {
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
      <section
        class="fixed top-0 left-0 z-10 w-screen bg-grey-50 px-4 pt-5 pb-4 flex justify-between"
      >
        <span class="font-bold text-xl mt-4">餐食列表</span>
      </section>
      <ul class="mt-20">
        <li
          v-for="(activity, index) in activities"
          :key="index"
          class="flex items-center justify-between p-4 bg-white shadow-sm mb-2 rounded"
        >
          <!-- 照片在左側 -->
          <div class="mr-4">
            <img
              v-if="activity.photo"
              :src="activity.photo"
              class="w-24 h-24 object-cover rounded-md"
            />
          </div>

          <!-- 右側文字內容 -->
          <ul class="flex flex-col gap-y-2 flex-1">
            <!-- 活動名稱 -->
            <li class="font-bold text-2xl">{{ activity.name }}</li>

            <!-- 地址 -->
            <li class="flex items-center">
              <img src="@/assets/images/icon-geo.svg" class="w-5 h-5 mr-2" />
              <p class="underline">{{ activity.address }}</p>
            </li>

            <!-- 分成三個區塊的資訊 (類別、葷素、份數) -->
            <li class="grid grid-cols-3 gap-x-4">
              <span>類別: {{ activity.category }}</span>
              <span>葷/素: {{ activity.diet }}</span>
              <span>份數: {{ activity.quantity }}</span>
            </li>

            <!-- 備註移到最下面，並確保長文本會使用省略號 -->
            <li
              class="text-gray-500 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            >
              備註: {{ activity.notes }}
            </li>
          </ul>

          <!-- 修改和刪除按鈕 -->
          <div class="flex flex-col items-center justify-center">
            <BaseButton @click="navigateToEditForm(index)" class="mb-2">修改</BaseButton>
            <BaseButton outline @click="removeActivity(index)" class="mt-2">刪除</BaseButton>
          </div>
        </li>
      </ul>
      <!-- 分隔線 -->
      <div class="bottom-16 left-0 z-10 w-full h-2 bg-grey-50 my-4"></div>
      <div class="bottom-0 left-0 z-5 w-full bg-white px-2 py-2" style="height: 5rem">
        <!-- 新增活動按鈕 -->
        <div class="flex w-full gap-x-4">
          <BaseButton outline @click="$router.push({ path: '/ourmap' })" class="w-1/2">
            返回地圖
          </BaseButton>
          <BaseButton @click="navigateToCreateForm" class="w-1/2">新增活動</BaseButton>
        </div>
      </div>
    </form>

    <!-- 新增活動頁面 -->
    <div v-if="activeStep === 2">
      <NewActivity @onModify="onModify" @onConfirm="onConfirm" />
    </div>

    <!-- 修改活動頁面 -->
    <div v-if="activeStep === 3">
      <ModifyActivity
        v-if="editIndex !== null"
        :submitForm="activities[editIndex]"
        @onModify="onModify"
        @onConfirm="onConfirm"
      />
    </div>
  </div>
</template>