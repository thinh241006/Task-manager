import React, { useState } from 'react';

function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTag, setEditTag] = useState(task.tag);

  const handleSave = () => {
    if (editTitle.trim() === '') {
      alert("Task title cannot be empty.");
      return;
    }
    onEdit(task.id, editTitle, editTag);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="p-1 border rounded"
            />
            <input
              type="text"
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              className="p-1 border rounded"
            />
          </div>
        ) : (
          <>
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <span className="text-sm text-gray-500">#{task.tag}</span>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-3 py-1 text-sm bg-green-500 text-white rounded">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm bg-gray-300 rounded">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => onToggleComplete(task.id)} className={`px-3 py-1 text-sm rounded ${task.completed ? 'bg-green-400 text-white' : 'bg-gray-200'}`}>
              {task.completed ? 'Undo' : 'Done'}
            </button>
            <button onClick={() => setIsEditing(true)} className="px-3 py-1 text-sm bg-yellow-400 text-white rounded">Edit</button>
            <button onClick={() => onDelete(task.id)} className="px-3 py-1 text-sm bg-red-400 text-white rounded">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
