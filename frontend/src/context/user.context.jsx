import React, { createContext, useContext, useState } from 'react';

//Create the user context......


export const userContext = createContext();

 //Create Provider component....
 // This component will wrap the parts of the application that need access to the user context

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    

    // const login = (userData) => setUser(userData);
    // const logout = () => setUser(null);
   

    return (
        // Provide the user context to the children components
        // The value prop of the Provider component is the data that will be available to the children components.

        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    );
};



