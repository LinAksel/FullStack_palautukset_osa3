import React from "react"

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        filter shown with:{" "}
        <input value={filter} onChange={handleFilterChange} />
      </div>
    </form>
  )
}

export default Filter
