<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col relative sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-1 rounded-md cursor-pointer" @click="goBack" v-if="devicePath">返回</div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('header.title') }}</h1>
            <div class="flex items-center space-x-4">
              <DeviceStatus />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HomePage />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DeviceStatus from '@/components/DeviceStatus.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import HomePage from './views/HomePage.vue';

const devicePath = ref('');

const goBack = () => {
  if (devicePath.value) {
    window.location.href = devicePath.value;
  }
}

onMounted(() => {
  devicePath.value = sessionStorage.getItem('devicePath');
})
</script>
