<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

if (props.duration > 0) {
  setTimeout(() => {
    if (props.show) {
      emit('close')
    }
  }, props.duration)
}

const closeToast = () => {
  emit('close')
}

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'pi pi-check-circle'
    case 'error':
      return 'pi pi-times-circle'
    case 'warning':
      return 'pi pi-exclamation-triangle'
    case 'info':
    default:
      return 'pi pi-info-circle'
  }
})

const bgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green'
    case 'error':
      return 'bg-red'
    case 'warning':
      return 'bg-peach'
    case 'info':
    default:
      return 'bg-blue'
  }
})
</script>

<template>
  <transition enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="show" :class="bgColor"
      class="toast top-4 right-4 fixed z-50 max-w-sm w-full px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90 flex items-center">
      <div class="flex-shrink-0 mr-3">
        <i :class="icon" class="text-lg text-base"></i>
      </div>
      <div class="flex-1 mr-2">
        <p class="text-sm font-medium text-base">{{ message }}</p>
      </div>
      <div class="flex-shrink-0">
        <button @click="closeToast"
          class="inline-flex rounded-md text-base focus:outline-none hover:text-overlay2 transition-colors">
          <span class="sr-only">Close</span>
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(203, 166, 247, 0.4);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(203, 166, 247, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(203, 166, 247, 0);
  }
}

.fixed {
  animation: pulse 2s infinite;
}

.toast.bg-green {
  border-left: 4px solid rgb(90, 228, 77);
}

.toast.bg-red {
  border-left: 4px solid rgb(250, 104, 145);
}

.toast.bg-peach {
  border-left: 4px solid rgb(253, 155, 94);
}

.toast.bg-blue {
  border-left: 4px solid rgb(86, 146, 241);
}
</style>