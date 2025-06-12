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

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map(task => (
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
