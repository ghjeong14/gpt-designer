function InputPanel({ prompt, setPrompt, onGenerate, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onGenerate();
    }
  }
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Enter a prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={`w-full border p-2 rounded ${isLoading ? 'bg-gray-100 text-gray-400' : ''}`}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className={`w-full sm:w-auto px-4 py-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isLoading ? 'Thinking...' : 'Generate'}
      </button>
    </div>
  );
}

export default InputPanel;
