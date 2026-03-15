import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('settings')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {}
          data.forEach(row => { map[row.key] = row.value })
          setSettings(map)
        }
        setLoading(false)
      })
  }, [])

  const updateSetting = async (key: string, value: string) => {
    await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return { settings, loading, updateSetting }
}
