export const toast = {
  success: (msg: string) => window.alert(`SUCCESS: ${msg}`),
  error: (msg: string) => window.alert(`ERROR: ${msg}`),
  info: (msg: string) => console.log(`INFO: ${msg}`),
}
