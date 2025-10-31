<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span>{{ currentLanguage.flag }}</span>
      <span>{{ currentLanguage.name }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
      @click.stop
    >
      <div class="py-1">
        <button
          v-for="lang in languageOptions"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          :class="{ 'bg-blue-50 text-blue-700': lang.code === currentLanguage.code }"
        >
          <span class="mr-3">{{ lang.flag }}</span>
          <span>{{ lang.name }}</span>
          <svg
            v-if="lang.code === currentLanguage.code"
            class="ml-auto w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 点击其他地方关闭下拉菜单 -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { languageOptions } from '@/locales'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLanguage = computed(() => {
  return languageOptions.find(lang => lang.code === locale.value) || languageOptions[0]
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectLanguage = (langCode) => {
  locale.value = langCode
  // 保存语言选择到localStorage
  localStorage.setItem('user-language', langCode)
  closeDropdown()
}

// 监听页面点击事件，关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    closeDropdown()
  }
}

// 组件挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 从localStorage恢复用户选择的语言
  const savedLanguage = localStorage.getItem('user-language')
  if (savedLanguage && languageOptions.find(lang => lang.code === savedLanguage)) {
    locale.value = savedLanguage
  }
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
