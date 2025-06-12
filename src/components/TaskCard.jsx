function TaskCard({ task, onToggleComplete, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <span className="text-sm text-gray-500">#{task.tag}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onToggleComplete(task.id)}
                className={`px-3 py-1 text-sm rounded ${
                task.completed ? 'bg-green-400 text-white' : `bg-gray-200`
                }`}>
          {task.completed ? 'Undo' : 'Done'}
        </button>
        <button onClick={() => onDelete(task.id)}
                className="px-3 py-1 text-sm bg-red-400 text-white rounded">
                Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard
