import KpiCard from '../../components/KpiCard'
import { kpis, products, groups } from '../../data/mockData'

function Dashboard() {
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
            <span>1月 - 5月</span>
          </div>

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
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>AI运营建议</h3>
            <span>本月</span>
          </div>

          <div className="ai-box">
            <p>
              本月GMV整体表现较好，但部分群组ROAS偏低。建议下月采用
              <strong> 70 / 20 / 10 </strong>
              策略：70%资源给高ROAS成熟款，20%资源测试潜力款，10%资源保留给新品。
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
              {products.map((p) => (
                <tr key={p.sku}>
                  <td>{p.sku}</td>
                  <td>{p.gmv}</td>
                  <td>{p.roas}</td>
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
              {groups.map((g) => (
                <tr key={g.name}>
                  <td>{g.name}</td>
                  <td>{g.gmv}</td>
                  <td>{g.roas}</td>
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