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
import Form from '@/components/molecules/Form.vue';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};

useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);

const emit = defineEmits(['onModify', 'onConfirm']);

const formData = ref({}); // Hold form data

const userid = (user.value?user.value.id:"default_user_id");

const onFormSubmit = async (submittedData: any) => {
  formData.value = submittedData;
  if (formData.value.name && formData.value.quantity > 0) {
    var send_body = {
      id: "",
      userid: userid,
      name: formData.value.name,
      category: formData.value.category,
      diet: formData.value.diet,
      address: formData.value.address,
      quantity: formData.value.quantity,
      notes: formData.value.notes,
      photo: formData.value.photo,
    }
    console.log(send_body);
    const response = await axios.post("http://localhost:3000/insertfood", send_body);
    emit('onConfirm', formData.value);
  } else {
    console.log('表單資料不完整或不合法');
  }
};

const onCancelClick = () => {
  console.log('取消操作');
  emit('onModify');
};
</script>

<template>
  <section>
    <section class="bg-grey-50 px-4 pt-5 pb-4">
      <h1 class="font-bold text-xl mt-4">新增餐食</h1>
    </section>

    <!-- Listen to the form submit and cancel events -->
    <Form @onFormSubmit="onFormSubmit" @onCancel="onCancelClick" />
  </section>
</template>