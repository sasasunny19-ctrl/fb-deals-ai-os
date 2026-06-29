function DataTable({ columns, data, rowKey }) {
  return (
    <div className="table-scroll">
      <table className="table-v2">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row[rowKey] || index}>
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  className={i === 0 ? "sticky-column" : ""}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable