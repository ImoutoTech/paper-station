export function array2options<T = string, F = string>(array: T[], valueFormatter: (i: T) => F) {
  return array.map((item) => ({
    label: String(item),
    value: valueFormatter(item)
  }))
}
