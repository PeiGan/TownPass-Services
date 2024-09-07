<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
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

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};

useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);


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
