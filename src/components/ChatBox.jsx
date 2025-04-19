function ChatBox({ response }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-100 p-4 rounded min-h-[100px]">
      {response ? <p className="text-center">{response}</p> : <p className="text-gray-400 text-center">Waiting for a response...</p>}
    </div>
  );
}

export default ChatBox;
