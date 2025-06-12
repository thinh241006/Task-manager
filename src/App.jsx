function App() {
  const [tasks, setTasks] = useState(mockTasks)
  const [inputTitle, setInputTitle] = useState('')
  const [inputTag, setInputTag] = useState('')

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <Header />

        {/* Add Task Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const newTask = {
              id: Date.now(),
              title: inputTitle,
              tag: inputTag,
              completed: false
            }
            setTasks([newTask, ...tasks])
            setInputTitle('')
            setInputTag('')
          }}
          className="flex flex-col gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Task title"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Tag (e.g. work, health)"
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}
