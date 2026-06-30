function DataTable({ columns, data, rowKey }) {
  return (
    <div className="table-scroll">
      <table className="table-v2">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <td
  key={col.key}
  className={index === 0 ? "sticky-column" : ""}
  style={
    index === 0
      ? {}
      : {
          width: col.width || 120,
          minWidth: col.width || 120,
        }
  }
>
                {col.title}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row[rowKey] || rowIndex}>
              {columns.map((col, index) => (
                <td
                  key={col.key}
                  className={index === 0 ? "sticky-column" : ""}
                  style={{
                    width: col.width || 120,
                    minWidth: col.width || 120,
                  }}
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