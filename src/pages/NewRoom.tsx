import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/video_game.svg';
import logoImg from '../assets/images/gdc-logo.png';
import {Button} from '../components/Button';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuths'

import '../styles/auth.scss';

export function NewRoom(){
    const { user , signOut } = useAuth();
    const history = useHistory()
    const [newRoom , setNewRoom] = useState('');

    async function handleCreateRoom(event : FormEvent){
        event.preventDefault();

        if (newRoom.trim() === ''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`);
    }

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt='Ilustração simbolizando perguntas e respostas'></img>
                <strong>GameDev Coop</strong>
                <p>Desenvolva jogos com sua audiência em tempo-real. Implemente as funcionalidades sugeridas pelo seus espctadores.</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt='Letmeask'/>
                    <h2>Criar nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type='text'
                            placeholder='Nome da sala'
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button placeholder='Digite o código da sala'>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link>
                    </p>
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