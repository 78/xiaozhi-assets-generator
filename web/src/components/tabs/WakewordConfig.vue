<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">唤醒词配置</h3>
      <p class="text-gray-600">
        根据您的芯片型号选择合适的唤醒词模型。
        <span v-if="supportWakeNet9" class="text-blue-600">
          您的芯片支持 WakeNet9 模型。
        </span>
        <span v-else-if="supportWakeNet9s" class="text-blue-600">
          您的芯片支持 WakeNet9s 模型。
        </span>
        <span v-else class="text-orange-600">
          您的芯片不支持唤醒词功能。
        </span>
      </p>
    </div>

    <!-- 不支持唤醒词的提示 -->
    <div v-if="!supportWakeNet9 && !supportWakeNet9s" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div class="text-sm text-orange-800">
        <strong>注意：</strong>
        <p class="mt-1">{{ chipModel }} 芯片不支持唤醒词功能。如需使用唤醒词，请选择 ESP32-S3、ESP32-P4 或 ESP32-C3/C5/C6 芯片。</p>
      </div>
    </div>

    <!-- 唤醒词选择 -->
    <div v-else class="space-y-4">
      <label class="block text-sm font-medium text-gray-700">选择唤醒词</label>
      
      <!-- 下拉选择 -->
      <div class="relative">
        <select 
          :value="modelValue"
          @change="selectWakeword($event.target.value)"
          class="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">请选择唤醒词（可选）</option>
          <option
            v-for="wakeword in availableWakewords"
            :key="wakeword.id"
            :value="wakeword.id"
          >
            {{ wakeword.name }} ({{ wakeword.model }})
          </option>
        </select>
      </div>

      <!-- 提示信息 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="text-sm text-blue-800">
          <strong>提示：</strong>
          <ul class="mt-1 list-disc list-inside space-y-1">
            <li>唤醒词是可选的，不配置唤醒词时设备将无法语音唤醒</li>
            <li v-if="supportWakeNet9s">C3/C5/C6 芯片仅支持 WakeNet9s 轻量级模型</li>
            <li v-else-if="supportWakeNet9">S3/P4 芯片支持完整的 WakeNet9 模型，选择更多</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  chipModel: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 完整的唤醒词配置数据
