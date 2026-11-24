export type TabId = 'notes' | 'palette' | 'list'

declare module 'claude-code' {
  interface PluginState {
    'panel-tabs': { tab: Shaped<TabId> }
  }
}
