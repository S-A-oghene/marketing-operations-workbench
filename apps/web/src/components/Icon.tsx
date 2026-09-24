export type IconName =
  | 'grid' | 'today' | 'check' | 'file' | 'calendar' | 'send' | 'search'
  | 'users' | 'mail' | 'megaphone' | 'chart' | 'image' | 'flask' | 'report'
  | 'briefcase' | 'spark' | 'book' | 'plug' | 'settings' | 'plus' | 'arrow'
  | 'chevron' | 'filter' | 'sliders' | 'more' | 'clock' | 'warning' | 'shield'
  | 'external' | 'copy' | 'play' | 'rocket' | 'command' | 'panel' | 'menu' | 'x'
  | 'edit' | 'refresh' | 'download' | 'link' | 'upload' | 'trash' | 'more-h';

const paths: Record<IconName, string[]> = {
  grid: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  today: ['M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z', 'M8 3v4', 'M16 3v4', 'M4 10h16'],
  check: ['M20 6 9 17l-5-5'],
  file: ['M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M14 3v5h5'],
  calendar: ['M5 4h14a1 1 0 0 1 1 1v15H4V5a1 1 0 0 1 1-1Z', 'M8 2v4', 'M16 2v4', 'M4 9h16'],
  send: ['m4 4 16 8-16 8 3-8-3-8Z', 'M7 12h13'],
  search: ['m20 20-4.5-4.5', 'a6.5 6.5 0 1 1-9.2-9.2 6.5 6.5 0 0 1 9.2 9.2Z'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  mail: ['M4 6h16v12H4z', 'm4 7 8 6 8-6'],
  megaphone: ['m3 11 16-5v12L3 13v-2Z', 'M11 14l1.5 6H9l-2-7', 'M19 10a3 3 0 0 1 0 4'],
  chart: ['M5 19V9', 'M12 19V5', 'M19 19v-7', 'M3 19h18'],
  image: ['M4 5h16v14H4z', 'm6 16 4-4 3 3 2-2 3 3', 'M9 9h.01'],
  flask: ['M9 3h6', 'M10 3v6.2L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.2V3', 'M8 16h8'],
  report: ['M5 4h14v16H5z', 'M8 8h8', 'M8 12h8', 'M8 16h5'],
  briefcase: ['M8 6V4h8v2', 'M4 7h16v12H4z', 'M4 12h16', 'M10 12v2h4v-2'],
  spark: ['M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z', 'M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z'],
  book: ['M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 0-4 0V4Z', 'M9 20V8a4 4 0 0 0-4-4'],
  plug: ['M8 12h8', 'M7 8V5', 'M17 8V5', 'M5 8h14v4a7 7 0 0 1-14 0V8Z', 'M12 19v3'],
  settings: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06-1.7 1.7-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21h-2.4v-.09a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.06.06-1.7-1.7.06-.06A1.8 1.8 0 0 0 8.16 15a1.8 1.8 0 0 0-1.66-1.1H6.4v-2.4h.1A1.8 1.8 0 0 0 8.15 10a1.8 1.8 0 0 0-.36-1.98l-.06-.06 1.7-1.7.06.06A1.8 1.8 0 0 0 12.57 5V4.9h2.4V5a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.06-.06 1.7 1.7-.06.06A1.8 1.8 0 0 0 19.4 10c.2.66.78 1.1 1.48 1.1h.1v2.4h-.1c-.7 0-1.28.44-1.48 1.5Z'],
  plus: ['M12 5v14', 'M5 12h14'], arrow: ['M5 12h14', 'm13 6 6 6-6 6'], chevron: ['m6 9 6 6 6-6'],
  filter: ['M4 6h16', 'M7 12h10', 'M10 18h4'], sliders: ['M4 6h16', 'M4 12h16', 'M4 18h16', 'M8 4v4', 'M15 10v4', 'M11 16v4'],
  more: ['M6 12h.01', 'M12 12h.01', 'M18 12h.01'], 'more-h': ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'], clock: ['M12 7v5l3 2', 'a8 8 0 1 1-6.2-2.3'],
  warning: ['m12 4 9 16H3L12 4Z', 'M12 10v4', 'M12 17h.01'], shield: ['M12 3 19 6v5c0 4.7-2.9 8.1-7 10-4.1-1.9-7-5.3-7-10V6l7-3Z', 'm9 12 2 2 4-4'],
  external: ['M14 5h5v5', 'm13 11 6-6', 'M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4'],
  copy: ['M8 8h11v11H8z', 'M5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1'], play: ['m9 6 9 6-9 6V6Z'],
  rocket: ['M14 4c3 0 6 3 6 6l-4 4-5-5 3-5Z', 'M11 9 6 14', 'M9 15l-4 1 1-4', 'M13 13l-3 3', 'M16 8h.01'],
  command: ['M7 12a3 3 0 1 0 0-6h4v4a3 3 0 1 0 6 0V6h-4', 'M7 12a3 3 0 1 0 0 6h4v-4a3 3 0 1 0 6 0v4h-4'],
  panel: ['M5 4h14a1 1 0 0 1 1 1v14H4V5a1 1 0 0 1 1-1Z', 'M15 4v16'], menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'], x: ['m6 6 12 12', 'm18 6-12 12'],
  edit: ['M4 20h4l11-11-4-4L4 16v4Z', 'm13 6 4 4'], refresh: ['M20 11a8 8 0 0 0-14.9-3', 'M4 4v5h5', 'M4 13a8 8 0 0 0 14.9 3', 'M20 20v-5h-5'], download: ['M12 3v12', 'm7 10 5 5 5-5', 'M5 21h14'],
  link: ['M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15', 'M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15'],
  upload: ['M12 3v12', 'm7 8 5-5 5 5', 'M5 21h14'], trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 13h10l1-13', 'M9 7V4h6v3']
};

export function Icon({ name, size = 18, strokeWidth = 1.8, className }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name].map((d, i) => <path key={i} d={d} />)}</svg>;
}
