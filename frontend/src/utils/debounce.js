export function debounce(callback, delay) {
  let timeout
  const debounced = (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callback(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timeout)
  return debounced
}
