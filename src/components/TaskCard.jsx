function TaskCard({ task }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <span className="text-sm text-gray-500">#{task.tag}</span>
      </div>
      <input
        type="checkbox"
        checked={task.completed}
        readOnly
        className="w-5 h-5 accent-blue-500"
      />
    </div>
  )
}

export default TaskCard
