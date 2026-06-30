function MonthFilter({ records = [], selectedMonths = [], onChange }) {
  const months = Array.from(
    new Set(records.map((row) => row.month).filter(Boolean))
  ).sort()

  function toggleMonth(month) {
    if (selectedMonths.includes(month)) {
      onChange(selectedMonths.filter((item) => item !== month))
    } else {
      onChange([...selectedMonths, month].sort())
    }
  }

  function selectAll() {
    onChange(months)
  }

  function clearAll() {
    onChange([])
  }

  if (!months.length) return null

  return (
    <section className="month-filter">
      <div>
        <strong>月份筛选</strong>
        <span>选择后，全系统按所选月份重新计算</span>
      </div>

      <div className="month-filter-actions">
        {months.map((month) => (
          <button
            key={month}
            className={selectedMonths.includes(month) ? 'active' : ''}
            onClick={() => toggleMonth(month)}
          >
            {month}
          </button>
        ))}

        <button onClick={selectAll}>全选</button>
        <button onClick={clearAll}>清空</button>
      </div>
    </section>
  )
}

export default MonthFilter