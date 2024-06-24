"use client"

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GetRAGResponse } from "@/service/api";
import { ChevronsDown, Clock, LucideArrowLeft, SendHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Message {
  text: string;
  fromUser: boolean;
}

export default function ItemPage({ params }: { params: { chat: string } }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // state untuk menyimpan pesan
  const [isLoading, setIsLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [namespace, setNamespace] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();
  // use effect untuk otomatis kebawah jika ada chat baru
  useEffect(() => {
    if (messagesEndRef.current){
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current){
        const {bottom} = headerRef.current.getBoundingClientRect();
        setShowHeader(bottom > 0); // header akan selalu muncul
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.addEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSend = async () => {
    let namespace = ""
    

    if (question.trim()){
      setMessages([...messages, {text: question, fromUser: true}]);
      setQuestion('');
      setIsLoading(true);

      switch (params.chat) {
        case 'bahasa':
          console.log('Valid chat: chat1', params.chat), params.chat;
          break;
        case 'pjok':
          console.log('Valid chat: chat2'), params.chat;
          // setNamespace("PJOK")
          // const response = await GetRAGResponse(namespace, question)
          namespace = "pjok";
          break;
        case 'chat3':
          console.log('Valid chat: chat3'), params.chat;
          break;
        default:
          console.log('Invalid chat parameter'), params.chat;
          setIsLoading(false);
          return;
      }

      try{
        const response = await GetRAGResponse(namespace, question)
        console.log("ini response dari API", response.text)
        setMessages(prevMessages => [...prevMessages, {text: response.text, fromUser: false}]);
      }catch(error){
        console.error('Error fetching response:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Maaf, Saat ini kami sedang tidak tersedia', fromUser: false }]);
      }finally{
        setIsLoading(false);
      }
  
      console.log('Pesan dikirim:', question);

      // simulasi response API 
      // setTimeout(() =>{
      //   setMessages(prevMessages => [...prevMessages, {text: "ini adalah response dari API", fromUser: false}]);
      //   setIsLoading(false);
      // }, 5000);

      // Rese textarea height
      if (inputRef.current){
        inputRef.current.style.height = 'auto';
        inputRef.current.rows = 1;
      }
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleGoToBottom = () => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto'; // Reset height
    target.style.height = `${target.scrollHeight}px`; // Set height to scrollHeight
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* header sticky */}
      <div className={`sticky top-0 ml-4 bg-slate-950 z-10 transition-opacity duration-300 ${showHeader ? '' : 'opacity-0'}`} ref={headerRef}>
        {/* <div className="flex-1 ml-5"> */}
        <div className="p-4">
          <h1 className='text-3xl font-semibold capitalize flex items-center'>
            <button onClick={handleBack} className="mr-4">
              <LucideArrowLeft />
            </button>
            {params.chat.toUpperCase()} Page
          </h1>
          <div className="border-b-4 mt-3"></div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* Menampilkan bubble chat pesan */}
        <div className="flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md max-w-xs ${msg.fromUser ? 'bg-neutral-500 self-end text-rigth' : 'bg-stone-400 self-start text-left'}`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading &&(
            <div className="self-start">
              <Skeleton className="h-44 w-64 rounded-md"/>
            </div>
          )}

          {/* Dummy div untuk membuat autoscroll */}
          <div ref={messagesEndRef} />

        </div>
      </div>


      {/* Input teks dan tombol di bagian bawah */}
      {/* Go to bottom btn */}
      <div className="sticky bottom-0 right-4 mb-6">
        
      </div>

      <div className="bg-slate-950 ps-4 pt-4 py-4 flex items-center border-t border-gray-200 sticky bottom-0">
        <Button 
          onClick={handleGoToBottom}
          className="absolute right-2 mb-36 rounded-full"
          size="sm"
        >
          <ChevronsDown />
        </Button>
        
        <textarea
          ref={inputRef}
          placeholder="Tulis pesan..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown} // Tambahkan event handler onKeyDown
          onInput={handleInput} // Tambahkan event handler onInput
          className="flex-grow px-3 py-2 ps-4 border border-gray-300 rounded-sm resize-none bg-slate-950 overflow-y-auto"
          rows={1}
          style={{maxHeight:'150px'}}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading} className="ml-4" style={{display: isLoading?"none":"block"}}>
          <SendHorizontal />
        </Button>
        <Button disabled={isLoading} className="ml-4" style={{display: isLoading?"block":"none"}}>
          <Clock />
        </Button>
      </div>
    </div>
  );
}