const wakewordData = [
  // WakeNet9s (C3/C6 芯片支持)
  { id: 'wn9s_hilexin', name: 'Hi,乐鑫', model: 'WakeNet9s' },
  { id: 'wn9s_hiesp', name: 'Hi,ESP', model: 'WakeNet9s' },
  { id: 'wn9s_nihaoxiaozhi', name: '你好小智', model: 'WakeNet9s' },
  { id: 'wn9s_hijason', name: 'Hi,Jason', model: 'WakeNet9s' },
  { id: 'wn9s_alexa', name: 'Alexa', model: 'WakeNet9s' },
  
  // WakeNet9 (S3/P4 芯片支持)
  { id: 'wn9_hilexin', name: 'Hi,乐鑫', model: 'WakeNet9' },
  { id: 'wn9_hiesp', name: 'Hi,ESP', model: 'WakeNet9' },
  { id: 'wn9_nihaoxiaozhi_tts', name: '你好小智', model: 'WakeNet9' },
  { id: 'wn9_hijason_tts2', name: 'Hi,Jason', model: 'WakeNet9' },
  { id: 'wn9_nihaomiaoban_tts2', name: '你好喵伴', model: 'WakeNet9' },
  { id: 'wn9_xiaoaitongxue', name: '小爱同学', model: 'WakeNet9' },
  { id: 'wn9_himfive', name: 'Hi,M Five', model: 'WakeNet9' },
  { id: 'wn9_alexa', name: 'Alexa', model: 'WakeNet9' },
  { id: 'wn9_jarvis_tts', name: 'Jarvis', model: 'WakeNet9' },
  { id: 'wn9_computer_tts', name: 'Computer', model: 'WakeNet9' },
  { id: 'wn9_heywillow_tts', name: 'Hey,Willow', model: 'WakeNet9' },
  { id: 'wn9_sophia_tts', name: 'Sophia', model: 'WakeNet9' },
  { id: 'wn9_mycroft_tts', name: 'Mycroft', model: 'WakeNet9' },
  { id: 'wn9_heyprinter_tts', name: 'Hey,Printer', model: 'WakeNet9' },
  { id: 'wn9_hijoy_tts', name: 'Hi,Joy', model: 'WakeNet9' },
  { id: 'wn9_heywanda_tts', name: 'Hey,Wand', model: 'WakeNet9' },
  { id: 'wn9_astrolabe_tts', name: 'Astrolabe', model: 'WakeNet9' },
  { id: 'wn9_heyily_tts2', name: 'Hey,Ily', model: 'WakeNet9' },
  { id: 'wn9_hijolly_tts2', name: 'Hi,Jolly', model: 'WakeNet9' },
  { id: 'wn9_hifairy_tts2', name: 'Hi,Fairy', model: 'WakeNet9' },
  { id: 'wn9_bluechip_tts2', name: 'Blue Chip', model: 'WakeNet9' },
  { id: 'wn9_hiandy_tts2', name: 'Hi,Andy', model: 'WakeNet9' },
  { id: 'wn9_heyivy_tts2', name: 'Hey,Ivy', model: 'WakeNet9' },
  { id: 'wn9_hiwalle_tts2', name: 'Hi,Wall E', model: 'WakeNet9' },
  { id: 'wn9_nihaoxiaoxin_tts', name: '你好小鑫', model: 'WakeNet9' },
  { id: 'wn9_xiaomeitongxue_tts', name: '小美同学', model: 'WakeNet9' },
  { id: 'wn9_hixiaoxing_tts', name: 'Hi,小星', model: 'WakeNet9' },
  { id: 'wn9_xiaolongxiaolong_tts', name: '小龙小龙', model: 'WakeNet9' },
  { id: 'wn9_miaomiaotongxue_tts', name: '喵喵同学', model: 'WakeNet9' },
  { id: 'wn9_himiaomiao_tts', name: 'Hi,喵喵', model: 'WakeNet9' },
  { id: 'wn9_hilili_tts', name: 'Hi,Lily', model: 'WakeNet9' },
  { id: 'wn9_hitelly_tts', name: 'Hi,Telly', model: 'WakeNet9' },
  { id: 'wn9_xiaobinxiaobin_tts', name: '小滨小滨', model: 'WakeNet9' },
  { id: 'wn9_haixiaowu_tts', name: 'Hi,小巫', model: 'WakeNet9' },
  { id: 'wn9_xiaoyaxiaoya_tts2', name: '小鸭小鸭', model: 'WakeNet9' },
  { id: 'wn9_linaiban_tts2', name: '璃奈板', model: 'WakeNet9' },
  { id: 'wn9_xiaosurou_tts2', name: '小酥肉', model: 'WakeNet9' },
  { id: 'wn9_xiaoyutongxue_tts2', name: '小宇同学', model: 'WakeNet9' },
  { id: 'wn9_xiaomingtongxue_tts2', name: '小明同学', model: 'WakeNet9' },
  { id: 'wn9_xiaokangtongxue_tts2', name: '小康同学', model: 'WakeNet9' },
  { id: 'wn9_xiaojianxiaojian_tts2', name: '小箭小箭', model: 'WakeNet9' },
  { id: 'wn9_xiaotexiaote_tts2', name: '小特小特', model: 'WakeNet9' },
  { id: 'wn9_nihaoxiaoyi_tts2', name: '你好小益', model: 'WakeNet9' },
  { id: 'wn9_nihaobaiying_tts2', name: '你好百应', model: 'WakeNet9' },
  { id: 'wn9_xiaoluxiaolu_tts2', name: '小鹿小鹿', model: 'WakeNet9' },
  { id: 'wn9_nihaodongdong_tts2', name: '你好东东', model: 'WakeNet9' },
  { id: 'wn9_nihaoxiaoan_tts2', name: '你好小安', model: 'WakeNet9' },
  { id: 'wn9_ni3hao3xiao3mai4_tts2', name: '你好小脉', model: 'WakeNet9' },
  { id: 'wn9_ni3hao3xiao3rui4_tts3', name: '你好小瑞', model: 'WakeNet9' },
  { id: 'wn9_hai1xiao3ou1_tts3', name: '嗨小欧', model: 'WakeNet9' }
]

// 判断芯片是否支持 WakeNet9
const supportWakeNet9 = computed(() => {
  const chip = props.chipModel.toLowerCase()
  return chip === 'esp32s3' || chip === 'esp32p4'
})

// 判断芯片是否支持 WakeNet9s
const supportWakeNet9s = computed(() => {
  const chip = props.chipModel.toLowerCase()
  return chip === 'esp32c3' || chip === 'esp32c5' || chip === 'esp32c6'
})

// 根据芯片型号过滤可用的唤醒词
const availableWakewords = computed(() => {
  if (supportWakeNet9.value) {
    return wakewordData.filter(w => w.model === 'WakeNet9')
  } else if (supportWakeNet9s.value) {
    return wakewordData.filter(w => w.model === 'WakeNet9s')
  } else {
    // esp32 和 others 不支持唤醒词
    return []
  }
})

const selectWakeword = (id) => {
  // 如果选择的是空值，清除选择
  if (id === '') {
    emit('update:modelValue', '')
    return
  }
  
  // 如果点击的是已选中的唤醒词，则取消选中
  if (props.modelValue === id) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', id)
  }
}

</script>