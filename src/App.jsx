import Header from './components/Header'
import TaskCard from './components/TaskCard'
import React, {useState} from 'react';


const mockTasks = [
  { id: 1, title: "Finish React project", tag: "work", completed: false },
  { id: 2, title: "Read 10 pages", tag: "personal", completed: true },
  { id: 3, title: "Go for a walk", tag: "health", completed: false }
]

function App() {
  const [tasks, setTasks] = useState(mockTasks)
  const [inputTitle, setInputTitle] = useState('')
  const [inputTag, setInputTag] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
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

        <div className="flex gap-2 mb-6">
        {/* Filter by Tag */}
        {['all', 'work', 'personal', 'health'].map(tag => (
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

        {/* Filter by Status */}
        {['all', 'completed', 'incomplete'].map(status => (
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

      <input
        type="text"
        placeholder="Search by tag..."
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value.toLowerCase())}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />


        {/* Task List */}
        <div className="space-y-4">
          {tasks
            .filter(task => 
              (filterTag === 'all' || task.tag === filterTag) &&
              (searchTag === '' || task.tag.toLowerCase().includes(searchTag))
            )
            .filter(task =>
              filterStatus === 'all' ||
              (filterStatus === 'completed' && task.completed) ||
              (filterStatus === 'incomplete' && !task.completed)
            )
            .map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
          ))}

        </div>
      </div>
    </div>
  )
}

export default App
