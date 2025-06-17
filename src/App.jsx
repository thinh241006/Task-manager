import Header from './components/Header'
import TaskCard from './components/TaskCard'
import React, {useState} from 'react';
import Filters from './components/Filters'

const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem('tasks')
  return saved ? JSON.parse(saved) : mockTasks
})

function App() {
  const [tasks, setTasks] = useState(mockTasks)
  const [inputTitle, setInputTitle] = useState('')
  const [inputTag, setInputTag] = useState('')
  const [filterTag, setFilterTag] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTag, setSearchTag] = useState('')

  const handleToggleComplete = (id) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
      )
    )
  }

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const availableTags = [...new Set(tasks.map(task => task.tag))].filter(tag => tag)
  const filteredTasks = tasks
    .filter(task => 
      (filterTag === 'All' || task.tag === filterTag) &&
      (searchTag === '' || task.tag.toLowerCase().includes(searchTag))
    )
    .filter(task =>
      filterStatus === 'All' ||
      (filterStatus === 'completed' && task.completed) ||
      (filterStatus === 'incomplete' && !task.completed)
    )

  const handleEdit = (id, newTitle, newTag) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === id ? { ...task, title: newTitle, tag: newTag } : task
    )
    );
  };

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

      <div className="flex gap-2 mt-10">
        {/* Filters  */}
        <Filters
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          availableTags={availableTags}
        />
      </div>

      <input
        type="text"
        placeholder="Search by tag..."
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value.toLowerCase())}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />

      <p className="mb-2 text-sm text-gray-600">
        Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
      </p>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found.</p>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />

            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
