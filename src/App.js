import {useState} from 'react';

import ChatBox from './components/ChatBox';
import InputPanel from './components/InputPanel';
import RoleSelect from './components/RoleSelect';
import HistoryLog from './components/HistoryLog';

function App() {
  const [prompt, setPrompt] = useState("");             //This setPrompt function is used to set the prompt for the AI    
  const [role, setRole] = useState("designer");          //This setRole function is used to set the role of the AI  
  const [response, setResponse] = useState("");          //This setResponse function is used to show the response from the AI 
  const [isLoading, setIsLoading] = useState(false);    //This setIsLoading function is used to show the loading animation  
  const [history, setHistory] = useState(()=> {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];              //This setHistory function is used to save the chat history to local storage  
  });
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [model, setModel] = useState("openchat/openchat-7b");


  //simulate a GPT response for now
  const handleGenerate = () => {                  //handleGenerate function is used to generate the response from the AI  
    if (prompt.trim() === "") {
      setResponse("Please enter a prompt.");
      return;
    }                                              //This if statement is used to check if the prompt is empty   
    setIsLoading(true);                             //setIsLoading true to show the loading animation  
    setResponse("Thinking");                        //setResponse to Thinking to show the loading animation  
  
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount +1) % 4;
      setResponse("Thinking" + ".".repeat(dotCount));
    }, 400);
    
    const body = {
      model: model,  // ← use selected model
      messages: [
        { role: "system", content: `You are a helpful ${role} giving short, structured responses.` },
        { role: "user", content: prompt }
      ]
    };    

    /* const apiKey = "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";

    const headers ={
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost",
      "X-Title": "MiniGPT Designer"
    } */
    
    fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({prompt, role, model})
    })
    .then(res => res.json())
    .then(data => {
      if(data.reply){
        setResponse(data.reply);
        
        if(speakEnabled && "speechSynthesis" in window){
          const utterance = new SpeechSynthesisUtterance(data.reply);
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
        }

        const timeStamp = new Date().toLocaleTimeString();
        const updatedHistory = [
          ...history,
          { prompt, reply: data.reply, timeStamp }
        ];
        setHistory(updatedHistory);
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));  
      }else{
        setResponse("The model didn't return a valid entity.");
      }
    })
    .catch(err => {
      console.error(err);
      setResponse("An error occurred. Please try again.");
    })
    .finally(()=>{
      clearInterval(dotInterval);
      setIsLoading(false);
    })
    
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 py-4 sm:py-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">GPT Designer v2</h1>
        <div className="w-full space-y-4">
          <RoleSelect role={role} setRole={setRole} />
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-center">Choose model:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="openchat/openchat-7b">OpenChat 7B</option>
              <option value="mistralai/mistral-7b-instruct">Mistral 7B Instruct</option>
              <option value="nousresearch/nous-hermes-13b">Nous Hermes 13B</option>
              <option value="google/gemini-pro">Gemini Pro</option>
            </select>
          </div>

          <label className="flex items-center justify-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={speakEnabled}
              onChange={(e) => setSpeakEnabled(e.target.checked)}
            />
            <span className="text-sm text-gray-600">Speak replies aloud</span>
          </label>

          <div id="chat-box" className="mb-4">
            <ChatBox response={response} />
          </div>

          <InputPanel prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isLoading={isLoading} />
          <HistoryLog history={history} />
          <button
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("chatHistory");
            }}
            className="text-sm text-red-500 underline w-full text-center"
          >
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
