import { createContext, useState } from "react";

export const CreateCourseContext = createContext();

export const CreateCourseProvider = ({ children }) => {
    const [ typeOfCourse, setTypeOfCourse ] = useState({type:null, medicament:null});
    return (
        <CreateCourseContext.Provider value={{typeOfCourse, setTypeOfCourse}}>
            {children}
        </CreateCourseContext.Provider>
    );
};
