<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  required?: boolean;
  label?: string;
  triggerValidate?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const inputValue = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isValidate = ref(true);

const validate = () => {
  isValidate.value = !!inputValue.value;
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    inputValue.value = file;

    const reader = new FileReader();

    // Show uncompressed image in preview
    reader.readAsDataURL(file);
    reader.onload = () => {
      previewUrl.value = reader.result as string;

      // Compress image for storage
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        const maxDimension = 200;
        let canvasWidth = img.width;
        let canvasHeight = img.height;

        if (canvasWidth > canvasHeight) {
          if (canvasWidth > maxDimension) {
            canvasHeight *= maxDimension / canvasWidth;
            canvasWidth = maxDimension;
          }
        } else {
          if (canvasHeight > maxDimension) {
            canvasWidth *= maxDimension / canvasHeight;
            canvasHeight = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

          // Compress image for the form data
          const compressedBase64 = canvas.toDataURL('image/jpeg');

          // Emit compressed base64 image
          emit('update:modelValue', compressedBase64);
        }
      };
    };

    validate();
  } else {
    inputValue.value = null;
    previewUrl.value = null;
    emit('update:modelValue', null);
  }
};

watch(
  () => props.triggerValidate,
  () => {
    validate();
  }
);
</script>

<template>
  <div class="flex flex-col">
    <!-- File Input (Hidden) -->
    <input type="file" ref="fileInput" class="hidden" @change="onFileChange" v-bind="$attrs" />

    <!-- Select File Button -->
    <button
      type="button"
      class="px-4 py-2 bg-primary-500 text-white rounded"
      @click="$refs.fileInput.click()"
    >
      選擇檔案
    </button>

    <!-- Preview image -->
    <div v-if="previewUrl" class="mt-4">
      <img :src="previewUrl" alt="Preview" class="mt-2 w-full h-auto object-cover" />
    </div>

    <!-- Warning if required and not valid -->
    <p v-if="required && !isValidate" class="mt-2 text-right text-warn-200 text-sm">
      {{ props.label }}不能為空
    </p>
  </div>
</template>

<style lang="postcss">
.hidden {
  display: none;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.bg-primary-500 {
  background-color: #5ab4c5; /* Adjust to your theme's primary color */
}

.text-white {
  color: #ffffff;
}

.rounded {
  border-radius: 0.375rem;
}

.text-warn-200 {
  color: #fbbf24; /* Adjust to your theme's warning color */
}

.w-32 {
  width: 8rem;
}

.h-32 {
  height: 8rem;
}

.object-cover {
  object-fit: cover;
}
</style>
