import { CourseContext } from "../contexts/CoursesContext"
import { MedicamentContext } from "../contexts/MedicamentContext"
import { addDeletedTake, TakeContext } from "../contexts/TakesContext";
import { useContext, useEffect } from "react";
import { getToken } from "../contexts/Secure";
import { API_URL_POST_TAKES, API_URL_DELETE_TAKES } from '../constants/constants'
import axios from "axios";
import uuid from 'react-native-uuid';

export const getCourseInfo = (courses, medicaments) => {
    const array = {active:[], inactive:[]};
    if(medicaments.length === 0) return array;
    for(let i in courses) {
        let index = medicaments.findIndex(m => m.id === courses[i].medicamentId);
        if(courses[i].state=='Активный') {
            array.active.push(courses[i]);
            array.active[array.active.length-1].medicament = medicaments[index].title;
        } else {
            array.inactive.push(courses[i]);
            array.inactive[array.inactive.length-1].medicament = medicaments[index].title;
        }
    }
    console.log(array);
    return array;
}

export const updateTakes = async (course, oldEndDate, newEndDate, takes) => {
    oldEndDate = new Date(oldEndDate);
    newEndDate = new Date(newEndDate);
    if(oldEndDate < newEndDate) {
        console.lod('меньше');
    }
    for(; oldEndDate < newEndDate; oldEndDate ++);
    const type = course.typeCourse;
    let daysOfWeek = [];
    let newTakes = [...takes];
    const schedule = course.schedule.split(',');
    switch (type) {
        case '1':  // курс по дня недели
            const weekdays = course.weekday;
            if(oldEndDate.getTime() < newEndDate.getTime()) {
                if(weekdays & 1) daysOfWeek.push(0);
                for(let i = 1; i < 7; ++i) {
                    let d = weekdays & (1 << i);
                    if(d === 1) daysOfWeek.push(7 - i);
                }
                for(let i = new Date(oldEndDate.getTime() + 1000 * 3600 * 24).getTime();
                        i < new Date(newEndDate.getTime() + 1000 * 3600 * 24).getTime();
                        i += 1000 * 3600 * 24) {
                    if(daysOfWeek.findIndex(u => u === new Date(i).getDay()) != -1) {
                        for(let j = 0; j < schedule.length; ++j) {
                            const [hours, minutes, seconds] = schedule[j].split(':');
                            let dateForTake = new Date(i);
                            dateForTake.setHours(hours);
                            dateForTake.setMinutes(minutes);
                            dateForTake.setSeconds(seconds);
                            const uniqueId = uuid.v4();  // Генерация UUID
                            let take = {id: uniqueId, courseId: course.id, datetime:dateForTake, state:false};
                            newTakes.push(take);
                            try {
                                const response = await axios.put(API_URL_POST_TAKES, take, {
                                    headers: {
                                        'Authorization': `Bearer ${await getToken()}`,
                                        'Content-Type': 'application/json'
                                    },
                                });
                            } catch (error) {
                                console.error('Невозможно отправить приемы: ', error);
                            }
                        };
                        console.log(newTakes);
                    }
                }
            } else {
                const deletedTakes = [];
                for(let i = 0; i < takes.length; ++i) {
                    console.debug(new Date(takes[i].datetime));
                    if( (new Date(takes[i].datetime).getTime() > new Date(newEndDate.getTime()).getTime() ) &&
                        takes[i].courseId === course.id) {
                            let tId = takes[i].id;
                            newTakes.splice(newTakes.findIndex(m => m.id === tId), 1);
                            try {
                                const response = await axios.delete(API_URL_DELETE_TAKES + tId, {
                                    headers: {
                                        'Authorization': `Bearer ${await getToken()}`,
                                    },
                                });
                            } catch (error) {
                                console.error('Невозможно удалить прием: ', error);
                                deletedTakes.push(takes[i]);
                            }
                    }
                }
                addDeletedTake(deletedTakes);
            }
            break;
    }
    return newTakes;
}
        
    
    //for(; oldEndDate < newEndDate; oldEndDate ++);
    

export const getTakesByDate = (date) => {
    const { takes, setTakes } = useContext(TakeContext);
    const { courses, setCourses } = useContext(CourseContext);
    const { medicaments, setMedicaments } = useContext(MedicamentContext);
    const takesForDate = [];
    for(let index in takes) {
        let take = takes[index];
        if(new Date(take.datetime).toLocaleDateString() === new Date(date).toLocaleDateString()) {
            const mId = courses[courses.findIndex(m => m.id === take.courseId)].medicamentId;
            const title = medicaments[medicaments.findIndex(m => m.id === mId)].title;
            take.title = title;
            takesForDate.push(take);
        }
    }
    return takesForDate;
}

export const updateCourseState = (id) => {

}
