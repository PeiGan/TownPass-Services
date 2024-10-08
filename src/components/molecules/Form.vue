<script setup lang="ts">
import { reactive, watch } from 'vue';

import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseUpload from '@/components/atoms/BaseUpload.vue';
import FindPlace, { type Place } from '@/components/molecules/FindPlace.vue';
import SpotList from '@/components/organisms/SpotListView.vue';
import SpotDetail from '@/components/organisms/SpotDetailView.vue';
import MessageModal from '@/components/molecules/MessageModal.vue';
import { useGoogleMapsStore } from '@/stores/googleMaps';
import axios from 'axios';
import { onMounted, ref } from 'vue';
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
import ServiceStep from '@/components/molecules/ServiceStep.vue';
import type { User } from '@/stores/user'

/*const props = withDefaults(defineProps<{
    submitForm: Object,
  }>(),{
  submitForm: null,
});*/

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const handleUserInfo = (event: { data: string }) => {
  const result: { name: string; data: User } = JSON.parse(event.data);

  user.value = result.data;
};

useConnectionMessage('userinfo', null);

useHandleConnectionData(handleUserInfo);

export interface BasicForm {
  userid: string;
  name: string;
  category: string;
  diet: string;
  useCurrentLocation: boolean;
  address: string;
  quantity: number;
  notes: string;
  photo: string;
}

const props = withDefaults(
  defineProps<{
    triggerValidate?: boolean;
  }>(),
  {
    triggerValidate: false
  }
);

const emit = defineEmits(['onFormChange', 'onFormSubmit', 'onCancel']);

const form = reactive<BasicForm>({
  userid: '', 
  name: '',
  category: '',
  diet: '',
  useCurrentLocation: true,
  address: '現在位置',
  quantity: 1,
  notes: '',
  photo: ''
});

watch(
  () => form,
  () => {
    const isValidate = Object.keys(form).every((key) => {
      const value = form[key as keyof BasicForm];

      if (key === 'quantity') {
        return typeof value === 'number' && value > 0;
      }

      if (key === 'photo') {
        return typeof value === 'string' && value.startsWith('data:image');
      }

      if (key === 'useCurrentLocation' && form.useCurrentLocation) {
        return true;
      }

      return !!value;
    });

    emit('onFormChange', {
      isValidate,
      form
    });
  },
  { deep: true }
);

const handleSubmit = () => {
  emit('onFormSubmit', form);
};

const handleCancel = () => {
  emit('onCancel');
};

const categoryOptions = [
  { label: '主食', value: '主餐' },
  { label: '點心', value: '點心' },
  { label: '飲料', value: '飲料' },
  { label: '食材', value: '食材' },
  { label: '其他', value: '其他' }
];

const dietOptions = [
  { label: '葷', value: '葷' },
  { label: '素', value: '素' },
  { label: '蛋奶素', value: '蛋奶素' }
];
</script>

<template>
  <section>
    <div class="py-5 px-4">
      <!-- Form fields as in the original code -->
      <div class="grid grid-rows-[1fr] transition-all">
        <div class="overflow-hidden flex flex-col gap-4 pt-5">
          <!-- Name field -->
          <div class="flex flex-col">
            <label for="name" class="field-label">
              名稱
              <span>*</span>
            </label>
            <BaseInput
              id="name"
              class="w-full"
              placeholder="請輸入名稱"
              :required="true"
              :triggerValidate="props.triggerValidate"
              label="名稱"
              v-model="form.name"
            />
          </div>

          <!-- Category field -->
          <div class="flex flex-col">
            <label for="category" class="field-label">
              類別
              <span>*</span>
            </label>
            <BaseSelect
              selectId="category"
              :options="categoryOptions"
              :required="true"
              :triggerValidate="props.triggerValidate"
              default-selected="請選擇類別"
              class="w-full"
              v-model="form.category"
            />
          </div>

          <!-- Diet field -->
          <div class="flex flex-col">
            <label for="diet" class="field-label">
              葷/素
              <span>*</span>
            </label>
            <BaseSelect
              selectId="diet"
              :options="dietOptions"
              :required="true"
              :triggerValidate="props.triggerValidate"
              default-selected="請選擇葷/素"
              class="w-full"
              v-model="form.diet"
            />
          </div>

          <!-- Address selection -->
          <div class="flex flex-col">
            <label class="field-label">地址</label>
            <div class="flex gap-4">
              <BaseButton
                :outline="!form.useCurrentLocation"
                :active="form.useCurrentLocation"
                class="px-4 py-2 rounded-full"
                @click="
                  () => {
                    form.useCurrentLocation = true;
                    form.address = '現在位置';
                  }
                "
              >
                現在位置
              </BaseButton>
              <BaseButton
                :outline="form.useCurrentLocation"
                :active="!form.useCurrentLocation"
                class="px-4 py-2 rounded-full"
                @click="
                  () => {
                    form.useCurrentLocation = false;
                    form.address = '';
                  }
                "
              >
                其他地址
              </BaseButton>
            </div>
          </div>

          <!-- Custom address input field, only shown if 'Other address' is selected -->
          <div v-if="!form.useCurrentLocation" class="flex flex-col">
            <label for="address" class="field-label">
              其他地址
              <span>*</span>
            </label>
            <BaseInput
              id="address"
              class="w-full"
              placeholder="請輸入地址"
              :required="true"
              :triggerValidate="props.triggerValidate"
              label="其他地址"
              v-model="form.address"
            />
          </div>

          <!-- Quantity field -->
          <div class="flex flex-col">
            <label for="quantity" class="field-label">
              份數
              <span>*</span>
            </label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="form.quantity = Math.max(1, +form.quantity - 1)"
                class="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <BaseInput
                id="quantity"
                class="w-full"
                type="number"
                placeholder="請輸入份數"
                :required="true"
                :triggerValidate="props.triggerValidate"
                label="份數"
                v-model="form.quantity"
                :min="1"
              />
              <button
                type="button"
                @click="form.quantity = +form.quantity + 1"
                class="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <!-- Notes field -->
          <div class="flex flex-col">
            <label for="notes" class="field-label">備註</label>
            <BaseTextarea
              v-model="form.notes"
              id="notes"
              label="備註"
              :triggerValidate="props.triggerValidate"
              class="w-full"
              placeholder="請輸入備註"
            />
          </div>

          <!-- Photo field -->
          <div class="flex flex-col">
            <label for="photo" class="field-label">
              照片
              <span>*</span>
            </label>
            <BaseUpload
              id="photo"
              class="w-full"
              :required="true"
              :triggerValidate="props.triggerValidate"
              label="上傳照片"
              v-model="form.photo"
            />
          </div>
          <div class="flex justify-between mt-4">
            <BaseButton outline @click="handleCancel" class="w-1/2 mr-2">取消</BaseButton>
            <BaseButton @click="handleSubmit" class="w-1/2 ml-2">確認</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss">
.field-label {
  @apply text-grey-700 font-bold;
  @apply mb-2;

  & > span {
    @apply text-primary-500;
  }
}
</style>
