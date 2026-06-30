import KpiCard from '../../components/KpiCard'
import { products as mockProducts, groups as mockGroups } from '../../data/mockData'

const TARGET_MONTHS = [
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04',
  '2026-05',
]

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

function formatMonth(month) {
  const monthMap = {
    '2026-01': '1月',
    '2026-02': '2月',
    '2026-03': '3月',
    '2026-04': '4月',
    '2026-05': '5月',
  }

  return monthMap[month] || month
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

function getDataQuality(records, TARGET_MONTHS) {
  const noDateRecords = records.filter((row) => !row.date || row.month === '未标注')
  const outOfRangeRecords = records.filter(
    (row) => row.month && row.month !== '未标注' && !TARGET_MONTHS.includes(row.month),
  )
  const freeGmvRecords = records.filter((row) => Number(row.gmv) > 0 && Number(row.cost) === 0)
  const costNoGmvRecords = records.filter((row) => Number(row.cost) > 0 && Number(row.gmv) === 0)
  const noSkuRecords = records.filter((row) => !row.sku)
  const noGroupRecords = records.filter((row) => !row.group)

  return {
    noDateRecords,
    outOfRangeRecords,
    freeGmvRecords,
    costNoGmvRecords,
    noSkuRecords,
    noGroupRecords,
  }
}

function Dashboard({ records }) {
  const TARGET_MONTHS = [
  ...new Set(
    records
      .map((r) => r.month)
      .filter(Boolean)
      .sort()
  )
]
  const hasRealData = records.length > 0

  const cleanRecords = records
  const dataQuality = getDataQuality(records, TARGET_MONTHS)

  const totalGMV = sum(cleanRecords, 'gmv')
  const totalCost = sum(cleanRecords, 'cost')
  const totalOrders = sum(cleanRecords, 'orders')
  const totalROAS = totalCost > 0 ? totalGMV / totalCost : 0

  const kpis = hasRealData
    ? [
        { label: '当前筛选月份GMV', value: formatMoney(totalGMV), change: '已清洗数据' },
        { label: '当前筛选月份花费', value: formatMoney(totalCost), change: '已清洗数据' },
        { label: '整体ROAS', value: formatNumber(totalROAS), change: '当前筛选月份口径' },
        {
          label: '有效记录',
          value: formatNumber(cleanRecords.length),
          change: `出单 ${formatNumber(totalOrders)}`,
        },
      ]
    : [
        { label: '本月GMV', value: '$289,681.85', change: '+18.6%' },
        { label: '本月花费', value: '$29,030.39', change: '+7.2%' },
        { label: '整体ROAS', value: '9.98', change: '-1.4%' },
        { label: '投放次数', value: '2,425', change: '+12.5%' },
      ]

  const productRank = hasRealData
    ? getRank(cleanRecords, 'sku').slice(0, 10)
    : mockProducts.map((p) => ({
        name: p.sku,
        gmv: p.gmv,
        roas: p.roas,
        status: p.status,
      }))

  const groupRank = hasRealData
    ? getRank(cleanRecords, 'group').slice(0, 10)
    : mockGroups.map((g) => ({
        name: g.name,
        gmv: g.gmv,
        roas: g.roas,
        status: g.status,
      }))

  const monthRank = hasRealData
    ? TARGET_MONTHS.map((month) => {
        const rows = cleanRecords.filter((row) => row.month === month)
        const gmv = sum(rows, 'gmv')
        const cost = sum(rows, 'cost')

        return {
          name: month,
          label: formatMonth(month),
          gmv,
          cost,
          roas: cost > 0 ? gmv / cost : 0,
        }
      })
    : []

  const maxGMV = Math.max(...monthRank.map((m) => m.gmv), 1)

  return (
    <>
      <section className="kpi-grid">
        {kpis.map((item) => (
          <KpiCard item={item} key={item.label} />
        ))}
      </section>

      {hasRealData && (
        <section className="quality-grid">
          <div className="quality-card">
            <p>总导入记录</p>
            <h3>{formatNumber(records.length)}</h3>
            <span>Excel原始识别</span>
          </div>

          <div className="quality-card warning">
            <p>非当前筛选月份记录</p>
            <h3>{formatNumber(dataQuality.outOfRangeRecords.length)}</h3>
            <span>不进入主看板</span>
          </div>

          <div className="quality-card warning">
            <p>未标注日期</p>
            <h3>{formatNumber(dataQuality.noDateRecords.length)}</h3>
            <span>需检查发布时间</span>
          </div>

          <div className="quality-card danger">
            <p>有GMV无花费</p>
            <h3>{formatNumber(dataQuality.freeGmvRecords.length)}</h3>
            <span>影响ROAS判断</span>
          </div>
        </section>
      )}

      <section className="analysis-grid">
        <div className="panel large">
          <div className="panel-title">
            <h3>月度GMV趋势</h3>
            <span>{hasRealData ? '仅统计当前筛选月份有效数据' : '演示数据'}</span>
          </div>

          {hasRealData ? (
            <>
              <div className="fake-chart clean-chart">
                {monthRank.map((item) => {
                  const height = item.gmv > 0 ? `${(item.gmv / maxGMV) * 90}%` : '2%'

                  return (
                    <div
                      key={item.name}
                      style={{ height }}
                      title={`${item.label} GMV：${formatMoney(item.gmv)}`}
                    ></div>
                  )
                })}
              </div>

              <div className="chart-labels month-labels">
                {monthRank.map((item) => (
                  <span key={item.name}>{item.label}</span>
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
            <span>{hasRealData ? '根据清洗后数据' : '演示'}</span>
          </div>

          <div className="ai-box">
            <p>
              {hasRealData
                ? `本次导入 ${records.length} 条投放记录，其中 ${cleanRecords.length} 条进入当前筛选月份主看板。清洗后总GMV为 ${formatMoney(totalGMV)}，整体ROAS为 ${formatNumber(totalROAS)}。建议优先加码ROAS较高且GMV稳定的产品，同时暂停或压价低ROAS群组。`
                : '本月GMV整体表现较好，但部分群组ROAS偏低。建议下月采用 70 / 20 / 10 策略：70%资源给高ROAS成熟款，20%资源测试潜力款，10%资源保留给新品。'}
            </p>
          </div>

          <ul className="todo-list">
            <li>重点加码 ROAS ≥ 10 的产品</li>
            <li>暂停 ROAS ＜ 3 的群组</li>
            <li>优先复盘高花费低GMV资源</li>
            <li>异常日期和0花费记录单独复查</li>
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