'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext();

export default UserContext

export const UserProvider =  ({ children }) => {
    const [user,setUser] = useState(null); 

    async function getUser() {
        const response = await fetch('/api/infos' ,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
       
       if(response.status===400){
        setUser(null);
    }

if(response.status===200){
 
    setUser(data);
}

    }
    useEffect(() => {
        getUser();
    }, [])

    return (
        <UserContext.Provider value={{user}}>

            {children}
        </UserContext.Provider>
    )
} 

export const useUserContext = () => {
    return useContext(UserContext);
}