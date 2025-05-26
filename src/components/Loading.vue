<script setup>
import { defineProps } from 'vue'

const props = defineProps(['classTambahan'])

</script>

<template>
    <div :class="['flex justify-center items-center h-[70%] gap-2 text-text', classTambahan]">
        <i class="pi pi-spin pi-spinner"></i>
        Mengambil data...
    </div>
</template>