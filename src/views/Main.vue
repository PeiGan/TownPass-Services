<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import NewActivity from '@/views/NewActivity.vue';
import ModifyActivity from '@/views/ModifyActivity.vue';

const activeStep = ref(1);
let editIndex = ref<number | null>(null);

// 初始活動列表，包含活動名稱、參加人數、額外資訊
const activities = ref([
  { name: '活動1', participants: 20, info: '額外資訊1' },
  { name: '活動2', participants: 30, info: '額外資訊2' },
  { name: '活動3', participants: 10, info: '額外資訊3' }
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
const onConfirm = (newActivity: { name: string; participants: number; info: string }) => {
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
      <section class="bg-grey-50 px-4 pt-5 pb-4">
        <h1 class="font-bold text-xl mt-4">活動列表</h1>
      </section>
      <ul class="mt-4">
        <li v-for="(activity, index) in activities" :key="index"
          class="flex items-center justify-between p-2 bg-white shadow-sm mb-2 rounded">
          <div>
            <h3 class="text-lg font-semibold">{{ activity.name }}</h3>
            <p>參加人數: {{ activity.participants }}</p>
            <p>額外資訊: {{ activity.info }}</p>
          </div>
          <div>
            <BaseButton outline @click="navigateToEditForm(index)" class="mr-2">修改</BaseButton>
            <BaseButton @click="removeActivity(index)">刪除</BaseButton>
          </div>
        </li>
      </ul>
      <!-- 分隔線 -->
      <div class="w-full h-2 bg-grey-50 my-4"></div>
      <!-- 新增活動按鈕 -->
      <div class="grid grid-cols-2 gap-x-2 px-2">
        <BaseButton outline link href="https://external-link.com">上一步</BaseButton>
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
