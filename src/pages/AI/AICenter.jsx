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

function AICenter({ records }) {
  const cleanRecords = records.filter((row) => TARGET_MONTHS.includes(row.month))

  const totalGMV = sum(cleanRecords, 'gmv')
  const totalCost = sum(cleanRecords, 'cost')
  const totalOrders = sum(cleanRecords, 'orders')
  const totalRoas = totalCost > 0 ? totalGMV / totalCost : 0

  const productRank = getRank(cleanRecords, 'sku')
  const groupRank = getRank(cleanRecords, 'group')

  const scaleProducts = productRank
    .filter((item) => item.roas >= 10 && item.gmv >= 3000)
    .slice(0, 8)

  const stopProducts = productRank
    .filter((item) => item.roas > 0 && item.roas < 3)
    .slice(0, 8)

  const scaleGroups = groupRank
    .filter((item) => item.roas >= 10 && item.gmv >= 3000)
    .slice(0, 8)

  const stopGroups = groupRank
    .filter((item) => item.roas > 0 && item.roas < 3)
    .slice(0, 8)

  const reportText = `FB Deals 1-5月运营复盘：

1. 整体表现
1-5月累计GMV为 ${formatMoney(totalGMV)}，累计花费为 ${formatMoney(totalCost)}，整体ROAS为 ${formatNumber(totalRoas)}，累计出单 ${formatNumber(totalOrders)}。

2. 重点加码方向
建议优先加码 GMV较高且ROAS≥10 的产品与群组。当前重点产品包括：${scaleProducts
    .map((item) => item.name)
    .join('、') || '暂无'}。
当前重点群组包括：${scaleGroups.map((item) => item.name).join('、') || '暂无'}。

3. 风险资源
建议暂停或压价复盘 ROAS＜3 的产品与群组。当前问题产品包括：${stopProducts
    .map((item) => item.name)
    .join('、') || '暂无'}。
当前问题群组包括：${stopGroups.map((item) => item.name).join('、') || '暂无'}。

4. 下月策略
建议采用 70 / 20 / 10 资源策略：70%预算投入高GMV高ROAS成熟款，20%预算用于潜力款继续测试，10%预算保留给新品和临时爆款。`

  function copyReport() {
    navigator.clipboard.writeText(reportText)
    alert('AI复盘文案已复制')
  }

  return (
    <>
      <section className="page-title">
        <div>
          <h2>AI决策中心</h2>
          <p>基于真实投放数据自动生成运营结论、加码建议、风险预警和月度复盘文案</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>清洗后GMV</p>
          <h3>{formatMoney(totalGMV)}</h3>
          <span>1-5月主口径</span>
        </div>

        <div className="quality-card">
          <p>整体ROAS</p>
          <h3>{formatNumber(totalRoas)}</h3>
          <span>GMV / 花费</span>
        </div>

        <div className="quality-card warning">
          <p>建议加码产品</p>
          <h3>{formatNumber(scaleProducts.length)}</h3>
          <span>GMV高且ROAS≥10</span>
        </div>

        <div className="quality-card danger">
          <p>风险产品</p>
          <h3>{formatNumber(stopProducts.length)}</h3>
          <span>ROAS＜3</span>
        </div>
      </section>

      <section className="analysis-grid">
        <div className="panel">
          <div className="panel-title">
            <h3>AI总体结论</h3>
            <span>自动分析</span>
          </div>

          <div className="ai-box">
            <p>
              1-5月整体ROAS为 <strong>{formatNumber(totalRoas)}</strong>。
              {totalRoas >= 8
                ? ' 当前整体投放效率较好，下月重点应从“扩大高效资源池”和“压缩低效资源”两方面提升规模。'
                : ' 当前整体投放效率存在压力，下月应优先控制低效花费，减少无效群组合作。'}
            </p>
          </div>

          <ul className="todo-list">
            <li>70%预算投入高GMV高ROAS成熟款</li>
            <li>20%预算用于潜力款继续测试</li>
            <li>10%预算保留给新品和临时爆款</li>
            <li>ROAS＜3的资源进入暂停或压价池</li>
          </ul>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>一键月度复盘</h3>
            <span>可复制</span>
          </div>

          <textarea className="ai-report-text" value={reportText} readOnly />

          <button className="copy-button" onClick={copyReport}>
            复制AI复盘文案
          </button>
        </div>
      </section>

      <section className="table-grid">
        <div className="panel">
          <h3>建议加码产品</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>GMV</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {scaleProducts.map((item) => (
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
          <h3>建议加码群组</h3>
          <table>
            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {scaleGroups.map((item) => (
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

      <section className="table-grid">
        <div className="panel">
          <h3>风险产品</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>GMV</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {stopProducts.map((item) => (
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
          <h3>风险群组</h3>
          <table>
            <thead>
              <tr>
                <th>群组</th>
                <th>GMV</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {stopGroups.map((item) => (
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

export default AICenter