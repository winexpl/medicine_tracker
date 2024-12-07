import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_DELETE_COURSE, API_URL_GET_TAKES, API_URL_POST_TAKES, API_URL_DELETE_TAKES } from '../constants/constants';
import axios from 'axios';
import { getToken } from './Secure';
import { CourseContext } from './CoursesContext';

export const TakeContext = createContext();


export const saveDeletedTakes = async (data) => {
    try {
        await AsyncStorage.setItem('deletedTakes', JSON.stringify(data));
        console.log('Deleted take saved!');
    } catch (error) {
        console.error('Error saving deleted takes: ', error);
    }
};

export const deleteTakesFromCourse = async (cId) => {
    const takes = await getTakes();
    const newTakes = [];
    const deletedTakes = await getDeletedTakes();
    for (let i in takes) {
        if(takes[i].courseId === cId) {
            console.log(takes[i].id);
            try {
                const response = await axios.delete(API_URL_DELETE_TAKES + takes[i].id, {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`,
                    },
                });
        
            } catch (error) {
                console.error('Невозможно удалить прием: ', error);
                deletedTakes.push(takes[i]);
            }
        } else newTakes.push(takes[i]);
    }
    saveTakes(newTakes);
    saveDeletedTakes(deletedTakes);
}

export const deleteDeletedTakes = async () => {
    try {
        const deletedTakes = await getDeletedTakes();
        console.debug(deletedTakes);
        if(deletedTakes === null) return;
        let newDeletedTakes = [];
        for(let i in deletedTakes) {
            try {
                const response = await axios.delete(API_URL_DELETE_TAKES + deletedTakes[i].id, null, {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`,
                    },
                });
            } catch (error) {
                console.error('Невозможно удалить прием: 1', error);
                newDeletedTakes.push(deletedTakes[i]);
            }
        }
        saveDeletedTakes(newDeletedTakes);
    } catch (error) {
        console.error("Error adding deleted takes: ", error);
    }
}

export const addDeletedTakes = async (data) => {
    try {
        const deletedTakes = await getDeletedTakes();
        
        deletedTakes.push(...data);
        console.log('deletedTakes', deletedTakes);
        let newDeletedTakes = [];
        for(let i in deletedTakes) {
            try {
                const response = await axios.delete(API_URL_DELETE_TAKES + deletedTakes[i].id, {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`,
                    },
                });
            } catch (error) {
                console.error('Невозможно удалить прием: ', error);
                newDeletedTakes.push(deletedTakes[i]);
            }
        }
        saveDeletedTakes(newDeletedTakes);
    } catch (error) {
        console.error("Error adding deleted takes:", error);
    }
};

export const getDeletedTakes = async () => {
    try {
        const deletedTakesJson = await AsyncStorage.getItem('deletedTakes');
        const deletedTakes = JSON.parse(deletedTakesJson);
        if(deletedTakes) return deletedTakes;
        return [];
    } catch (error) {
        console.error('Error receiving deleted takes:', error);
        return [];
    }
};

export const saveTakes = async ([...data]) => {
    try {
        await AsyncStorage.setItem('takes', JSON.stringify(data));
        const takes = data;
        console.log('Takes saved!');
        for(let i in takes) {
            try {
                const response = await axios.put(API_URL_POST_TAKES, takes[i], {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`,
                        'Content-Type': 'application/json'
                    },
                });
            } catch (error) {
                console.error('Невозможно отправить прием на сервер: ', error);
            }
        }
        
    } catch (error) {
        console.error('Error saving takes: ', error);
    }
};

export const getTakes = async () => {
    try {
        const takesJson = await AsyncStorage.getItem('takes');
        const takesObj = JSON.parse(takesJson);
        if(takesObj) return takesObj;
        else return [];
    } catch (error) {
        console.error('Error receiving takes: ', error);
        return [];
    }
};

export const addTakes = async (data) => {
    try {
        const takesJson = await AsyncStorage.getItem('takes');
        const takes = takesJson ? JSON.parse(takesJson) : [];
        takes.push(data);
        await AsyncStorage.setItem('takes', JSON.stringify(takes));
        console.log('Takes added!');
    } catch (error) {
        console.error('Error adding takes: ', error);
    }
};

export const clearTakes = async (data) => {
    try {
        await AsyncStorage.removeItem('takes');
        console.log('Takes removed!');
    } catch (error) {
        console.error('Error removing takes: ', error);
    }
};

export const clearDeletedTakes = async () => {
    try {
        await AsyncStorage.removeItem('deletedTakes');
        console.log('Deleted takes removed!');
    } catch (error) {
        console.error('Error removing deleted takes: ', error);
    }
};

export const TakeProvider = ({ children }) => {
    const [takes, setTakes] = useState([]);
    const { courses, setCourses } = useContext(CourseContext);
    useEffect(() => {
        async function fetch() {
            const localTakes = await getTakes();
            setTakes(localTakes);
            deleteDeletedTakes();
            if(localTakes.length > 0) {
                for(let i in localTakes) {
                    try {
                    const response = await axios.put(API_URL_POST_TAKES, localTakes[i], {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    } catch (error) {
                        console.error('Невозможно отправить прием на сервер: ', error);
                    }
                }
                
            } else {
                try {
                    const response = await axios.get(API_URL_GET_TAKES, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    });
    
                    if (response.data && response.data.length > 0) {
                        const takesSaved = response.data;
                        await saveTakes(takesSaved); 
                        setTakes(takesSaved);
                        console.log('Takes fetched and saved!');
                    } else {
                        console.log('No takes available.');
                    }
                } catch (err) {
                    console.error('Нет связи с сервером, ошибка получения приемов: ', err);
                }
            }
            console.log('УДАЛЕННЫЕ ПРИЕМЫ', await getDeletedTakes());
        }
        fetch();

        
    }, []);

    useEffect(() => {
        async function update() {
            setTakes(await getTakes());
        }
        update();
    }, []);

    console.log('ПРИЕМЫ', takes);
    
    return (
        <TakeContext.Provider value={{takes, setTakes}}>
            {children}
        </TakeContext.Provider>
    );
};