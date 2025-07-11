import React, {useState} from 'react';

const AddTaskForm = ({onAdd}) => {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && tag){
            onAdd({
                title,
                tag,
                dueDate: dueDate || null,
                priority,
              });
            setTitle('');
            setTag('');
        }
    }

    return (
        <form onSubmit = {handleSubmit} className="flex flex-col gap-2 p-4 bg-white rounded-2xl shadow">
            <input 
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                className="border p-2 rounded"
            />
            <input 
                type="text" 
                placeholder="Tag (e.g., work)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border p-2 rounded"
            />
            <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-4"
                >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Add Task 
            </button>
        </form>
    );
};

export default AddTaskForm;