import Header from './components/Header';
import TaskCard from './components/TaskCard';
import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import AddTaskForm from './components/AddTaskForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Toaster, toast } from 'react-hot-toast';


const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const mockTasks = [
  { id: 1, title: "Finish React project", tag: "work", completed: false, pinned: false, priority: 'High', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 2, title: "Read 10 pages", tag: "personal", completed: true, pinned: false, priority: 'Low' },
  { id: 3, title: "Go for a walk", tag: "health", completed: false, pinned: false, priority: 'Medium', dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
  { id: 4, title: "Buy groceries", tag: "personal", completed: false, pinned: false, priority: 'Medium', dueDate: new Date().toISOString() },
  { id: 5, title: "Call dentist", tag: "health", completed: false, pinned: false, priority: 'Low', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
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
  const [sortOption, setSortOption] = useState('newest');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDueDate, setFilterDueDate] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
  .filter(task => {
    // Tag filter
    if (filterTag !== 'All' && task.tag !== filterTag) return false;
    
    // Priority filter
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
    
    // Status filter
    if (filterStatus !== 'All') {
      if (filterStatus === 'completed' && !task.completed) return false;
      if (filterStatus === 'incomplete' && task.completed) return false;
    }
    
    // Due date filter
    if (filterDueDate !== 'All') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
      
      switch (filterDueDate) {
        case 'overdue':
          if (!taskDueDate || taskDueDate >= today || task.completed) return false;
          break;
        case 'dueToday':
          if (!taskDueDate || taskDueDate.getTime() !== today.getTime() || task.completed) return false;
          break;
        case 'dueTomorrow':
          if (!taskDueDate || taskDueDate.getTime() !== tomorrow.getTime() || task.completed) return false;
          break;
        case 'dueThisWeek':
          if (!taskDueDate || taskDueDate > endOfWeek || task.completed) return false;
          break;
        case 'noDueDate':
          if (taskDueDate) return false;
          break;
      }
    }
    
    // Search filter
    if (searchQuery !== '') {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.tag.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    
    return true;
  });

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
      if (sortOption === 'dueDate') {
        // Sort by due date: overdue first, then due today, then due tomorrow, then future dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const aDueDate = a.dueDate ? new Date(a.dueDate) : null;
        const bDueDate = b.dueDate ? new Date(b.dueDate) : null;
        
        // Tasks without due dates go to the end
        if (!aDueDate && !bDueDate) return 0;
        if (!aDueDate) return 1;
        if (!bDueDate) return -1;
        
        // Overdue tasks first
        const aOverdue = aDueDate < today && !a.completed;
        const bOverdue = bDueDate < today && !b.completed;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        
        // Then by actual due date
        return aDueDate - bDueDate;
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
    <div className="min-h-screen text-gray-90dark:text-gray-100 px-4 py-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        <Header tasks={tasks} />

        <div className="mt-12">
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
        </div>

        <div className="flex gap-2 mt-10">
          <Filters
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDueDate={filterDueDate}
            setFilterDueDate={setFilterDueDate}
            availableTags={availableTags}
          />
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
            <option value="dueDate">Sort by Due Date</option>
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
        {(filterTag !== 'All' || filterStatus !== 'All' || searchQuery || filterPriority !== 'All' || filterDueDate !== 'All') && (
          <button
            onClick={() => {
              setFilterTag('All');
              setFilterStatus('All');
              setSearchQuery('');
              setFilterPriority('All');
              setFilterDueDate('All');
            }}
            className="mb-4 px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
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

        <input
          type="text"
          placeholder="Search by title or tag..."
          className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

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
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-xl font-medium">No task found!</p>
                    <p className="text-sm">Try changing filters or add a new task above.</p>
                    <div className="mt-4 text-xs text-gray-500">
                      💡 Tip: Use the form above to create your first task
                    </div>
                </div>                
                ) : (
                  <>
                    {/* Incomplete Tasks */}
                    {sortedTasks
                      .filter(task =>
                        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        task.tag.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .filter(task => !task.completed)
                      .map((task, index) => (
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
