import React, { useState } from 'react';

function TaskCard({ task, onToggleComplete, onDelete, onEdit, onTogglePin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTag, setEditTag] = useState(task.tag);
  const [error, setError] = useState('');

  const handleSave = () => {
  if (editTitle.trim() === '') {
    setError('Title is required.');
    return;
  }
  setError('');
  onEdit(task.id, editTitle, editTag);
  setIsEditing(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow p-4 flex justify-between items-center ${isEditing ? 'bg-yellow-50' : ''}`}>
      <div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={50}
                className="p-1 border rounded"
              />
              {error && <span className="text-sm text-red-500">{error}</span>}
            </div>

            <input
              type="text"
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              className="p-1 border rounded"
            />
          </div>
        ) : (
          <>
            <h3 className={`font-medium mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mb-1">
              {task.completed && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  Completed
                </span>
              )}
              {task.pinned && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Pinned
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">#{task.tag}</span>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-3 py-1 text-sm bg-green-500 text-white rounded">Save</button>
            <button onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditTag(task.tag);
              setError('');
            }} className="px-3 py-1 text-sm bg-gray-300 rounded">Cancel</button>
          </>
        ) : (
          <>
            <button
              onClick={() => onToggleComplete(task.id)}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
              className={`px-3 py-1 text-sm rounded ${task.completed ? 'bg-green-400 text-white' : 'bg-gray-200'}`}
            >
              {task.completed ? 'Undo' : 'Done'}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
              className="px-3 py-1 text-sm bg-yellow-400 text-white rounded"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              className="px-3 py-1 text-sm bg-red-400 text-white rounded"
            >
              Delete
            </button>

            <button
              onClick={() => onTogglePin(task.id)}
              aria-label={task.pinned ? 'Unpin task' : 'Pin task'}
              className={`px-3 py-1 text-sm rounded ${task.pinned ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
