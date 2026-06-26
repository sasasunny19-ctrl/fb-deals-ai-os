import { useState } from 'react'

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

function getMax(rows, key) {
  return Math.max(...rows.map((item) => Number(item[key] || 0)), 1)
}

function getGroupStatus(roas, gmv, score) {
  if (score >= 80) return '重点合作'
  if (roas >= 10 && gmv >= 3000) return '重点合作'
  if (roas >= 5) return '继续合作'
  if (roas >= 3) return '观察压价'
  return '暂停复盘'
}

function GroupCenter({ records }) {
  const [sortType, setSortType] = useState('gmv')

  const cleanRecords = records.filter((row) => TARGET_MONTHS.includes(row.month))

  const baseRows = groupBy(cleanRecords, 'group').map((item) => {
    const gmv = sum(item.items, 'gmv')
    const cost = sum(item.items, 'cost')
    const orders = sum(item.items, 'orders')
    const roas = cost > 0 ? gmv / cost : 0
    const skuCount = new Set(item.items.map((row) => row.sku).filter(Boolean)).size

    return {
      group: item.name,
      gmv,
      cost,
      orders,
      launches: item.items.length,
      skuCount,
      roas,
    }
  })

  const maxGMV = getMax(baseRows, 'gmv')
  const maxOrders = getMax(baseRows, 'orders')
  const maxLaunches = getMax(baseRows, 'launches')
  const maxSkuCount = getMax(baseRows, 'skuCount')

  const groupRows = baseRows.map((item) => {
    const gmvScore = (item.gmv / maxGMV) * 35
    const roasScore = (Math.min(item.roas, 50) / 50) * 35
    const ordersScore = (item.orders / maxOrders) * 15
    const launchScore = (item.launches / maxLaunches) * 10
    const skuScore = (item.skuCount / maxSkuCount) * 5

    const score = gmvScore + roasScore + ordersScore + launchScore + skuScore

    return {
      ...item,
      score,
      status: getGroupStatus(item.roas, item.gmv, score),
    }
  })

  const sortedRows = [...groupRows].sort((a, b) => {
    if (sortType === 'roas') return b.roas - a.roas
    if (sortType === 'orders') return b.orders - a.orders
    if (sortType === 'launches') return b.launches - a.launches
    if (sortType === 'skuCount') return b.skuCount - a.skuCount
    if (sortType === 'score') return b.score - a.score
    return b.gmv - a.gmv
  })

  const highRoasGroups = groupRows.filter((g) => g.roas >= 10)
  const problemGroups = groupRows.filter((g) => g.roas > 0 && g.roas < 3)
  const highScoreGroups = groupRows.filter((g) => g.score >= 80)
  const totalGMV = sum(groupRows, 'gmv')

  const sortButtons = [
    { key: 'gmv', label: '按GMV排序' },
    { key: 'roas', label: '按ROAS排序' },
    { key: 'orders', label: '按出单量排序' },
    { key: 'launches', label: '按投放次数排序' },
    { key: 'skuCount', label: '按合作SKU排序' },
    { key: 'score', label: '按综合评分排序' },
  ]

  return (
    <>
      <section className="page-title">
        <div>
          <h2>群组中心</h2>
          <p>按群组沉淀投放效果，识别优质群组、观察群组和低效群组</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>群组总数</p>
          <h3>{formatNumber(groupRows.length)}</h3>
          <span>1-5月有效群组</span>
        </div>

        <div className="quality-card">
          <p>群组总GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>1-5月口径</span>
        </div>

        <div className="quality-card warning">
          <p>ROAS≥10群组</p>
          <h3>{formatNumber(highRoasGroups.length)}</h3>
          <span>建议重点合作</span>
        </div>

        <div className="quality-card danger">
          <p>ROAS＜3群组</p>
          <h3>{formatNumber(problemGroups.length)}</h3>
          <span>建议暂停或压价</span>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>高综合评分群组</p>
          <h3>{formatNumber(highScoreGroups.length)}</h3>
          <span>评分≥80</span>
        </div>

        <div className="quality-card warning">
          <p>当前排序方式</p>
          <h3>
            {sortButtons
              .find((item) => item.key === sortType)
              ?.label.replace('按', '')
              .replace('排序', '')}
          </h3>
          <span>可切换排序维度</span>
        </div>

        <div className="quality-card">
          <p>综合评分逻辑</p>
          <h3>100分制</h3>
          <span>GMV + ROAS + 出单 + 投放</span>
        </div>

        <div className="quality-card">
          <p>主分析口径</p>
          <h3>1-5月</h3>
          <span>已排除异常月份</span>
        </div>
      </section>

      <section className="panel group-center-panel">
        <div className="panel-title group-panel-title">
          <div>
            <h3>群组表现排行榜</h3>
            <span>支持按GMV、ROAS、出单、投放次数、合作SKU、综合评分排序</span>
          </div>

          <div className="group-sort-buttons">
            {sortButtons.map((button) => (
              <button
                key={button.key}
                className={sortType === button.key ? 'active' : ''}
                onClick={() => setSortType(button.key)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        <div className="group-table-wrap">
          <table className="group-center-table">
            <colgroup>
              <col className="col-group-name" />
              <col className="col-gmv" />
              <col className="col-cost" />
              <col className="col-roas" />
              <col className="col-orders" />
              <col className="col-launches" />
              <col className="col-sku" />
              <col className="col-score" />
              <col className="col-status" />
            </colgroup>

            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
                <th>出单</th>
                <th>投放次数</th>
                <th>合作SKU</th>
                <th>综合评分</th>
                <th>系统建议</th>
              </tr>
            </thead>

            <tbody>
              {sortedRows.map((group) => (
                <tr key={group.group}>
                  <td className="group-name-cell" title={group.group}>
                    {group.group}
                  </td>
                  <td>{formatMoney(group.gmv)}</td>
                  <td>{formatMoney(group.cost)}</td>
                  <td>{formatNumber(group.roas)}</td>
                  <td>{formatNumber(group.orders)}</td>
                  <td>{formatNumber(group.launches)}</td>
                  <td>{formatNumber(group.skuCount)}</td>
                  <td>
                    <strong>{formatNumber(group.score)}</strong>
                  </td>
                  <td>
                    <span className={`status-pill ${group.status}`}>
                      {group.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default GroupCenter