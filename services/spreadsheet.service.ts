// Service to handle fetching and caching data from Google Sheets API via CSV export
export interface SheetEmployee {
  nik: string
  nama: string
  divisi: string
  jabatan: string
}

const SHEET_ID = '1BWiQHWcXUtaabIP0iZT8U4K_p0wHr-6cv5y93ekh2Uw'
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`
const CACHE_KEY = 'hrga_employees_cache'

export const spreadsheetService = {
  /**
   * Parse simple CSV text into an array of objects
   */
  parseCSV(csvText: string): SheetEmployee[] {
    const lines = csvText.split('\n').map(line => line.trim()).filter(Boolean)
    if (lines.length < 2) return []

    // Assumes headers are NIK, NAMA, DIVISI, JABATAN
    // We'll skip the header line (index 0)
    const result: SheetEmployee[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(col => {
        // Remove quotes if present
        let val = col.trim()
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1)
        }
        return val
      })

      if (cols.length >= 4) {
        result.push({
          nik: cols[0],
          nama: cols[1],
          divisi: cols[2],
          jabatan: cols[3],
        })
      }
    }
    
    return result
  },

  /**
   * Get cached data from localStorage if available
   */
  getCachedEmployees(): SheetEmployee[] | null {
    if (typeof window === 'undefined') return null
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (e) {
        console.error('Error parsing cached employees', e)
        return null
      }
    }
    return null
  },

  /**
   * Fetch latest data from Google Sheets, parse, cache, and return
   */
  async fetchEmployees(): Promise<SheetEmployee[]> {
    try {
      const response = await fetch(CSV_URL, { cache: 'no-store' })
      if (!response.ok) throw new Error('Failed to fetch from Google Sheets')
      
      const csvText = await response.text()
      const data = this.parseCSV(csvText)
      
      // Save to cache
      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      }
      
      return data
    } catch (error) {
      console.error('Spreadsheet fetch error:', error)
      // Fallback to cache if network fails
      const cached = this.getCachedEmployees()
      if (cached) return cached
      throw error
    }
  }
}
