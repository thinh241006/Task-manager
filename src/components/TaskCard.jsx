import React, { useState } from 'react';

function TaskCard({ task, onToggleComplete, onDelete, onEdit, onTogglePin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTag, setEditTag] = useState(task.tag);
  const [editPriority, setEditPriority] = useState(task.priority || 'Medium');
  const [error, setError] = useState('');
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const handleSave = () => {
    if (editTitle.trim() === '') {
      setError('Title is required.');
      return;
    }
    setError('');
    onEdit(task.id, editTitle, editTag, editPriority, editDueDate);
    setIsEditing(false);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-xl shadow p-4 flex justify-between items-center ${isEditing ? 'bg-yellow-50 dark:bg-yellow-900' : ''}`}>
      <div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={50}
                className="p-1 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
              />
              {error && <span className="text-sm text-red-500 dark:text-red-400">{error}</span>}
            </div>
            <input
              type="date"
              value={editDueDate ? editDueDate.slice(0, 10) : ''}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="p-1 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
            />
            <input
              type="text"
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              className="p-1 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
            />

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="p-1 border rounded dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        ) : (
          <>
            <h3 className={`font-medium mb-1 ${task.completed ? 'line-through text-gray-400 dark:text-slate-400' : ''}`}>
              {task.title}
            </h3>

            <div className="flex items-center gap-2 mb-1">
              {task.completed && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                  Completed
                </span>
              )}
              {task.pinned && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  Pinned
                </span>
              )}
              {task.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === 'High'
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : task.priority === 'Medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  }`}
                >
                  {task.priority} Priority
                </span>
              )}
            </div>

            <span className="text-sm text-gray-500 dark:text-slate-400">#{task.tag}</span>

            {task.dueDate && (
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}

            {task.dueDate && new Date(task.dueDate) < new Date() && !task.completed && (
              <p className="text-xs text-red-500 dark:text-red-400 font-semibold">
                Overdue!
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-3 py-1 text-sm bg-green-500 dark:bg-green-700 text-white rounded">Save</button>
            <button onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditTag(task.tag);
              setEditPriority(task.priority || 'Medium');
              setError('');
              setEditDueDate(task.dueDate || '');
            }} className="px-3 py-1 text-sm bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded">Cancel</button>
          </>
        ) : (
          <>
            <button
              onClick={() => onToggleComplete(task.id)}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              className={`px-3 py-1 text-sm rounded ${task.completed ? 'bg-green-400 dark:bg-green-700 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100'}`}
            >
              {task.completed ? 'Undo' : 'Done'}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
              className="px-3 py-1 text-sm bg-yellow-400 dark:bg-yellow-700 text-white rounded"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              className="px-3 py-1 text-sm bg-red-400 dark:bg-red-700 text-white rounded"
            >
              Delete
            </button>

            <button
              onClick={() => onTogglePin(task.id)}
              aria-label={task.pinned ? 'Unpin task' : 'Pin task'}
              className={`px-3 py-1 text-sm rounded ${task.pinned ? 'bg-blue-500 dark:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100'}`}
            >
              {task.pinned ? 'Unpin' : 'Pin'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
