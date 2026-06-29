import * as XLSX from 'xlsx'

function excelDateToString(value) {
  if (!value) return ''

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'number') {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000))
    return date.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    return value.slice(0, 10)
  }

  return ''
}

function getMonth(dateText) {
  if (!dateText) return '未标注'
  return dateText.slice(0, 7)
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0
  const num = Number(String(value).replace(/[$,，\s]/g, ''))
  return Number.isNaN(num) ? 0 : num
}

export async function parseDealsExcel(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, {
    type: 'array',
    cellDates: false,
  })

  const allRows = []

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: true,
    })

    rows.forEach((row, index) => {
      const date = excelDateToString(row['视频发布时间'])
      const month = getMonth(date)

      const sku = row['合作款号'] || row['款号'] || row['SKU'] || row['产品'] || ''
      const group = row['网红ID'] || row['群组'] || row['达人'] || row['Group'] || ''

      const cost = toNumber(row['实际付费'])
      const orders = toNumber(row['单量取大'])
      const gmv = toNumber(row['GMV'])

      if (!sku && !group && !gmv && !cost && !orders) return

      allRows.push({
        id: `${sheetName}-${index}`,
        sheetName,
        date,
        month,
        sku,
        group,
        postLink: row['已合作发布视频链接'] || '',
        cost,
        orders,
        gmv,
        roas: cost > 0 ? gmv / cost : 0,
      })
    })
  })

  return allRows
}