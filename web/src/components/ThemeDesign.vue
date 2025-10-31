<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('themeDesign.title') }}</h2>
      <p class="text-gray-600 mb-6">{{ $t('themeDesign.description') }}</p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabClick(tab.id)"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            currentTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <span class="flex items-center">
            <component :is="tab.icon" class="w-5 h-5 mr-2" />
            {{ tab.name }}
            <span v-if="getTabStatus(tab.id)" class="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="min-h-96">
      <WakewordConfig 
        v-if="currentTab === 'wakeword'"
        v-model="localValue.wakeword"
        :chipModel="chipModel"
      />
      
      <FontConfig 
        v-if="currentTab === 'font'"
        v-model="localValue.font"
      />
      
      <EmojiConfig 
        v-if="currentTab === 'emoji'"
        v-model="localValue.emoji"
      />
      
      <BackgroundConfig 
        v-if="currentTab === 'background'"
        v-model="localValue.skin"
      />
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <button 
        @click="$emit('prev')"
        class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        {{ $t('themeDesign.previous') }}
      </button>
      <button 
        @click="handleNext"
        :disabled="!canProceed"
        class="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        {{ $t('themeDesign.next') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import WakewordConfig from './tabs/WakewordConfig.vue'
import FontConfig from './tabs/FontConfig.vue'
import EmojiConfig from './tabs/EmojiConfig.vue'
import BackgroundConfig from './tabs/BackgroundConfig.vue'

// Icons (simple SVG components)
const MicrophoneIcon = {
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor', 
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
      })
    ])
  }
}

const FontIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'currentColor',
      viewBox: '0 0 640 640'
    }, [
      h('path', {
        d: 'M320 96C329.5 96 338 101.5 341.9 110.2L515.1 496L536 496C549.3 496 560 506.7 560 520C560 533.3 549.3 544 536 544L440 544C426.7 544 416 533.3 416 520C416 506.7 426.7 496 440 496L462.5 496L426.6 416L213.4 416L177.5 496L200 496C213.3 496 224 506.7 224 520C224 533.3 213.3 544 200 544L104 544C90.7 544 80 533.3 80 520C80 506.7 90.7 496 104 496L124.9 496L298.1 110.2C302 101.5 310.5 96 320 96zM320 178.6L235 368L405 368L320 178.6z'
      })
    ])
  }
}

const EmojiIcon = {
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2', 
        d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  }
}

const BackgroundIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'currentColor',
      viewBox: '0 0 640 640'
    }, [
      h('path', {
        d: 'M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM224 192C241.7 192 256 206.3 256 224C256 241.7 241.7 256 224 256C206.3 256 192 241.7 192 224C192 206.3 206.3 192 224 192zM360 264C368.5 264 376.4 268.5 380.7 275.8L460.7 411.8C465.1 419.2 465.1 428.4 460.8 435.9C456.5 443.4 448.6 448 440 448L200 448C191.1 448 182.8 443 178.7 435.1C174.6 427.2 175.2 417.6 180.3 410.3L236.3 330.3C240.8 323.9 248.1 320.1 256 320.1C263.9 320.1 271.2 323.9 275.7 330.3L292.9 354.9L339.4 275.9C343.7 268.6 351.6 264.1 360.1 264.1z'
      })
    ])
  }
}

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  chipModel: {
    type: String,
    required: true
  },
  activeTab: {
    type: String,
    default: 'wakeword'
  }
})

const emit = defineEmits(['update:modelValue', 'next', 'prev', 'tabChange'])

const currentTab = ref(props.activeTab)

// 使用计算属性来获取翻译后的tab名称
const tabs = computed(() => [
  { id: 'wakeword', name: t('themeDesign.tabs.wakeword'), icon: MicrophoneIcon },
  { id: 'font', name: t('themeDesign.tabs.font'), icon: FontIcon },
  { id: 'emoji', name: t('themeDesign.tabs.emoji'), icon: EmojiIcon },
  { id: 'background', name: t('themeDesign.tabs.background'), icon: BackgroundIcon }
])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getTabStatus = (tabId) => {
  switch (tabId) {
    case 'wakeword':
      return !!localValue.value.wakeword
    case 'font':
      return localValue.value.font.preset || localValue.value.font.custom.file
    case 'emoji':
      return localValue.value.emoji.preset || Object.keys(localValue.value.emoji.custom.images).length > 0
    case 'background':
      return true // 背景默认已配置
    default:
      return false
  }
}

const canProceed = computed(() => {
  const hasFont = localValue.value.font.preset || localValue.value.font.custom.file
  const hasEmoji = localValue.value.emoji.preset || Object.keys(localValue.value.emoji.custom.images).length > 0
  return hasFont && hasEmoji
})

const handleNext = () => {
  if (canProceed.value) {
    emit('next')
  }
}

const handleTabClick = (tabId) => {
  currentTab.value = tabId
  emit('tabChange', tabId)
}

// 监听外部activeTab的变化
watch(() => props.activeTab, (newTab) => {
  currentTab.value = newTab
})
</script>
