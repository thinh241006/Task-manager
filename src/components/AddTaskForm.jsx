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
            setDueDate('');
            setPriority('Medium');
        }
    }

    return (
        <form onSubmit = {handleSubmit} className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <input 
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                className="border p-2 rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
            />
            <input 
                type="text" 
                placeholder="Tag (e.g., work)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border p-2 rounded dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded mb-4 dark:bg-gray-900 dark:text-gray-100"
                >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded w-full dark:bg-gray-900 dark:text-gray-100"
            />
            <button type="submit" className="bg-blue-500 dark:bg-blue-700 text-white py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition">
                Add Task 
            </button>
        </form>
    );
};

export default AddTaskForm;