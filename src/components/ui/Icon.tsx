import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'home'
  | 'dumbbell'
  | 'leaf'
  | 'activity'
  | 'user'
  | 'users'
  | 'plus'
  | 'search'
  | 'moon'
  | 'sun'
  | 'monitor'
  | 'logout'
  | 'chevronRight'
  | 'chevronLeft'
  | 'arrowLeft'
  | 'arrowRight'
  | 'trash'
  | 'edit'
  | 'clock'
  | 'flame'
  | 'calendar'
  | 'check'
  | 'x'
  | 'target'
  | 'scale'
  | 'ruler'
  | 'sparkles'
  | 'shield'
  | 'menu'
  | 'bowl'
  | 'chart'
  | 'filter'
  | 'eye'
  | 'eyeOff'
  | 'alert'
  | 'refresh'
  | 'info'
  | 'mail'
  | 'lock'
  | 'at'
  | 'heart'
  | 'list'
  | 'play'
  | 'wifiOff'
  | 'download'
  | 'chevronUp'
  | 'chevronDown'
  | 'rotateCcw'
  | 'trophy'
  | 'timer'

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.8 12 3.5l8.5 7.3" />
      <path d="M5.5 9.5v10h13v-10" />
      <path d="M9.5 19.5v-6h5v6" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c-8 0-13 3.5-13 9.5 0 3.5 2.5 6.5 6 6.5 6 0 7-7 7-16Z" />
      <path d="M4 21c1-6 5-10 11-12" />
    </>
  ),
  activity: (
    <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.7-3.5 3.6-5.6 7.2-5.6s6.5 2.1 7.2 5.6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5c.6-3 3-5 6.2-5s5.6 2 6.2 5" />
      <path d="M16 5.2a3 3 0 0 1 0 5.8M18.2 14.8c1.8.6 3 2.2 3.4 4.4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4 4" />
    </>
  ),
  moon: <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" />
      <path d="M9 8l-4 4 4 4M5 12h10" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  arrowLeft: <path d="M20 12H4m6-7-7 7 7 7" />,
  arrowRight: <path d="M4 12h16m-6-7 7 7-7 7" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  flame: <path d="M12 21c4 0 6.5-2.7 6.5-6.1 0-4.5-4.2-6.2-4.2-10.4-2.7 1.4-4 3.6-4 5.7 0 1.4.6 2.2.6 3.2 0 .9-.7 1.6-1.6 1.6-1 0-1.7-.8-1.8-2.1C6 14 5.5 15 5.5 16.2 5.5 19 8 21 12 21Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  scale: (
    <>
      <rect x="3.5" y="4" width="17" height="16.5" rx="3" />
      <path d="M7.5 9.5a4.5 4.5 0 0 1 9 0" />
      <path d="M12 9.5 10 12" />
    </>
  ),
  ruler: (
    <>
      <path d="M4 15 15 4l5 5L9 20l-5-5Z" />
      <path d="m7.5 11.5 2 2M11 8l2 2M14.5 4.5l2 2M4.5 15l2 2" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 14l.7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  bowl: (
    <>
      <path d="M3.5 11h17c0 4.5-3.8 8-8.5 8s-8.5-3.5-8.5-8Z" />
      <path d="M8 7.5c0-1.5 1-2 1-3.5M12 7.5c0-1.5 1-2 1-3.5M16 7.5c0-1.5 1-2 1-3.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.3 3M6.1 7.2A15.8 15.8 0 0 0 2.5 12S6 18 12 18c1.7 0 3.2-.5 4.5-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21 20H3L12 3.5Z" />
      <path d="M12 9v5M12 17.2v.1" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M19.2 12A7.5 7.5 0 1 1 17 6.1L20 8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8v.1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 15v2" />
    </>
  ),
  at: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 5 2 9 9 0 1 0-3.5 7" />
    </>
  ),
  heart: <path d="M12 20.5s-8.5-5-8.5-11A4.5 4.5 0 0 1 12 6.4a4.5 4.5 0 0 1 8.5 3.1c0 6-8.5 11-8.5 11Z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.1M3.5 12h.1M3.5 18h.1" />,
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" />,
  wifiOff: (
    <>
      <path d="M2 2l20 20" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M5 13a10 10 0 0 1 5.2-2.7M16.2 11a10 10 0 0 1 2.8 2" />
      <path d="M2 9.5a15 15 0 0 1 4.2-2.8M10.7 5.2A15 15 0 0 1 22 9.5" />
      <circle cx="12" cy="20" r="1" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11m0 0-4-4m4 4 4-4" />
      <path d="M4 17v2a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-2" />
    </>
  ),
  chevronUp: <path d="m18 15-6-6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  rotateCcw: (
    <>
      <path d="M4 7v5h5" />
      <path d="M4.8 12A7.5 7.5 0 1 0 7 6.1L4 8" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4.5a1.5 1.5 0 0 0-1.5 1.5V8a4 4 0 0 0 4 4M17 6h2.5A1.5 1.5 0 0 1 21 7.5V8a4 4 0 0 1-4 4" />
      <path d="M12 14v5M8.5 19h7" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M10 3h4M12 10v3.5l2.5 1.5" />
    </>
  ),
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export default function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
