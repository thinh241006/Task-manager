function Filters({ filterTag, setFilterTag, filterStatus, setFilterStatus }) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {['All', 'work', 'personal', 'health'].map(tag => (
        <button
          key={tag}
          onClick={() => setFilterTag(tag)}
          className={`px-3 py-1 rounded border ${
            filterTag === tag ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {tag}
        </button>
      ))}
      {['All', 'completed', 'incomplete'].map(status => (
        <button
          key={status}
          onClick={() => setFilterStatus(status)}
          className={`px-3 py-1 rounded border ${
            filterStatus === status ? 'bg-green-500 text-white' : 'bg-white'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  )
}

export default Filters
