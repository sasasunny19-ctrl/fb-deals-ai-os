import { useMemo, useState } from 'react'

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

function TrackingCenter({ records }) {
  const [keyword, setKeyword] = useState('')

  const rows = useMemo(() => {
    return records.map((row, index) => {
      const roas = getRoas(row.gmv, row.cost)

      return {
        id: row.id || index,
        tracking: row.tracking || row.trackingId || `TRACK-${index + 1}`,
        date: row.date || '未标注',
        sku: row.sku || '未标注',
        group: row.group || '未标注',
        link: row.postLink || '',
        gmv: Number(row.gmv || 0),
        cost: Number(row.cost || 0),
        orders: Number(row.orders || 0),
        roas,
        status:
          roas >= 10
            ? '高效Tracking'
            : roas >= 5
              ? '正常Tracking'
              : roas >= 3
                ? '观察Tracking'
                : '低效Tracking',
      }
    })
  }, [records])

  const filteredRows = rows.filter((row) => {
    const text = `${row.tracking} ${row.sku} ${row.group} ${row.status}`.toLowerCase()
    return !keyword || text.includes(keyword.toLowerCase())
  })

  const totalGMV = filteredRows.reduce((sum, row) => sum + row.gmv, 0)
  const totalCost = filteredRows.reduce((sum, row) => sum + row.cost, 0)
  const totalRoas = totalCost > 0 ? totalGMV / totalCost : 0

  return (
    <>
      <section className="page-title">
        <div>
          <h2>Tracking中心</h2>
          <p>按Tracking维度追踪每条合作效果，链接统一显示为“查看”</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>Tracking记录</p>
          <h3>{formatNumber(filteredRows.length)}</h3>
          <span>当前筛选结果</span>
        </div>

        <div className="quality-card">
          <p>Tracking GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>筛选后汇总</span>
        </div>

        <div className="quality-card">
          <p>Tracking 花费</p>
          <h3>{formatMoney(totalCost)}</h3>
          <span>筛选后汇总</span>
        </div>

        <div className="quality-card warning">
          <p>Tracking ROAS</p>
          <h3>{formatNumber(totalRoas)}</h3>
          <span>GMV / 花费</span>
        </div>
      </section>

      <section className="panel campaign-panel">
        <div className="panel-title campaign-panel-title">
          <div>
            <h3>Tracking明细表</h3>
            <span>已删除月份列，长链接收纳为“查看”，减少表格空白</span>
          </div>

          <div className="campaign-filters">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索Tracking / SKU / 群组"
            />
          </div>
        </div>

        <div className="campaign-table-wrap">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Tracking</th>
                <th>链接</th>
                <th>日期</th>
                <th>SKU</th>
                <th>群组</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
                <th>出单</th>
                <th>状态</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.tracking}</td>
                  <td>
                    {row.link ? (
                      <a href={row.link} target="_blank" rel="noreferrer">
                        查看
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{row.date}</td>
                  <td>{row.sku}</td>
                  <td className="campaign-group-cell" title={row.group}>
                    {row.group}
                  </td>
                  <td>{formatMoney(row.gmv)}</td>
                  <td>{formatMoney(row.cost)}</td>
                  <td>{formatNumber(row.roas)}</td>
                  <td>{formatNumber(row.orders)}</td>
                  <td>
                    <span className={`status-pill ${row.status}`}>
                      {row.status}
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

export default TrackingCenter