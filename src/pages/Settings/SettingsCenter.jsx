function SettingsCenter() {
  return (
    <>
      <section className="page-title">
        <div>
          <h2>系统设置</h2>
          <p>管理系统基础配置、数据口径、评分规则和后续AI参数</p>
        </div>
      </section>

      <section className="quality-grid">
        <div className="quality-card">
          <p>主分析口径</p>
          <h3>1-5月</h3>
          <span>当前统计月份</span>
        </div>

        <div className="quality-card">
          <p>ROAS优秀线</p>
          <h3>≥10</h3>
          <span>优质资源判断</span>
        </div>

        <div className="quality-card warning">
          <p>观察线</p>
          <h3>3-5</h3>
          <span>需要压价或复盘</span>
        </div>

        <div className="quality-card danger">
          <p>风险线</p>
          <h3>＜3</h3>
          <span>建议暂停复盘</span>
        </div>
      </section>

      <section className="analysis-grid">
        <div className="panel">
          <div className="panel-title">
            <h3>评分规则</h3>
            <span>当前版本</span>
          </div>

          <div className="ai-box">
            <p>
              当前系统按照 GMV、ROAS、出单量、投放次数、合作SKU 等维度对产品和群组进行综合评分。
              后续可在这里开放自定义权重，例如：GMV占比、ROAS占比、出单占比。
            </p>
          </div>

          <ul className="todo-list">
            <li>产品评分：GMV + ROAS + 出单 + 投放次数</li>
            <li>群组评分：GMV + ROAS + 出单 + 投放次数 + 合作SKU</li>
            <li>ROAS≥10：重点加码 / 重点合作</li>
            <li>ROAS＜3：暂停复盘 / 压价观察</li>
          </ul>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>后续功能规划</h3>
            <span>V2.0</span>
          </div>

          <ul className="todo-list">
            <li>接入 Supabase 云数据库</li>
            <li>增加登录和成员权限</li>
            <li>支持自定义月份筛选</li>
            <li>支持月报导出 Excel / PDF</li>
            <li>支持 AI 自动分析产品和群组</li>
          </ul>
        </div>
      </section>
    </>
  )
}

export default SettingsCenter