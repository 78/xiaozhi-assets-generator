import en from './en.json'
import ptBR from './pt-BR.json'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'
import ja from './ja.json'
import vi from './vi.json'

export const messages = {
  en,
  'pt-BR': ptBR,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  vi
}

export const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
]

// 获取浏览器语言
export function getBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  const langMap = {
    'pt-BR': 'pt-BR',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'zh-HK': 'zh-TW',
    'zh': 'zh-CN',
    'ja': 'ja',
    'vi': 'vi',
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en'
  }
  return langMap[browserLang] || 'en'
}
