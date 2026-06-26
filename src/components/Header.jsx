import { parseDealsExcel } from '../utils/excelParser'

function Header({ onImport }) {
  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const records = await parseDealsExcel(file)
    onImport(records)

    alert(`导入成功，共识别 ${records.length} 条投放记录`)
  }

  return (
    <header className="header">
      <div>
        <h1>FB Deals 智能运营系统</h1>
        <p>产品、群组、Tracking、人效、ROAS、月度决策一体化</p>
      </div>

      <div className="header-actions">
        <label className="import-button">
          导入Excel
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>

        <button>导出数据</button>
      </div>
    </header>
  )
}

export default Header