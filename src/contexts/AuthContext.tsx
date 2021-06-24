import { createContext, ReactNode, useState , useEffect  } from 'react';
import { useHistory } from 'react-router-dom';
import { firebase, auth } from '../services/firebase';



type AuthContextType = {
    user : User | undefined;
    singInWithGoogle : () => Promise<void>;
  }
  
  type User = {
    id : string;
    name : string;
    avatar : string;
  }

  type AuthContextProviderProps = {
      children : ReactNode;
  }

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props : AuthContextProviderProps){
    const history = useHistory();
    const [user, setUser] = useState<User>();

    //Efeito dispara se o Firebase identificar que um usuário está logado. Util para quando usar F5
    //useEffect possui dois parametros, a arrow funciton que vai ser chamada e o valor em uma array
    // que vai ficar monitorando. No caso atual, se passar uma array vazia ele só executa uma vez
    useEffect( ()=> {
      const unsubscribe = auth.onAuthStateChanged(user =>{
        if (user){
          const { displayName , photoURL , uid } = user;
        
          if ( !displayName || !photoURL){
            throw new Error('Missing information from Google Account.');
          }
    
          setUser({
            id : uid,
            name : displayName,
            avatar : photoURL
          })
        }
      })
  
      return () =>{
        unsubscribe();
      }
  
    } , [] )
  
    async function singInWithGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider)
  
      if (result.user){
        const { displayName , photoURL , uid } = result.user;
        
        if ( !displayName || !photoURL){
          throw new Error('Missing information from Google Account.');
        }
  
        setUser({
          id : uid,
          name : displayName,
          avatar : photoURL
        })
      }
  
    }

    async function signOut() {
      await auth.signOut();
      setUser(undefined);
      history.push('/');
    }

    return(
        <AuthContext.Provider value={ { user ,singInWithGoogle } }>
            {props.children}
            {user !== undefined && <button onClick={signOut}>Sign Out</button>}
        </AuthContext.Provider>
    )
}