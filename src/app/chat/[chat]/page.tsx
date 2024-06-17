"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsDown, LucideArrowLeft, SendHorizontal } from 'lucide-react';
// import { useRouter } from 'next/router';
import { permanentRedirect } from 'next/navigation';
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  // const router = useRouter();
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

  const handleSend = () => {
    console.log('Pesan dikirim:', question);

    if (question.trim()){
      setMessages([...messages, {text: question, fromUser: true}]);
      setQuestion('');
      setIsLoading(true);

      // simulasi response API 
      setTimeout(() =>{
        setMessages(prevMessages => [...prevMessages, {text: "ini adalah response dari API", fromUser: false}]);
        setIsLoading(false);
      }, 5000);
    }
  };

  const handleBack = () => {
    console.log("back is pressed");
    permanentRedirect("/")
    // router.push("/");
  };

  const handleGoToBottom = () => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
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

      {/* Go to bottom btn */}
      <div className="fixed bottom-16 right-4 mb-6">
        <Button onClick={handleGoToBottom}>
          <ChevronsDown />
        </Button>

      </div>

      {/* Input teks dan tombol di bagian bawah */}
      <div className="bg-slate-950 p-4 flex items-center border-t border-gray-200 sticky bottom-0">
        <Input
          type="text"
          placeholder="Tulis pesan..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
        />
        <Button onClick={handleSend} className="ml-2">
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
