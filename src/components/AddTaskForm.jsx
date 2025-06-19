import React, {useState} from 'react';

const AddTaskForm = ({onAdd}) => {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && tag){
            onAdd({title, tag});
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
                className="border p-2 rounded"
            />
            <input 
                type="text" 
                placeholder="Tag (e.g., work)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                Add Task 
            </button>
        </form>
    );
};

export default AddTaskForm;