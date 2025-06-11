import Header from './components/Header'
import TaskCard from './components/TaskCard'

const mockTasks = [
  { id: 1, title: "Finish React project", tag: "work", completed: false },
  { id: 2, title: "Read 10 pages", tag: "personal", completed: true },
  { id: 3, title: "Go for a walk", tag: "health", completed: false }
]

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <Header />
        <div className="mt-6 space-y-4">
          {mockTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
