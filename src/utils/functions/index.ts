export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}
export function setUserSession(obj: { key: any; value: any }) {
  sessionStorage.getItem(obj.key) || sessionStorage.setItem(obj.key, obj.value)
}
export function getUserSession(key: string) {
  return sessionStorage.getItem(key)
}