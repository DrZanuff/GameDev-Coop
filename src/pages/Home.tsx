import {useHistory} from 'react-router-dom';
import { FormEvent, useContext, useState } from 'react';

import { AuthContext } from '../contexts/AuthContext';

import illustrationImg from '../assets/images/video_game.svg';
import logoImg from '../assets/images/gdc-logo.png';
import googleIconImg from '../assets/images/google-icon.svg';
import gitHubIconImg from '../assets/images/github.png';

import {Button} from '../components/Button';

import '../styles/auth.scss';
import { database } from '../services/firebase';

export function Home(){
    const history = useHistory();
    const { user , singInWithGoogle , singInWithGitHub , signOut } = useContext(AuthContext);
    const [roomCode , setRoomCode] = useState('');

    async function handleCreateRoomGoogle(){
        if (!user){
            await singInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleCreateRoomGitHub(){
        if (!user){
            await singInWithGitHub();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event : FormEvent){
        event.preventDefault();

        if (roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists() ){
            alert('Room doe not exists.');
            return;
        }

        if (roomRef.val().endedAt){
            alert('Room already closed.');
            return;
        }

        history.push(`/rooms/${roomCode}`);

    }

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt='Ilustração simbolizando perguntas e respostas'></img>
                <strong>GameDev Coop</strong>
                <p>Desenvolva jogos com sua audiência em tempo-real. Implemente as funcionalidades sugeridas pelo seus espectadores.</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt='Letmeask'/>
                    { !user &&
                    [
                    <button className='create-room-google' onClick={handleCreateRoomGoogle} key={1}>
                        <img src={googleIconImg} alt='Logo da Google'></img>
                        Crie sua sala com o Google
                    </button>,
                    <button className='create-room-github' onClick={handleCreateRoomGitHub} key={2}>
                    <img src={gitHubIconImg} alt='Logo do GitHub'></img>
                        Crie sua sala com o GitHub
                    </button>
                    ]
                    }
                    { user &&
                    <Button onClick={handleCreateRoomGoogle}>
                        Crie sua sala
                    </Button>
                    }

                    <div className='separator'>ou entre em uma sala</div>
                    
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type='text'
                            placeholder='Digite o código da sala'
                            onChange={event => setRoomCode(event.target.value) }
                            value={roomCode}
                        />
                        <Button placeholder='Digite o código da sala'>
                            Entrar na sala
                        </Button>
                    </form>
                    { user &&
                    <Button onClick={signOut} isOutlined>
                        Sign Out
                    </Button>
                    }

                </div>
            </main>
        </div>
    )
}