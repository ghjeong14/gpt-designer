function HistoryLog({ history }) {
  return (
    <div className="overflow-y-auto max-h-[60vh] px-2 space-y-4 w-full">
      {history.map((entry, index) => (
        <div key={index} className="flex flex-col space-y-2 w-full">
          {/* User bubble */}
          <div className="self-start bg-blue-100 text-blue-900 p-3 rounded-lg shadow w-fit max-w-[85%] sm:max-w-md break-words">
            <p className="font-semibold">You:</p>
            <p>{entry.prompt}</p>
            <p className="text-xs text-right text-gray-500 mt-1">{entry.timeStamp}</p>
          </div>

          {/* Assistant bubble */}
          <div className="self-end bg-gray-100 text-gray-900 p-3 rounded-lg shadow w-fit max-w-[85%] sm:max-w-md break-words">
            <p className="font-semibold">Assistant:</p>
            <p>{entry.reply}</p>
            <p className="text-xs text-right text-gray-500 mt-1">{entry.timeStamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryLog;
