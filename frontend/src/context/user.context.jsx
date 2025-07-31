import React, { createContext, useContext, useState } from 'react';

//Create the user context......
// This context will hold the user data and provide it to the components that need it
// It will also provide functions to update the user data
// such as login, logout, and update user information
// This is a simple user context that can be used to manage user authentication state
// and user information in a React application
// It uses React's Context API to provide the user data and functions to the components
// that need it. The context is created using createContext and the provider is created
// using the UserProvider component. The useUser hook is used to access the user context
// and the user data and functions provided by the UserProvider component.........

export const userContext = createContext(null);

 //Create Provider component....
 // This component will wrap the parts of the application that need access to the user context

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // You can add login, logout, and update functions here as needed


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

//Create a custom hook to use the UserContext
// This hook will allow you to access the user context in any component
// without having to use the useContext hook directly

