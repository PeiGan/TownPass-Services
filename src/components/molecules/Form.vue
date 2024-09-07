<script setup lang="ts">
import { reactive, watch } from 'vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseUpload from '@/components/atoms/BaseUpload.vue';

export interface BasicForm {
  name: string;
  category: string;
  diet: string;
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

const emit = defineEmits(['onFormChange']);

const form = reactive<BasicForm>({
  name: '',
  category: '',
  diet: '',
  address: '',
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
        return typeof value === 'number' && value >= 0;
      }

      if (key === 'photo') {
        return typeof value === 'string' && value.startsWith('data:image');
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

const categoryOptions = [
  { label: '主食', value: 'food' },
  { label: '點心', value: 'snack' },
  { label: '飲料', value: 'drink' },
  { label: '食材', value: 'ingredient' }
];

const dietOptions = [
  { label: '葷', value: 'non-vegetarian' },
  { label: '素', value: 'vegetarian' },
  { label: '蛋奶素', value: 'half-vegetarian' }
];

const handleSubmit = () => {
  console.log(form);
  const formDataJson = JSON.stringify(form);
  console.log('Form Data:', formDataJson);
  debugger;
};
</script>

<template>
  <section>
    <div class="py-5 px-4">
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

          <!-- Address field -->
          <div class="flex flex-col">
            <label for="address" class="field-label">
              地址
              <span>*</span>
            </label>
            <BaseInput
              id="address"
              class="w-full"
              placeholder="請輸入地址"
              :required="true"
              :triggerValidate="props.triggerValidate"
              label="地址"
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

          <!-- Submit Button -->
          <div class="flex justify-end mt-5">
            <button @click="handleSubmit" class="px-4 py-2 bg-primary-500 text-white rounded">
              送出
            </button>
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
