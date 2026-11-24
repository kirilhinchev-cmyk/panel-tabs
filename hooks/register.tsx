import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { TabId } from '../types'

const PANE = 'panel-tabs'

type Tab = { id: TabId; label: string; text: string }

// A tuple, so TABS[0] is always defined (the fallback below).
const TABS: [Tab, ...Tab[]] = [
  { id: 'notes', label: 'Бележки', text: 'Място за бележки.' },
  { id: 'palette', label: 'Палитра', text: 'Място за палитра.' },
  { id: 'list', label: 'Списък', text: 'Място за списък.' },
]

// The selected tab, kept for the session. The shape tag makes a later
// version decline a value an earlier one stored under another tag.
const tab = atom(
  { plugin: 'panel-tabs', key: 'tab' } as const,
  'notes' as TabId,
  { shape: 'tabs-1' },
)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'tabs',
      description: 'Open the tabs pane',
    })
    void $.ui.open({ id: PANE, title: 'Tabs' })

    return next(e)
  })

  on('command.run', { command: 'tabs' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Tabs' })

    return { text: 'Панелът с табове е отворен.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const current = await read($, tab)
    const shown = TABS.find(one => one.id === current) ?? TABS[0]

    return (
      <Box flexDirection="column">
        <Box flexDirection="row">
          {TABS.map(one => (
            <Button
              key={one.id}
              variant={one.id === shown.id ? 'primary' : 'secondary'}
              onPress={() => update($, tab, () => one.id)}
            >
              {one.label}
            </Button>
          ))}
        </Box>
        <Text dimColor>{shown.text}</Text>
      </Box>
    )
  })
}
