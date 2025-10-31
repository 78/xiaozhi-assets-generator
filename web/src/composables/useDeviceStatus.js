import { ref, computed, onMounted, onUnmounted } from 'vue'

// 全局共享的设备状态
const deviceStatus = ref({
  isOnline: false,
  error: '',
  lastCheck: null
})

const deviceInfo = ref({
  chip: null,
  board: null,
  firmware: null,
  flash: null,
  assetsPartition: null,
  network: null,
  screen: null
})

const token = ref('')
const isChecking = ref(false)
const retryTimer = ref(null)

// 获取URL参数
const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

// 调用MCP工具
const callMcpTool = async (toolName, params = {}) => {
  if (!token.value) {
    throw new Error('未找到认证令牌')
  }

  const response = await fetch('/api/messaging/device/tools/call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
    body: JSON.stringify({
      name: toolName,
      arguments: params
    })
  })

  if (response.ok) {
    const result = await response.json()
    return result
  } else {
    const errorText = await response.text()
    console.error(`MCP工具 ${toolName} 失败:`, response.status, errorText)
    
    // 解析错误信息
    let errorMessage = `调用${toolName}失败`
    try {
      const errorData = JSON.parse(errorText)
      if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch (e) {
      // 如果解析失败，使用HTTP状态码
      errorMessage = `${errorMessage}: HTTP ${response.status}`
    }
    
    throw new Error(errorMessage)
  }
}

// 获取设备详细信息
const fetchDeviceInfo = async () => {
  try {
    // 并发获取所有设备信息
    const [systemInfoResponse, deviceStateResponse, screenInfoResponse] = await Promise.allSettled([
      callMcpTool('self.get_system_info'),
      callMcpTool('self.get_device_status'),
      callMcpTool('self.screen.get_info')
    ])

    // 处理系统信息
    if (systemInfoResponse.status === 'fulfilled' && systemInfoResponse.value) {
      const data = systemInfoResponse.value.data || systemInfoResponse.value

      deviceInfo.value.chip = { model: data.chip_model_name || '未知' }
      deviceInfo.value.board = { model: data.board?.name || '未知' }
      deviceInfo.value.firmware = { version: data.application?.version || '未知' }

      // 获取Flash大小
      if (data.flash_size) {
        const sizeInMB = Math.round(data.flash_size / 1024 / 1024)
        deviceInfo.value.flash = { size: `${sizeInMB}MB` }
      } else {
        deviceInfo.value.flash = { size: '未知' }
      }

      // 获取assets分区大小
      if (data.partition_table) {
        const assetsPartition = data.partition_table.find(p => p.label === 'assets')
        if (assetsPartition) {
          deviceInfo.value.assetsPartition = { 
            size: assetsPartition.size,
            sizeFormatted: `${Math.round(assetsPartition.size / 1024 / 1024)}MB`
          }
        } else {
          deviceInfo.value.assetsPartition = null
        }
      } else {
        deviceInfo.value.assetsPartition = null
      }
    } else {
      console.warn('系统信息获取失败:', systemInfoResponse.reason || systemInfoResponse.value)
      deviceInfo.value.chip = { model: '未知' }
      deviceInfo.value.board = { model: '未知' }
      deviceInfo.value.firmware = { version: '未知' }
      deviceInfo.value.flash = { size: '未知' }
      deviceInfo.value.assetsPartition = null
    }

    // 处理设备状态信息
    if (deviceStateResponse.status === 'fulfilled' && deviceStateResponse.value) {
      const data = deviceStateResponse.value.data || deviceStateResponse.value

      deviceInfo.value.network = {
        type: data.network?.type || 'unknown',
        signal: data.network?.signal || '未知'
      }
    } else {
      console.warn('设备状态获取失败:', deviceStateResponse.reason || deviceStateResponse.value)
      deviceInfo.value.network = { type: 'unknown', signal: '未知' }
    }

    // 处理屏幕信息
    if (screenInfoResponse.status === 'fulfilled' && screenInfoResponse.value) {
      const data = screenInfoResponse.value.data || screenInfoResponse.value

      deviceInfo.value.screen = {
        resolution: `${data.width || 0}x${data.height || 0}`
      }
    } else {
      console.warn('屏幕信息获取失败:', screenInfoResponse.reason || screenInfoResponse.value)
      deviceInfo.value.screen = { resolution: '未知' }
    }
  } catch (error) {
    console.error('获取设备信息时发生错误:', error)
  }
}

// 检查设备是否在线
const checkDeviceStatus = async () => {
  if (isChecking.value || !token.value) return

  isChecking.value = true
  try {
    const response = await fetch('/api/messaging/device/tools/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (response.ok) {
      deviceStatus.value.isOnline = true
      deviceStatus.value.error = ''
      deviceStatus.value.lastCheck = new Date()

      // 获取设备详细信息
      await fetchDeviceInfo()
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    deviceStatus.value.isOnline = false
    deviceStatus.value.error = ''
    deviceStatus.value.lastCheck = new Date()

    // 30秒后重试
    if (retryTimer.value) {
      clearTimeout(retryTimer.value)
    }
    retryTimer.value = setTimeout(checkDeviceStatus, 30000)
  } finally {
    isChecking.value = false
  }
}

// 格式化信号强度显示文本
const getSignalDisplayText = (signal) => {
  if (!signal) return '未知'

  switch (signal.toLowerCase()) {
    case 'strong':
      return '强'
    case 'medium':
      return '中等'
    case 'weak':
      return '弱'
    case 'none':
      return '无信号'
    default:
      return signal
  }
}

// 初始化设备状态监控
const initializeDeviceStatus = () => {
  token.value = getUrlParameter('token')
  if (token.value) {
    checkDeviceStatus()
  }
}

// 清理资源
const cleanupDeviceStatus = () => {
  if (retryTimer.value) {
    clearTimeout(retryTimer.value)
    retryTimer.value = null
  }
}

// 手动刷新设备状态
const refreshDeviceStatus = async () => {
  await checkDeviceStatus()
}

/**
 * 设备状态 Composable
 * 用于在整个应用中共享设备状态和设备信息
 */
export function useDeviceStatus() {
  // 计算属性
  const hasToken = computed(() => !!token.value)
  const isDeviceOnline = computed(() => deviceStatus.value.isOnline)

  return {
    // 状态
    deviceStatus,
    deviceInfo,
    isChecking,
    hasToken,
    isDeviceOnline,
    
    // 方法
    initializeDeviceStatus,
    cleanupDeviceStatus,
    refreshDeviceStatus,
    checkDeviceStatus,
    callMcpTool,
    getSignalDisplayText
  }
}

