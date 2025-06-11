function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">📝 Task Manager</h1>
      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        + Add Task
      </button>
    </header>
  )
}

export default Header
