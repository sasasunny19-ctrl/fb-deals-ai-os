import KpiCard from '../../components/KpiCard'
import { products as mockProducts, groups as mockGroups } from '../../data/mockData'

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
        roas,
        status:
          roas >= 10
            ? '重点加码'
            : roas >= 5
              ? '继续测试'
              : roas >= 3
                ? '观察压价'
                : '暂停复盘',
      }
    })
    .sort((a, b) => b.gmv - a.gmv)
}

function Dashboard({ records }) {
  const hasRealData = records.length > 0

  const totalGMV = sum(records, 'gmv')
  const totalCost = sum(records, 'cost')
  const totalOrders = sum(records, 'orders')
  const totalROAS = totalCost > 0 ? totalGMV / totalCost : 0

  const kpis = hasRealData
    ? [
        { label: '总GMV', value: formatMoney(totalGMV), change: '真实数据' },
        { label: '总花费', value: formatMoney(totalCost), change: '真实数据' },
        { label: '整体ROAS', value: formatNumber(totalROAS), change: '真实数据' },
        { label: '投放记录', value: formatNumber(records.length), change: `出单 ${formatNumber(totalOrders)}` },
      ]
    : [
        { label: '本月GMV', value: '$289,681.85', change: '+18.6%' },
        { label: '本月花费', value: '$29,030.39', change: '+7.2%' },
        { label: '整体ROAS', value: '9.98', change: '-1.4%' },
        { label: '投放次数', value: '2,425', change: '+12.5%' },
      ]

  const productRank = hasRealData
    ? getRank(records, 'sku').slice(0, 8)
    : mockProducts.map((p) => ({
        name: p.sku,
        gmv: p.gmv,
        roas: p.roas,
        status: p.status,
      }))

  const groupRank = hasRealData
    ? getRank(records, 'group').slice(0, 8)
    : mockGroups.map((g) => ({
        name: g.name,
        gmv: g.gmv,
        roas: g.roas,
        status: g.status,
      }))

  const monthRank = hasRealData
    ? getRank(records, 'month').sort((a, b) => a.name.localeCompare(b.name))
    : []

  return (
    <>
      <section className="kpi-grid">
        {kpis.map((item) => (
          <KpiCard item={item} key={item.label} />
        ))}
      </section>

      <section className="analysis-grid">
        <div className="panel large">
          <div className="panel-title">
            <h3>月度GMV趋势</h3>
            <span>{hasRealData ? '真实导入数据' : '演示数据'}</span>
          </div>

          {hasRealData ? (
            <>
              <div className="fake-chart">
                {monthRank.map((item) => {
                  const maxGMV = Math.max(...monthRank.map((m) => m.gmv))
                  const height = maxGMV > 0 ? `${(item.gmv / maxGMV) * 90}%` : '0%'

                  return <div key={item.name} style={{ height }}></div>
                })}
              </div>

              <div className="chart-labels">
                {monthRank.map((item) => (
                  <span key={item.name}>{item.name}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="fake-chart">
                <div style={{ height: '38%' }}></div>
                <div style={{ height: '52%' }}></div>
                <div style={{ height: '76%' }}></div>
                <div style={{ height: '64%' }}></div>
                <div style={{ height: '88%' }}></div>
              </div>

              <div className="chart-labels">
                <span>1月</span>
                <span>2月</span>
                <span>3月</span>
                <span>4月</span>
                <span>5月</span>
              </div>
            </>
          )}
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>AI运营建议</h3>
            <span>{hasRealData ? '根据真实数据' : '演示'}</span>
          </div>

          <div className="ai-box">
            <p>
              {hasRealData
                ? `本次导入 ${records.length} 条投放记录，总GMV为 ${formatMoney(totalGMV)}，整体ROAS为 ${formatNumber(totalROAS)}。建议优先加码ROAS较高且GMV稳定的产品，同时暂停或压价低ROAS群组。`
                : '本月GMV整体表现较好，但部分群组ROAS偏低。建议下月采用 70 / 20 / 10 策略：70%资源给高ROAS成熟款，20%资源测试潜力款，10%资源保留给新品。'}
            </p>
          </div>

          <ul className="todo-list">
            <li>重点加码 ROAS ≥ 10 的产品</li>
            <li>暂停 ROAS ＜ 3 的群组</li>
            <li>优先复盘高花费低GMV资源</li>
            <li>建立产品生命周期标签</li>
          </ul>
        </div>
      </section>

      <section className="table-grid">
        <div className="panel">
          <h3>Top 产品</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>GMV</th>
                <th>ROAS</th>
                <th>建议</th>
              </tr>
            </thead>
            <tbody>
              {productRank.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{typeof p.gmv === 'number' ? formatMoney(p.gmv) : p.gmv}</td>
                  <td>{typeof p.roas === 'number' ? formatNumber(p.roas) : p.roas}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Top 群组</h3>
          <table>
            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>ROAS</th>
                <th>建议</th>
              </tr>
            </thead>
            <tbody>
              {groupRank.map((g) => (
                <tr key={g.name}>
                  <td>{g.name}</td>
                  <td>{typeof g.gmv === 'number' ? formatMoney(g.gmv) : g.gmv}</td>
                  <td>{typeof g.roas === 'number' ? formatNumber(g.roas) : g.roas}</td>
                  <td>{g.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default Dashboard