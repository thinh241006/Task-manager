function Filters({ filterTag, setFilterTag, filterStatus, setFilterStatus, availableTags }) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="All">All Tags</option>
        {availableTags.map((tag, idx) => (
          <option key={idx} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="All">All Status</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </div>
  )
}

export default Filters
