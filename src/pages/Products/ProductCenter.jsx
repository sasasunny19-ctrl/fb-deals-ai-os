import { useState } from 'react'
import DataTable from '../../components/DataTable'



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

function getProductStatus(roas, gmv, score) {
  if (score >= 80) return '重点加码'
  if (roas >= 10 && gmv >= 3000) return '重点加码'
  if (roas >= 5) return '继续测试'
  if (roas >= 3) return '观察压价'
  return '暂停复盘'
}

function getMax(rows, key) {
  return Math.max(...rows.map((item) => Number(item[key] || 0)), 1)
}

function ProductCenter({ records }) {
  const [sortType, setSortType] = useState('gmv')

  const cleanRecords = records

  const baseRows = groupBy(cleanRecords, 'sku').map((item) => {
    const gmv = sum(item.items, 'gmv')
    const cost = sum(item.items, 'cost')
    const orders = sum(item.items, 'orders')
    const roas = cost > 0 ? gmv / cost : 0

    return {
      sku: item.name,
      gmv,
      cost,
      orders,
      launches: item.items.length,
      roas,
    }
  })

  const maxGMV = getMax(baseRows, 'gmv')
  const maxOrders = getMax(baseRows, 'orders')
  const maxLaunches = getMax(baseRows, 'launches')

  const productRows = baseRows.map((item) => {
    const gmvScore = (item.gmv / maxGMV) * 35
    const roasScore = (Math.min(item.roas, 50) / 50) * 35
    const ordersScore = (item.orders / maxOrders) * 20
    const launchScore = (item.launches / maxLaunches) * 10

    const score = gmvScore + roasScore + ordersScore + launchScore

    return {
      ...item,
      score,
      status: getProductStatus(item.roas, item.gmv, score),
    }
  })

  const sortedRows = [...productRows].sort((a, b) => {
    if (sortType === 'roas') return b.roas - a.roas
    if (sortType === 'orders') return b.orders - a.orders
    if (sortType === 'launches') return b.launches - a.launches
    if (sortType === 'score') return b.score - a.score
    return b.gmv - a.gmv
  })

  const highRoasProducts = productRows.filter((p) => p.roas >= 10)
  const problemProducts = productRows.filter((p) => p.roas > 0 && p.roas < 3)
  const highScoreProducts = productRows.filter((p) => p.score >= 80)
  const totalGMV = sum(productRows, 'gmv')

  const sortButtons = [
    { key: 'gmv', label: '按GMV排序' },
    { key: 'roas', label: '按ROAS排序' },
    { key: 'orders', label: '按出单量排序' },
    { key: 'launches', label: '按投放次数排序' },
    { key: 'score', label: '按综合评分排序' },
  ]

  const columns = [
    { key: 'sku', title: 'SKU', width: 120 },
    {
      key: 'gmv',
      title: 'GMV',
      width: 120,
      render: (v) => formatMoney(v),
    },
    {
      key: 'cost',
      title: '花费',
      width: 120,
      render: (v) => formatMoney(v),
    },
    {
      key: 'roas',
      title: 'ROAS',
      width: 90,
      render: (v) => formatNumber(v),
    },
    {
      key: 'orders',
      title: '出单',
      width: 90,
      render: (v) => formatNumber(v),
    },
    {
      key: 'launches',
      title: '投放',
      width: 90,
      render: (v) => formatNumber(v),
    },
    {
      key: 'score',
      title: '评分',
      width: 90,
      render: (v) => <strong>{formatNumber(v)}</strong>,
    },
    {
      key: 'status',
      title: '建议',
      width: 130,
      render: (v) => (
        <span className={`status-pill ${v}`}>{v}</span>
      ),
    },
  ]

  return (
    <>
      <section className="page-title">
        <div>
          <h2>产品中心</h2>
          <p>按SKU沉淀产品表现，识别重点款、潜力款和问题款</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>产品总数</p>
          <h3>{formatNumber(productRows.length)}</h3>
          <span>当前筛选月份有效SKU</span>
        </div>

        <div className="quality-card">
          <p>产品总GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>当前筛选月份口径</span>
        </div>

        <div className="quality-card warning">
          <p>ROAS≥10产品</p>
          <h3>{formatNumber(highRoasProducts.length)}</h3>
          <span>建议重点加码</span>
        </div>

        <div className="quality-card danger">
          <p>ROAS＜3产品</p>
          <h3>{formatNumber(problemProducts.length)}</h3>
          <span>建议暂停复盘</span>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>高综合评分产品</p>
          <h3>{formatNumber(highScoreProducts.length)}</h3>
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
          <h3>当前筛选月份</h3>
          <span>已排除异常月份</span>
        </div>
      </section>

      <section className="panel product-table-panel">
        <div className="panel-title product-panel-title">
          <div>
            <h3>产品表现排行榜</h3>
            <span>支持按GMV、ROAS、出单、投放次数、综合评分排序</span>
          </div>

          <div className="sort-buttons">
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

        <DataTable
          columns={columns}
          data={sortedRows}
          rowKey="sku"
        />
      </section>
    </>
  )
}

export default ProductCenter