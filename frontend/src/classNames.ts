// merges multiple class names into one string
export default function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
