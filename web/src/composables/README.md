# Composables 使用说明

## useDeviceStatus

用于在整个应用中共享设备状态和设备信息的 Composable。

### 功能特性

- 🔄 **全局共享**：所有组件都能访问相同的设备状态
- 📡 **自动检测**：自动检测设备在线状态并定期重试
- 📊 **详细信息**：提供芯片、开发板、固件、分区、网络、屏幕等信息
- 🛠️ **MCP工具**：提供调用MCP工具的便捷方法

### 基本用法

```javascript
import { useDeviceStatus } from '@/composables/useDeviceStatus'

export default {
  setup() {
    const {
      deviceStatus,      // 设备在线状态
      deviceInfo,        // 设备详细信息
      isDeviceOnline,    // 是否在线（计算属性）
      hasToken,          // 是否有token（计算属性）
      refreshDeviceStatus,  // 手动刷新状态
      callMcpTool        // 调用MCP工具
    } = useDeviceStatus()
    
    return {
      deviceStatus,
      deviceInfo,
      isDeviceOnline,
      hasToken
    }
  }
}
```

### 在 HomePage.vue 中使用示例

```vue
<template>
  <div>
    <!-- 显示设备信息 -->
    <div v-if="isDeviceOnline">
      <h2>设备已连接</h2>
      <p>芯片型号: {{ deviceInfo.chip?.model }}</p>
      <p>开发板: {{ deviceInfo.board?.model }}</p>
      <p>Flash大小: {{ deviceInfo.flash?.size }}</p>
      <p>Assets分区: {{ deviceInfo.assetsPartition?.sizeFormatted }}</p>
      <p>屏幕分辨率: {{ deviceInfo.screen?.resolution }}</p>
    </div>
    
    <div v-else>
      <p>设备离线</p>
    </div>
    
    <!-- 手动刷新按钮 -->
    <button @click="refreshDeviceStatus">刷新设备状态</button>
  </div>
</template>

<script setup>
import { useDeviceStatus } from '@/composables/useDeviceStatus'

const {
  deviceStatus,
  deviceInfo,
  isDeviceOnline,
  refreshDeviceStatus
} = useDeviceStatus()
</script>
```

### 在任意组件中使用

```vue
<script setup>
import { useDeviceStatus } from '@/composables/useDeviceStatus'

const { deviceInfo, isDeviceOnline } = useDeviceStatus()

// 根据设备信息调整UI
const displaySize = computed(() => {
  if (!deviceInfo.value.screen) return { width: 320, height: 240 }
  const [width, height] = deviceInfo.value.screen.resolution.split('x')
  return { width: parseInt(width), height: parseInt(height) }
})
</script>
```

### 调用MCP工具

```javascript
import { useDeviceStatus } from '@/composables/useDeviceStatus'

const { callMcpTool } = useDeviceStatus()

// 调用不带参数的工具
const systemInfo = await callMcpTool('self.get_system_info')

// 调用带参数的工具
const result = await callMcpTool('self.assets.set_download_url', {
  url: 'https://example.com/download'
})
```

### 可用的状态和方法

#### 状态（Refs）

- `deviceStatus`: 设备状态对象
  - `isOnline`: 是否在线
  - `error`: 错误信息
  - `lastCheck`: 最后检查时间

- `deviceInfo`: 设备信息对象
  - `chip`: { model: string }
  - `board`: { model: string }
  - `firmware`: { version: string }
  - `flash`: { size: string }  // Flash总大小
  - `assetsPartition`: { size: number, sizeFormatted: string }  // assets分区大小（字节数和格式化文本）
  - `network`: { type: string, signal: string }
  - `screen`: { resolution: string }

- `isChecking`: 是否正在检查设备状态

#### 计算属性（Computed）

- `hasToken`: 是否存在认证token
- `isDeviceOnline`: 设备是否在线

#### 方法（Methods）

- `initializeDeviceStatus()`: 初始化设备状态监控
- `cleanupDeviceStatus()`: 清理资源
- `refreshDeviceStatus()`: 手动刷新设备状态
- `checkDeviceStatus()`: 检查设备状态
- `callMcpTool(toolName, params)`: 调用MCP工具
- `getSignalDisplayText(signal)`: 格式化信号强度显示文本

### 注意事项

1. 设备状态会自动检测，离线时每30秒重试一次
2. 所有组件共享同一份设备状态，修改会影响所有使用该状态的组件
3. 在组件中只需调用 `useDeviceStatus()` 即可访问全局状态，无需手动初始化
4. `DeviceStatus.vue` 组件会自动处理初始化和清理工作

