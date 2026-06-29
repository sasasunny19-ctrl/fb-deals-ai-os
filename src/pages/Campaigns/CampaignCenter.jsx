import { useMemo, useState } from 'react'
import DataTable from '../../components/DataTable'

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

function getRoas(gmv, cost) {
  return Number(cost) > 0 ? Number(gmv || 0) / Number(cost || 0) : 0
}

function getStatus(row) {
  const roas = getRoas(row.gmv, row.cost)

  if (!row.date || row.month === '未标注') return '日期异常'
  if (Number(row.gmv) > 0 && Number(row.cost) === 0) return '有GMV无花费'
  if (Number(row.cost) > 0 && Number(row.gmv) === 0) return '有花费无GMV'
  if (roas >= 10) return '高效投放'
  if (roas >= 5) return '正常投放'
  if (roas >= 3) return '观察投放'
  return '低效投放'
}

function CampaignCenter({ records }) {
  const [keyword, setKeyword] = useState('')
  const [month, setMonth] = useState('all')

  const rows = useMemo(() => {
    return records.map((row, index) => ({
      id: row.id || index,
      date: row.date || '未标注',
      month: row.month || '未标注',
      sku: row.sku || '未标注',
      group: row.group || '未标注',
      gmv: Number(row.gmv || 0),
      cost: Number(row.cost || 0),
      orders: Number(row.orders || 0),
      postLink: row.postLink || '',
      roas: getRoas(row.gmv, row.cost),
      status: getStatus(row),
    }))
  }, [records])

  const monthOptions = Array.from(new Set(rows.map((row) => row.month))).sort()

  const filteredRows = rows.filter((row) => {
    const matchMonth = month === 'all' || row.month === month
    const text = `${row.sku} ${row.group} ${row.date} ${row.status}`.toLowerCase()
    const matchKeyword = !keyword || text.includes(keyword.toLowerCase())
    return matchMonth && matchKeyword
  })

  const totalGMV = filteredRows.reduce((sum, row) => sum + row.gmv, 0)
  const totalCost = filteredRows.reduce((sum, row) => sum + row.cost, 0)
  const totalOrders = filteredRows.reduce((sum, row) => sum + row.orders, 0)
  const totalRoas = totalCost > 0 ? totalGMV / totalCost : 0

  const columns = [
    { key: 'date', title: '日期', width: 110 },
    { key: 'month', title: '月份', width: 90 },
    { key: 'sku', title: 'SKU', width: 140 },
    { key: 'group', title: '群组', width: 260 },
    { key: 'gmv', title: 'GMV', width: 120, render: (v) => formatMoney(v) },
    { key: 'cost', title: '花费', width: 110, render: (v) => formatMoney(v) },
    { key: 'roas', title: 'ROAS', width: 90, render: (v) => formatNumber(v) },
    { key: 'orders', title: '出单', width: 90, render: (v) => formatNumber(v) },
    {
      key: 'status',
      title: '状态',
      width: 130,
      render: (v) => <span className={`status-pill ${v}`}>{v}</span>,
    },
    {
      key: 'postLink',
      title: '链接',
      width: 90,
      render: (v) =>
        v ? (
          <a href={v} target="_blank" rel="noreferrer">查看</a>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <>
      <section className="page-title">
        <div>
          <h2>投放中心</h2>
          <p>按每条合作记录查看SKU、群组、GMV、花费、出单和自动计算ROAS</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>当前记录数</p>
          <h3>{formatNumber(filteredRows.length)}</h3>
          <span>按筛选结果</span>
        </div>

        <div className="quality-card">
          <p>当前GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>筛选后汇总</span>
        </div>

        <div className="quality-card">
          <p>当前花费</p>
          <h3>{formatMoney(totalCost)}</h3>
          <span>筛选后汇总</span>
        </div>

        <div className="quality-card warning">
          <p>当前ROAS</p>
          <h3>{formatNumber(totalRoas)}</h3>
          <span>GMV / 花费</span>
        </div>
      </section>

      <section className="panel campaign-panel">
        <div className="panel-title campaign-panel-title">
          <div>
            <h3>投放明细表</h3>
            <span>ROAS由系统自动计算，不依赖Excel原始ROAS列</span>
          </div>

          <div className="campaign-filters">
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">全部月份</option>
              {monthOptions.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索SKU / 群组 / 状态"
            />
          </div>
        </div>

        <DataTable columns={columns} data={filteredRows} rowKey="id" />
      </section>
    </>
  )
}

export default CampaignCenter