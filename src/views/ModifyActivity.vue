<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import BaseSelect from '@/components/atoms/BaseSelect.vue';
import BaseTextarea from '@/components/atoms/BaseTextarea.vue';
import BaseUpload from '@/components/atoms/BaseUpload.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const emit = defineEmits(['onModify', 'onConfirm']);
const props = defineProps<{
  submitForm: {
    name: string;
    category: string;
    diet: string;
    address: string;
    quantity: number;
    notes: string;
    photo: string;
  };
}>();

const form = reactive({
  name: '',
  category: '',
  diet: '',
  useCurrentLocation: true,
  address: '',
  quantity: 1,
  notes: '',
  photo: ''
});

// 使用者資料
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// 初始化表單資料
onMounted(() => {
  if (props.submitForm) {
    Object.assign(form, props.submitForm);
  }
});

// 監控表單資料變化以驗證
watch(
  () => form,
  () => {
    const isValidate = Object.keys(form).every((key) => {
      const value = form[key as keyof typeof form];

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

// 提交表單
const handleSubmit = async () => {
  const userid = user.value ? user.value.id : "default_user_id";
  const submitData = {
    id: "", // 修改時可帶入現有ID
    userid: userid,
    name: form.name,
    category: form.category,
    diet: form.diet,
    address: form.address,
    quantity: form.quantity,
    notes: form.notes,
    photo: form.photo
  };
  console.log(submitData);
  const response = await axios.post("http://localhost:3000/insertfood", submitData);
  emit('onConfirm', submitData);
};

// 取消操作
const handleCancel = () => {
  emit('onModify');
};

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
</script>

<template>
  <section>
    <h1 class="font-bold text-xl mt-4">修改活動</h1>
    <div class="py-5 px-4">
      <div class="flex flex-col gap-4 pt-5">
        <!-- 名稱 -->
        <div class="flex flex-col">
          <label for="name" class="field-label">名稱 <span>*</span></label>
          <BaseInput
            id="name"
            class="w-full"
            placeholder="請輸入名稱"
            :required="true"
            v-model="form.name"
          />
        </div>

        <!-- 類別 -->
        <div class="flex flex-col">
          <label for="category" class="field-label">類別 <span>*</span></label>
          <BaseSelect
            selectId="category"
            :options="categoryOptions"
            :required="true"
            v-model="form.category"
          />
        </div>

        <!-- 葷/素 -->
        <div class="flex flex-col">
          <label for="diet" class="field-label">葷/素 <span>*</span></label>
          <BaseSelect
            selectId="diet"
            :options="dietOptions"
            :required="true"
            v-model="form.diet"
          />
        </div>

        <!-- 地址 -->
        <div class="flex flex-col">
          <label class="field-label">地址</label>
          <div class="flex gap-4">
            <BaseButton
              :outline="!form.useCurrentLocation"
              :active="form.useCurrentLocation"
              class="px-4 py-2 rounded-full"
              @click="() => { form.useCurrentLocation = true; form.address = '現在位置'; }"
            >
              現在位置
            </BaseButton>
            <BaseButton
              :outline="form.useCurrentLocation"
              :active="!form.useCurrentLocation"
              class="px-4 py-2 rounded-full"
              @click="() => { form.useCurrentLocation = false; form.address = ''; }"
            >
              其他地址
            </BaseButton>
          </div>
          <div v-if="!form.useCurrentLocation" class="flex flex-col">
            <BaseInput
              id="address"
              class="w-full"
              placeholder="請輸入地址"
              :required="true"
              v-model="form.address"
            />
          </div>
        </div>

        <!-- 份數 -->
        <div class="flex flex-col">
          <label for="quantity" class="field-label">份數 <span>*</span></label>
          <div class="flex items-center gap-2">
            <button type="button" @click="form.quantity = Math.max(1, +form.quantity - 1)" class="px-3 py-1 bg-gray-200 rounded">-</button>
            <BaseInput
              id="quantity"
              class="w-full"
              type="number"
              placeholder="請輸入份數"
              :required="true"
              v-model="form.quantity"
              :min="1"
            />
            <button type="button" @click="form.quantity = +form.quantity + 1" class="px-3 py-1 bg-gray-200 rounded">+</button>
          </div>
        </div>

        <!-- 備註 -->
        <div class="flex flex-col">
          <label for="notes" class="field-label">備註</label>
          <BaseTextarea
            v-model="form.notes"
            id="notes"
            placeholder="請輸入備註"
            class="w-full"
          />
        </div>

        <!-- 照片 -->
        <div class="flex flex-col">
          <label for="photo" class="field-label">照片 <span>*</span></label>
          <BaseUpload
            id="photo"
            class="w-full"
            :required="true"
            v-model="form.photo"
          />
        </div>

        <!-- 按鈕 -->
        <div class="flex justify-between mt-4">
          <BaseButton outline @click="handleCancel" class="w-1/2 mr-2">取消</BaseButton>
          <BaseButton @click="handleSubmit" class="w-1/2 ml-2">確認</BaseButton>
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
