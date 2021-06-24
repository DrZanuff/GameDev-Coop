import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import {Button} from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuths';
import { database } from '../services/firebase';
import '../styles/room.scss';

type FirebaseQuestions = Record<string,{
    author : {
        name: string;
        avatar: string;
    }
    content : string;
    isAnswered : boolean;
    isHighlighted : boolean
}>

type Question = {
    id : string;
    author : {
        name: string;
        avatar: string;
    }
    content : string;
    isAnswered : boolean;
    isHighlighted : boolean
}

type RoomParams = {
    id : string;
}

export function Room(){
    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [ newQuestion , setNewQuestion] = useState('');
    const [ questions , setQuestions ] = useState<Question[]>([]);
    const [ title , setTitle ] = useState('');
    //const [ refresh , setRefresh ] = useState(false);

/*      useEffect(() => {
        const interval = setInterval(() => {
            console.log('This will run every second!');
            console.log(refresh + String(new Date() ) );
            console.log(new Date() );
            setRefresh(!refresh);
        }, 10000);
        return () => {
            clearInterval(interval)
        };
      }, [refresh]);

    //Carrega toda vez que uma nova pergunta é adicionada
    useEffect( () => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('child_added' , (snapshot, prevChildKey) =>{
            const databaseRoom = snapshot.val()
            const firebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map( ([key , value]) =>{
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted : value.isHighlighted,
                    isAnswered : value.isAnswered,
                }
            })

            
            //console.log(roomId in snapshot.val())
            if (typeof snapshot.val() == 'object' ){
                console.log(Object.keys( snapshot.val() ) )
                console.log(roomId)
                //console.log(Object.keys( snapshot.val() ) )
            }
            //console.log(parsedQuestions)
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);
        })
    } , [roomId, refresh]) */

    //Carrega pela primeira vez quando entra na sala todas as perguntas
      useEffect( () => {
        const roomRef = database.ref(`rooms/${roomId}`);
        console.log("First Load")
        roomRef.on('value' , room =>{
            const databaseRoom = room.val()
            const firebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map( ([key , value]) =>{
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted : value.isHighlighted,
                    isAnswered : value.isAnswered,
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);
        })
    } , [roomId])



    async function handleSendQuestion(event : FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === ''){
            return;
        }

        if (!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author : {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');

    }

    return(
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmesask'/>
                    <RoomCode code={roomId}></RoomCode>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O que você quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className='form-footer'>
                        { 
                        user
                        ?
                        <div className='user-info'>
                            <img src={user.avatar} alt={user.name}></img>
                            <span>{user.name}</span>
                        </div>
                        :
                        <span>Para enviar uma pergunta, <button id='login'>faça seu login</button>.</span>
                        }
                        
                        <Button type='submit' disabled={!user}>Enviar uma pergunta</Button>
                    </div>
                    
                </form>

                {JSON.stringify(questions)}
            </main>

        </div>
    );
}