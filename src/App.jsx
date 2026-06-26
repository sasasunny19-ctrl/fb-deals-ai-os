import './App.css'

const kpis = [
  { label: '本月GMV', value: '$289,681.85', change: '+18.6%' },
  { label: '本月花费', value: '$29,030.39', change: '+7.2%' },
  { label: '整体ROAS', value: '9.98', change: '-1.4%' },
  { label: '投放次数', value: '2,425', change: '+12.5%' },
]

const products = [
  { sku: 'DLA49WK2B16', gmv: '$32,860', roas: '18.93', status: '重点加码' },
  { sku: 'KEA45XXK28157', gmv: '$26,400', roas: '15.70', status: '继续放量' },
  { sku: 'COA46XXK28140', gmv: '$18,730', roas: '11.38', status: '稳定投放' },
  { sku: 'BAD00TEST', gmv: '$210', roas: '1.62', status: '暂停复盘' },
]

const groups = [
  { name: 'FB Big Deals USA', gmv: '$42,950', roas: '18.93', status: '加码合作' },
  { name: 'Coupon Moms Club', gmv: '$36,400', roas: '13.70', status: '稳定合作' },
  { name: 'Outdoor Deal Hunter', gmv: '$21,750', roas: '9.91', status: '继续测试' },
  { name: 'IG Daily Deals', gmv: '$1,190', roas: '2.58', status: '压价观察' },
]

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h2>FB Deals AI OS</h2>
            <p>Commercial Console</p>
          </div>
        </div>

        <nav>
          <button className="active">总览驾驶舱</button>
          <button>产品中心</button>
          <button>群组中心</button>
          <button>投放中心</button>
          <button>Tracking中心</button>
          <button>数据分析</button>
          <button>AI决策中心</button>
          <button>月报中心</button>
          <button>系统设置</button>
        </nav>

        <div className="side-tip">
          <strong>运营原则</strong>
          <span>周度观察，月度决策</span>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>FB Deals 智能运营系统</h1>
            <p>产品、群组、Tracking、人效、ROAS、月度决策一体化</p>
          </div>

          <div className="header-actions">
            <button>导入Excel</button>
            <button>导出数据</button>
          </div>
        </header>

        <section className="kpi-grid">
          {kpis.map((item) => (
            <div className="kpi-card" key={item.label}>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
              <span>{item.change}</span>
            </div>
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
      </main>
    </div>
  )
}

export default App