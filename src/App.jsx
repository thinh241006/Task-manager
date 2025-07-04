import Header from './components/Header'
import TaskCard from './components/TaskCard'
import React, {useState, useEffect} from 'react';
import Filters from './components/Filters'
import AddTaskForm from './components/AddTaskForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const mockTasks = [
  { id: 1, title: "Finish React project", tag: "work", completed: false, pinned: false },
  { id: 2, title: "Read 10 pages", tag: "personal", completed: true, pinned: false },
  { id: 3, title: "Go for a walk", tag: "health", completed: false, pinned: false }
]

function App() {
  {/* try to load from localStorage, if not found uses mockTasks*/}
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks') 
    return saved ? JSON.parse(saved) : mockTasks
  })

  {/* every time tasks changes, save them back to localStorage */}
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const [filterTag, setFilterTag] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTag, setSearchTag] = useState('')
  const [sortOption, setSortOption] = useState('newest')

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

  {/* create an array with set of task.tag inside it and remove "" tag */}
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

  const markAllComplete = () => {
    setTasks(prev =>
      prev.map(task => ({...task, completed: true}))
    );
  };

  const clearCompleted = () => {
    const confirmed = window.confirm("Are you sure you want to delete all completed tasks?");
    if (confirmed){
      setTasks(prev => prev.filter(task => !task.completed));
    }
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => b.pinned - a.pinned);

  const handleTogglePin = (id) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === id ? { ...task, pinned: !task.pinned } : task
    )
  );
};

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <Header />
        {/* Add Task Form */}
        <AddTaskForm
          onAdd={({title, tag}) => {
            const newTask = {
              id:Date.now(),
              title,
              tag,
              completed: false,
              pinned: false,
            };
            setTasks([newTask, ...tasks]);
          }} 
        />

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

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by tag..."
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value.toLowerCase())}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {searchTag && (
          <button
            onClick={() => setSearchTag('')}
            className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            Clear
          </button>
        )}
      </div>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4"
      >
        <option value="newest">Sort by Newest</option>
        <option value="oldest">Sort by Oldest</option>
        <option value="az">Sort A-Z</option>
        <option value="completed">Sort by Completed</option>
      </select>

      <p className="mb-2 text-sm text-gray-600">
        Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
          {/* Check if any task is not completed then render after && if not show nothing */} 
          {tasks.some(task => !task.completed) && (
            <button
              onClick={markAllComplete}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
            >
              Mark All as Completed
            </button>
          )}
          {tasks.some(task => task.completed) && (
            <button
              onClick={clearCompleted}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
            >
              Clear Completed Tasks
            </button>
          )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {tasks.length} total tasks —{" "}
        {tasks.filter(t => t.completed).length} completed,{" "}
        {tasks.filter(t => !t.completed).length} incomplete
      </p>
        
        {/* Task List */}
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;

            // Get the task that was moved from the sortedTasks array
            const movedTask = sortedTasks[result.source.index];
            
            // Find the actual index of this task in the original tasks array
            const originalIndex = tasks.findIndex(task => task.id === movedTask.id);
            
            // Create a new array from the original tasks
            const reordered = Array.from(tasks);
            
            // Remove the task from its original position
            reordered.splice(originalIndex, 1);
            
            // Find where to insert it based on the destination in sortedTasks
            const destinationTask = sortedTasks[result.destination.index];
            const destinationOriginalIndex = tasks.findIndex(task => task.id === destinationTask.id);
            
            // Insert at the new position
            reordered.splice(destinationOriginalIndex, 0, movedTask);

            setTasks(reordered);
          }}
        >
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {sortedTasks.length === 0 ? (
                  <p className="text-center text-gray-500">No tasks found.</p>
                ) : (
                  sortedTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onToggleComplete={handleToggleComplete}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onTogglePin={handleTogglePin}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

export default App
