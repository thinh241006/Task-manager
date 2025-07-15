import Header from './components/Header';
import TaskCard from './components/TaskCard';
import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import AddTaskForm from './components/AddTaskForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Toaster, toast } from 'react-hot-toast';


const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const mockTasks = [
  { id: 1, title: "Finish React project", tag: "work", completed: false, pinned: false, priority: 'High' },
  { id: 2, title: "Read 10 pages", tag: "personal", completed: true, pinned: false, priority: 'Low' },
  { id: 3, title: "Go for a walk", tag: "health", completed: false, pinned: false, priority: 'Medium' }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : mockTasks;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [filterTag, setFilterTag] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTag, setSearchTag] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filterPriority, setFilterPriority] = useState('All');

  const handleToggleComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success('Task status updated!');
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted!');
  };

  const availableTags = [...new Set(tasks.map(task => task.tag))].filter(tag => tag);

  const filteredTasks = tasks
    .filter(task =>
      (filterTag === 'All' || task.tag === filterTag) &&
      (searchTag === '' || task.tag.toLowerCase().includes(searchTag)) &&
      (filterPriority === 'All' || task.priority === filterPriority)
    )
    .filter(task =>
      filterStatus === 'All' ||
      (filterStatus === 'completed' && task.completed) ||
      (filterStatus === 'incomplete' && !task.completed)
    );

  const handleEdit = (id, newTitle, newTag, newPriority, newDueDate) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, title: newTitle, tag: newTag, priority: newPriority, dueDate: newDueDate }
          : task
      )
    );
    toast.success('Task updated!');
  };

  const markAllComplete = () => {
    setTasks(prev => prev.map(task => ({ ...task, completed: true })));
    toast.success('All tasks marked as completed!');
  };

  const clearCompleted = () => {
    const confirmed = window.confirm("Are you sure you want to delete all completed tasks?");
    if (confirmed) {
      setTasks(prev => prev.filter(task => !task.completed));
      toast.success('Completed tasks cleared!');
    }
  };

  const sortedTasks = [...filteredTasks]
    .sort((a, b) => {
      if (sortOption === 'newest') return b.id - a.id;
      if (sortOption === 'oldest') return a.id - b.id;
      if (sortOption === 'az') return a.title.localeCompare(b.title);
      if (sortOption === 'completed') return (b.completed === a.completed) ? 0 : b.completed ? -1 : 1;
      if (sortOption === 'priority') {
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    })
    .sort((a, b) => b.pinned - a.pinned);

  const handleTogglePin = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, pinned: !task.pinned } : task
      )
    );
    toast.success('Task pinned!');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        <Header />

        <AddTaskForm
          onAdd={({ title, tag, dueDate, priority }) => {
            const newTask = {
              id: Date.now(),
              title,
              tag,
              dueDate,
              priority: priority || 'Medium',
              completed: false,
              pinned: false,
            };
            setTasks([newTask, ...tasks]);
            toast.success('Task added!');
          }}
        />

        <div className="flex gap-2 mt-10">
          <Filters
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            availableTags={availableTags}
          />
        </div>

        <div className="flex gap-2 mb-4 mt-4">
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

        <div className="flex gap-2 mb-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="az">Sort A-Z</option>
            <option value="completed">Sort by Completed</option>
            <option value="priority">Sort by Priority</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        {(filterTag !== 'All' || filterStatus !== 'All' || searchTag || filterPriority !== 'All') && (
          <button
            onClick={() => {
              setFilterTag('All');
              setFilterStatus('All');
              setSearchTag('');
              setFilterPriority('All');
            }}
            className="mb-4 px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            Reset Filters
          </button>
        )}
        <p className="mb-2 text-sm text-gray-600">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
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
          {tasks.length} total tasks — {tasks.filter(t => t.completed).length} completed, {tasks.filter(t => !t.completed).length} incomplete
        </p>

        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;

            const movedTask = sortedTasks[result.source.index];
            const originalIndex = tasks.findIndex(task => task.id === movedTask.id);
            const reordered = Array.from(tasks);
            reordered.splice(originalIndex, 1);

            const destinationTask = sortedTasks[result.destination.index];
            const destinationOriginalIndex = tasks.findIndex(task => task.id === destinationTask.id);
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
                  <div className="text-center text-gray-400 py-10 animate-pulse">
                    <p className="text-xl font-medium">🎉 No tasks found!</p>
                    <p className="text-sm">Try changing filters or add a new task.</p>
                </div>                
                ) : (
                  <>
                    {/* Incomplete Tasks */}
                    {sortedTasks.filter(t => !t.completed).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
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
                    ))}
                    
                    {/* Completed Tasks */}
                    {sortedTasks.filter(t => t.completed).length > 0 && (
                      <>
                        <h4 className="text-sm text-gray-600 mt-6 mb-2">Completed</h4>
                        {sortedTasks
                          .filter(t => t.completed)
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={sortedTasks.filter(t => !t.completed).length + index}
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
                          ))}
                      </>
                    )}
                  </>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
