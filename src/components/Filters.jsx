import React from 'react';

function Filters({ filterTag, setFilterTag, filterStatus, setFilterStatus, filterDueDate, setFilterDueDate, availableTags }) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className="p-2 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
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
        className="p-2 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
      >
        <option value="All">All Status</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>

      <select
        value={filterDueDate}
        onChange={(e) => setFilterDueDate(e.target.value)}
        className="p-2 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
      >
        <option value="All">All Due Dates</option>
        <option value="overdue">Overdue</option>
        <option value="dueToday">Due Today</option>
        <option value="dueTomorrow">Due Tomorrow</option>
        <option value="dueThisWeek">Due This Week</option>
        <option value="noDueDate">No Due Date</option>
      </select>
    </div>
  )
}

export default Filters
