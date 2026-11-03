import {
  BookOpen,
  Building2,
  Coffee,
  GraduationCap,
  Info,
  Map,
  Phone,
  Printer,
  Sofa,
  Users,
  Wifi,
} from 'lucide-react'

// Maps the icon names used in src/data to lucide components,
// so data files stay plain JSON-like objects.
const icons = {
  graduation: GraduationCap,
  office: Building2,
  library: BookOpen,
  users: Users,
  map: Map,
  wifi: Wifi,
  phone: Phone,
  info: Info,
  printer: Printer,
  food: Coffee,
  study: Sofa,
}

export default function Icon({ name, ...props }) {
  const Component = icons[name] ?? Info
  return <Component aria-hidden="true" {...props} />
}
