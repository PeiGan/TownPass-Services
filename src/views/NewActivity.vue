<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

const emit = defineEmits(['onModify', 'onConfirm']);

const name = ref('');
const participants = ref(0);
const info = ref('');

const onCancelClick = () => {
  emit('onModify');
};

const onConfirmClick = () => {
  if (name.value && participants.value > 0) {
    emit('onConfirm', { name: name.value, participants: participants.value, info: info.value });
  }
};
</script>

<template>
  <section>
    <section class="bg-grey-50 px-4 pt-5 pb-4">
      <h1 class="font-bold text-xl mt-4">新增活動</h1>
    </section>
    <ul class="px-4 py-2 flex flex-col gap-y-4">
      <li>
        <label for="name">活動名稱</label>
        <input id="name" v-model="name" type="text" class="border p-2 w-full" />
      </li>
      <li>
        <label for="participants">參加人數</label>
        <input id="participants" v-model="participants" type="number" class="border p-2 w-full" />
      </li>
      <li>
        <label for="info">額外資訊</label>
        <input id="info" v-model="info" type="text" class="border p-2 w-full" />
      </li>
    </ul>

    <div class="grid grid-cols-2 gap-x-2 px-4 mt-4">
      <!-- 取消按鈕 -->
      <BaseButton outline @click="onCancelClick">取消</BaseButton>
      <!-- 確認按鈕 -->
      <BaseButton @click="onConfirmClick">確認</BaseButton>
    </div>
  </section>
</template>
