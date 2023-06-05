
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

 firebase.initializeApp({
   apiKey: "AIzaSyA_NLTWA9iG7dcBx_pLI9Dq5nnmWeCgJsA",
  authDomain: "superchat-70b92.firebaseapp.com",
  projectId: "superchat-70b92",
  storageBucket: "superchat-70b92.appspot.com",
  messagingSenderId: "346984203601",
  appId: "1:346984203601:web:c3c2a236ecfcf59575ff70",
  measurementId: "G-5NK2589478"
})


const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        <h1>Super Chat App</h1>
        <SignOut />
      </header>

      <section>
        {user?<ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <div>
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      </div>
    );
}

function SignOut(){
  return auth.currentUser && <button onClick={()=> auth.signOut()}>Sign Out</button>
}

function ChatRoom() {
  const dummy = React.useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = React.useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter Message" />

      <button type="submit" disabled={!formValue}>send</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
