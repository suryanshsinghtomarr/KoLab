import { useEffect, useRef } from 'react'
import { debounce } from '../utils/debounce'

export default function useAutoSave(save, value, delay = 1500) {
  const saveRef = useRef(save)
  useEffect(() => { saveRef.current = save }, [save])
  useEffect(() => {
    const persist = debounce(() => saveRef.current(value), delay)
    persist()
    return () => persist.cancel()
  }, [value, delay])
}
