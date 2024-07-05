import './App.css';
import { useEffect, useState } from 'react';
import { getDatabase,push, set ,ref, onChildAdded } from "firebase/database";


function App() {
  const [name, setName] = useState('')
  const [chats, setChats] = useState([])
  const [msg,setMsg] = useState('')

  const db = getDatabase();
  const chatListRef = ref(db, 'chats');

  const updateHeight=()=>{
    const el = document.getElementById('chat');
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  }

  useEffect(()=>{
    onChildAdded(chatListRef, (data) => {
      setChats( chats=>[...chats,data.val()]);
      setTimeout(()=>{
        updateHeight()
      },100)
    });
  }, [])

  const sendChat = ()=>{

    const chatRef = push(chatListRef);
    set(chatRef, {name,message:msg
      });

    setMsg('');
  }

  return (
    <div>
        {name? null : 
      <div className='inptxt' >
        <input className='nametxt' 
        type='text'
        placeholder='Enter Your Name'
        onBlur={(e)=> setName(e.target.value)}>
        </input>
      </div>}
   
   {name ? <div>
      <h3>User : {name}</h3>
      <div className='chat-container' id='chat'>
        {chats.map((c,i)=>
        <div key={i} className={`container ${c.name===name ? 'me': ''}`}>
        <p className='chatbox'>
        <strong>{c.name}: </strong>
        <span>{c.message}</span>
        </p>
        </div>)}
      </div>
      <div className='btm'>
      <input type='text' onInput={e=>setMsg(e.target.value)} value={msg}
      placeholder='Enter Your Message'></input>
      <button onClick={e=>sendChat()}>Send</button>
      </div>
    </div>: null}

    </div>
  );
}

export default App;
