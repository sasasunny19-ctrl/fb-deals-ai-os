const menuItems = [
  { key: 'dashboard', label: '总览驾驶舱' },
  { key: 'products', label: '产品中心' },
  { key: 'groups', label: '群组中心' },
  { key: 'campaigns', label: '投放中心' },
  { key: 'tracking', label: 'Tracking中心' },
  { key: 'analytics', label: '数据分析' },
  { key: 'ai', label: 'AI决策中心' },
  { key: 'reports', label: '月报中心' },
  { key: 'settings', label: '系统设置' },
]

function Sidebar({ currentPage, onPageChange }) {
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
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={currentPage === item.key ? 'active' : ''}
            onClick={() => onPageChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="side-tip">
        <strong>运营原则</strong>
        <span>周度观察，月度决策</span>
      </div>
    </aside>
  )
}

export default Sidebar