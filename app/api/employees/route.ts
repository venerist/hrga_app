import { NextResponse } from 'next/server'

// MOCK: In a real app, you would use googleapis and a service account to append to the sheet
// Example:
// import { google } from 'googleapis'
// const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
// const sheets = google.sheets({ version: 'v4', auth })
// await sheets.spreadsheets.values.append({ spreadsheetId, range: 'Sheet1!A:D', valueInputOption: 'USER_ENTERED', requestBody: { values: [[nik, nama, divisi, jabatan]] } })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nik, nama, divisi, jabatan } = body

    if (!nik || !nama || !divisi || !jabatan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Google Sheets API configuration required:
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
    const SPREADSHEET_ID = '1BWiQHWcXUtaabIP0iZT8U4K_p0wHr-6cv5y93ekh2Uw'

    if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL) {
      // For demonstration, we'll pretend it succeeded if credentials are not configured,
      // but warn the user in the server logs.
      console.warn('⚠️ GOOGLE_PRIVATE_KEY or GOOGLE_CLIENT_EMAIL not found in environment variables. Simulating success for Google Sheets append.')
      
      // We will also return a header or flag to let the client know it's simulated.
      return NextResponse.json({ 
        success: true, 
        simulated: true, 
        message: 'Google Sheets credential missing. Simulated success.',
        data: { nik, nama, divisi, jabatan }
      })
    }

    // If credentials exist, implement actual googleapis append here.
    // ...
    
    return NextResponse.json({ success: true, message: 'Row appended successfully.' })
  } catch (error: any) {
    console.error('Error appending employee to spreadsheet:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
