function Sidebar() {
  return (
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
  )
}

export default Sidebar