import { useMemo, useState } from 'react'

const TARGET_MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05']

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

function getRecordStatus(row) {
  const roas = getRoas(row.gmv, row.cost)

  if (!row.date || row.month === '未标注') return '日期异常'
  if (!TARGET_MONTHS.includes(row.month)) return '非主口径'
  if (Number(row.gmv) > 0 && Number(row.cost) === 0) return '有GMV无花费'
  if (Number(row.cost) > 0 && Number(row.gmv) === 0) return '有花费无GMV'
  if (roas >= 10) return '高效投放'
  if (roas >= 5) return '正常投放'
  if (roas >= 3) return '观察投放'
  return '低效投放'
}

function CampaignCenter({ records }) {
  const [monthFilter, setMonthFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [keyword, setKeyword] = useState('')

  const recordsWithStatus = useMemo(() => {
    return records.map((row) => ({
      ...row,
      roas: getRoas(row.gmv, row.cost),
      status: getRecordStatus(row),
    }))
  }, [records])

  const monthOptions = useMemo(() => {
    const months = Array.from(new Set(recordsWithStatus.map((r) => r.month || '未标注')))
    return months.sort()
  }, [recordsWithStatus])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(recordsWithStatus.map((r) => r.status)))
  }, [recordsWithStatus])

  const filteredRecords = recordsWithStatus.filter((row) => {
    const matchMonth = monthFilter === 'all' || row.month === monthFilter
    const matchStatus = statusFilter === 'all' || row.status === statusFilter

    const text = `${row.sku || ''} ${row.group || ''} ${row.date || ''}`.toLowerCase()
    const matchKeyword = !keyword || text.includes(keyword.toLowerCase())

    return matchMonth && matchStatus && matchKeyword
  })

  const cleanRecords = recordsWithStatus.filter((row) => TARGET_MONTHS.includes(row.month))
  const highEfficiency = cleanRecords.filter((row) => row.roas >= 10)
  const lowEfficiency = cleanRecords.filter((row) => row.roas > 0 && row.roas < 3)
  const abnormalRecords = recordsWithStatus.filter((row) =>
    ['日期异常', '非主口径', '有GMV无花费', '有花费无GMV'].includes(row.status),
  )

  const totalGMV = cleanRecords.reduce((sum, row) => sum + Number(row.gmv || 0), 0)
  const totalCost = cleanRecords.reduce((sum, row) => sum + Number(row.cost || 0), 0)
  const totalOrders = cleanRecords.reduce((sum, row) => sum + Number(row.orders || 0), 0)
  const totalRoas = totalCost > 0 ? totalGMV / totalCost : 0

  return (
    <>
      <section className="page-title">
        <div>
          <h2>投放中心</h2>
          <p>查看每一条Deals合作明细，追踪SKU、群组、GMV、花费、ROAS和异常状态</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>有效投放记录</p>
          <h3>{formatNumber(cleanRecords.length)}</h3>
          <span>1-5月口径</span>
        </div>

        <div className="quality-card">
          <p>有效GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>清洗后数据</span>
        </div>

        <div className="quality-card">
          <p>整体ROAS</p>
          <h3>{formatNumber(totalRoas)}</h3>
          <span>GMV / 花费</span>
        </div>

        <div className="quality-card warning">
          <p>高效投放</p>
          <h3>{formatNumber(highEfficiency.length)}</h3>
          <span>ROAS ≥ 10</span>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>总出单</p>
          <h3>{formatNumber(totalOrders)}</h3>
          <span>1-5月有效记录</span>
        </div>

        <div className="quality-card danger">
          <p>低效投放</p>
          <h3>{formatNumber(lowEfficiency.length)}</h3>
          <span>ROAS ＜ 3</span>
        </div>

        <div className="quality-card danger">
          <p>异常记录</p>
          <h3>{formatNumber(abnormalRecords.length)}</h3>
          <span>需单独复查</span>
        </div>

        <div className="quality-card warning">
          <p>当前筛选结果</p>
          <h3>{formatNumber(filteredRecords.length)}</h3>
          <span>明细条数</span>
        </div>
      </section>

      <section className="panel campaign-panel">
        <div className="panel-title campaign-panel-title">
          <div>
            <h3>投放明细表</h3>
            <span>支持按月份、状态、SKU或群组关键词筛选</span>
          </div>

          <div className="campaign-filters">
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="all">全部月份</option>
              {monthOptions.map((month) => (
                <option value={month} key={month}>
                  {month}
                </option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">全部状态</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索SKU / 群组"
            />
          </div>
        </div>

        <div className="campaign-table-wrap">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>月份</th>
                <th>SKU</th>
                <th>群组</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
                <th>出单</th>
                <th>状态</th>
                <th>链接</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((row, index) => (
                <tr key={`${row.id || index}-${row.sku}-${row.group}`}>
                  <td>{row.date || '未标注'}</td>
                  <td>{row.month || '未标注'}</td>
                  <td>{row.sku || '未标注'}</td>
                  <td className="campaign-group-cell" title={row.group}>
                    {row.group || '未标注'}
                  </td>
                  <td>{formatMoney(row.gmv)}</td>
                  <td>{formatMoney(row.cost)}</td>
                  <td>{formatNumber(row.roas)}</td>
                  <td>{formatNumber(row.orders)}</td>
                  <td>
                    <span className={`status-pill ${row.status}`}>{row.status}</span>
                  </td>
                  <td>
                    {row.postLink ? (
                      <a href={row.postLink} target="_blank" rel="noreferrer">
                        查看
                      </a>
                    ) : (
                      '-'
                    )}
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

export default CampaignCenter