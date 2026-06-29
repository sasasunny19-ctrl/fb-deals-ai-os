const TARGET_MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05']

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0)
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}

function groupBy(rows, key) {
  const map = {}

  rows.forEach((row) => {
    const value = row[key] || '未标注'
    if (!map[value]) map[value] = []
    map[value].push(row)
  })

  return Object.entries(map).map(([name, items]) => ({
    name,
    items,
  }))
}

function getRank(rows, key) {
  return groupBy(rows, key)
    .map((item) => {
      const gmv = sum(item.items, 'gmv')
      const cost = sum(item.items, 'cost')
      const orders = sum(item.items, 'orders')
      const roas = cost > 0 ? gmv / cost : 0

      return {
        name: item.name,
        gmv,
        cost,
        orders,
        launches: item.items.length,
        roas,
      }
    })
    .sort((a, b) => b.gmv - a.gmv)
}

function getMonthLabel(month) {
  return {
    '2026-01': '1月',
    '2026-02': '2月',
    '2026-03': '3月',
    '2026-04': '4月',
    '2026-05': '5月',
  }[month] || month
}

function AnalyticsCenter({ records }) {
  const cleanRecords = records.filter((row) => TARGET_MONTHS.includes(row.month))

  const totalGMV = sum(cleanRecords, 'gmv')
  const totalCost = sum(cleanRecords, 'cost')
  const totalOrders = sum(cleanRecords, 'orders')
  const totalRoas = totalCost > 0 ? totalGMV / totalCost : 0

  const productRank = getRank(cleanRecords, 'sku')
  const groupRank = getRank(cleanRecords, 'group')

  const highRoasProducts = productRank.filter((item) => item.roas >= 10).slice(0, 8)
  const lowRoasProducts = productRank.filter((item) => item.roas > 0 && item.roas < 3).slice(0, 8)

  const highRoasGroups = groupRank.filter((item) => item.roas >= 10).slice(0, 8)
  const lowRoasGroups = groupRank.filter((item) => item.roas > 0 && item.roas < 3).slice(0, 8)

  const monthRows = TARGET_MONTHS.map((month) => {
    const rows = cleanRecords.filter((row) => row.month === month)
    const gmv = sum(rows, 'gmv')
    const cost = sum(rows, 'cost')
    const roas = cost > 0 ? gmv / cost : 0

    return {
      month,
      label: getMonthLabel(month),
      gmv,
      cost,
      roas,
      records: rows.length,
    }
  })

  const bestMonth = [...monthRows].sort((a, b) => b.gmv - a.gmv)[0]
  const bestRoasMonth = [...monthRows].sort((a, b) => b.roas - a.roas)[0]

  return (
    <>
      <section className="page-title">
        <div>
          <h2>数据分析</h2>
          <p>集中分析产品、群组、月份与资源效率，为下月投放决策提供依据</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>1-5月GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>有效数据口径</span>
        </div>

        <div className="quality-card">
          <p>1-5月花费</p>
          <h3>{formatMoney(totalCost)}</h3>
          <span>有效数据口径</span>
        </div>

        <div className="quality-card warning">
          <p>整体ROAS</p>
          <h3>{formatNumber(totalRoas)}</h3>
          <span>GMV / 花费</span>
        </div>

        <div className="quality-card">
          <p>总出单</p>
          <h3>{formatNumber(totalOrders)}</h3>
          <span>1-5月有效记录</span>
        </div>
      </section>

      <section className="analysis-grid">
        <div className="panel">
          <div className="panel-title">
            <h3>月度表现</h3>
            <span>GMV / 花费 / ROAS</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>月份</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
                <th>记录数</th>
              </tr>
            </thead>

            <tbody>
              {monthRows.map((row) => (
                <tr key={row.month}>
                  <td>{row.label}</td>
                  <td>{formatMoney(row.gmv)}</td>
                  <td>{formatMoney(row.cost)}</td>
                  <td>{formatNumber(row.roas)}</td>
                  <td>{formatNumber(row.records)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>AI分析结论</h3>
            <span>自动生成</span>
          </div>

          <div className="ai-box">
            <p>
              1-5月总GMV为 <strong>{formatMoney(totalGMV)}</strong>，
              整体ROAS为 <strong>{formatNumber(totalRoas)}</strong>。
              GMV最高月份为 <strong>{bestMonth?.label}</strong>，
              ROAS最高月份为 <strong>{bestRoasMonth?.label}</strong>。
              下月建议优先加码高ROAS产品和高GMV稳定群组，同时暂停ROAS低于3的资源。
            </p>
          </div>

          <ul className="todo-list">
            <li>保留高GMV高ROAS资源池</li>
            <li>复盘高GMV但ROAS偏低产品</li>
            <li>暂停连续低效群组</li>
            <li>建立产品 × 群组匹配表</li>
          </ul>
        </div>
      </section>

      <section className="table-grid">
        <div className="panel">
          <h3>高效产品 TOP</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
              </tr>
            </thead>

            <tbody>
              {highRoasProducts.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
                  <td>{formatMoney(item.cost)}</td>
                  <td>{formatNumber(item.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>高效群组 TOP</h3>
          <table>
            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
              </tr>
            </thead>

            <tbody>
              {highRoasGroups.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
                  <td>{formatMoney(item.cost)}</td>
                  <td>{formatNumber(item.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-grid">
        <div className="panel">
          <h3>低效产品预警</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
              </tr>
            </thead>

            <tbody>
              {lowRoasProducts.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
                  <td>{formatMoney(item.cost)}</td>
                  <td>{formatNumber(item.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>低效群组预警</h3>
          <table>
            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
              </tr>
            </thead>

            <tbody>
              {lowRoasGroups.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
                  <td>{formatMoney(item.cost)}</td>
                  <td>{formatNumber(item.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default AnalyticsCenter