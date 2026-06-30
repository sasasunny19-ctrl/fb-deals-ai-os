

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
        launches: item.items.length,
      }
    })
    .sort((a, b) => b.gmv - a.gmv)
}

function ReportCenter({ records = [] }) {
  const cleanRecords = records
  const totalGMV = sum(cleanRecords, 'gmv')
  const totalCost = sum(cleanRecords, 'cost')
  const totalOrders = sum(cleanRecords, 'orders')
  const totalRoas = totalCost > 0 ? totalGMV / totalCost : 0

  const productRank = getRank(cleanRecords, 'sku')
  const groupRank = getRank(cleanRecords, 'group')

  const topProducts = productRank.slice(0, 8)
  const topGroups = groupRank.slice(0, 8)

  const highRoasProducts = productRank.filter((item) => item.roas >= 10 && item.gmv >= 1000)
  const problemProducts = productRank.filter((item) => item.roas > 0 && item.roas < 3)

  const highRoasGroups = groupRank.filter((item) => item.roas >= 10 && item.gmv >= 1000)
  const problemGroups = groupRank.filter((item) => item.roas > 0 && item.roas < 3)

  const monthRank = getRank(cleanRecords, 'month')

  const reportText = `FB Deals 当前筛选月份运营月报

一、整体数据
当前筛选月份累计GMV：${formatMoney(totalGMV)}
累计花费：${formatMoney(totalCost)}
累计出单：${formatNumber(totalOrders)}
整体ROAS：${formatNumber(totalRoas)}

二、月度表现
${monthRank
  .map(
    (item) =>
      `${item.name}：GMV ${formatMoney(item.gmv)}，花费 ${formatMoney(
        item.cost
      )}，ROAS ${formatNumber(item.roas)}，出单 ${formatNumber(item.orders)}`
  )
  .join('\n')}

三、优质产品
${highRoasProducts.length > 0
  ? highRoasProducts
      .slice(0, 10)
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}：GMV ${formatMoney(
            item.gmv
          )}，ROAS ${formatNumber(item.roas)}`
      )
      .join('\n')
  : '暂无符合 GMV≥1000 且 ROAS≥10 的产品。'}

四、优质群组
${highRoasGroups.length > 0
  ? highRoasGroups
      .slice(0, 10)
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}：GMV ${formatMoney(
            item.gmv
          )}，ROAS ${formatNumber(item.roas)}`
      )
      .join('\n')
  : '暂无符合 GMV≥1000 且 ROAS≥10 的群组。'}

五、风险产品
${problemProducts.length > 0
  ? problemProducts
      .slice(0, 10)
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}：GMV ${formatMoney(
            item.gmv
          )}，ROAS ${formatNumber(item.roas)}`
      )
      .join('\n')
  : '暂无明显 ROAS＜3 的风险产品。'}

六、风险群组
${problemGroups.length > 0
  ? problemGroups
      .slice(0, 10)
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}：GMV ${formatMoney(
            item.gmv
          )}，ROAS ${formatNumber(item.roas)}`
      )
      .join('\n')
  : '暂无明显 ROAS＜3 的风险群组。'}

七、下月建议
1. 继续加码高GMV、高ROAS产品，优先保证成熟款资源。
2. 对ROAS＜3的产品和群组进行暂停、压价或复盘。
3. 建议采用70/20/10资源策略：70%投入成熟高效资源，20%用于潜力款继续测试，10%保留给新品和临时爆款。
4. 群组合作建议建立分层：重点合作、继续合作、观察压价、暂停复盘。`

  function copyReport() {
    navigator.clipboard.writeText(reportText)
    alert('月报已复制')
  }
  function downloadReport() {
  const blob = new Blob([reportText], {
    type: 'text/plain;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'FB-Deals-当前筛选月份运营月报.txt'
  link.click()

  URL.revokeObjectURL(url)
}

  return (
    <>
      <section className="page-title">
        <div>
          <h2>月报中心</h2>
          <p>自动汇总当前筛选月份GMV、ROAS、产品排行、群组排行和下月建议</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>累计GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>当前筛选月份口径</span>
        </div>

        <div className="quality-card">
          <p>累计花费</p>
          <h3>{formatMoney(totalCost)}</h3>
          <span>投放成本</span>
        </div>

        <div className="quality-card warning">
          <p>整体ROAS</p>
          <h3>{formatNumber(totalRoas)}</h3>
          <span>GMV / 花费</span>
        </div>

        <div className="quality-card">
          <p>累计出单</p>
          <h3>{formatNumber(totalOrders)}</h3>
          <span>订单量</span>
        </div>
      </section>

      <section className="analysis-grid">
        <div className="panel">
          <div className="panel-title">
            <h3>月度表现</h3>
            <span>按月份汇总</span>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>月份</th>
                <th>GMV</th>
                <th>花费</th>
                <th>ROAS</th>
                <th>出单</th>
              </tr>
            </thead>
            <tbody>
              {monthRank.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
                  <td>{formatMoney(item.cost)}</td>
                  <td>{formatNumber(item.roas)}</td>
                  <td>{formatNumber(item.orders)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>月报文案</h3>
            <span>可复制汇报</span>
          </div>

          <textarea className="ai-report-text" value={reportText} readOnly />

          <div className="report-actions">
  <button className="copy-button" onClick={copyReport}>
    复制月报
  </button>

  <button className="download-button" onClick={downloadReport}>
    下载TXT月报
  </button>
</div>
        </div>
      </section>

      <section className="table-grid">
        <div className="panel">
          <h3>Top 产品</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>GMV</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
                  <td>{formatNumber(item.roas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Top 群组</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {topGroups.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.gmv)}</td>
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

export default ReportCenter