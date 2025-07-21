export function getpropsString(props: Record<string, any>) {
  return Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return ` ${key}="${value}"`
      }
      if (typeof value === 'number') {
        return ` :${key}="${value}"`
      }
      if (typeof value === 'boolean') {
        return value ? ` ${key}` : ``
      }
      return ` ${key}={${JSON.stringify(value)}}`
    })
    .join('')
}
