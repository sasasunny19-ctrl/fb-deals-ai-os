function KpiCard({ item }) {
  return (
    <div className="kpi-card">
      <p>{item.label}</p>
      <h2>{item.value}</h2>
      <span>{item.change}</span>
    </div>
  )
}

export default KpiCard