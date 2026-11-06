import { useSyncExternalStore } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
const installListeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    installListeners.forEach((listener) => listener())
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    installListeners.forEach((listener) => listener())
  })
}

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

function subscribeInstall(callback: () => void) {
  installListeners.add(callback)
  return () => {
    installListeners.delete(callback)
  }
}

function getInstallSnapshot() {
  return deferredPrompt !== null
}

export function useOnlineStatus() {
  return useSyncExternalStore(subscribeOnline, getOnlineSnapshot, () => true)
}

export function useInstallPrompt() {
  const canInstall = useSyncExternalStore(subscribeInstall, getInstallSnapshot, () => false)

  async function promptInstall() {
    if (!deferredPrompt) return false
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      deferredPrompt = null
      installListeners.forEach((listener) => listener())
      return true
    }
    return false
  }

  return { canInstall, promptInstall }
}
