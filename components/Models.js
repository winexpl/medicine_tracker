import { CourseContext } from "../contexts/CoursesContext"
import { MedicamentContext } from "../contexts/MedicamentContext"
import { addDeletedTakes, saveTakes, TakeContext } from "../contexts/TakesContext";
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
        console.log(index);
        if(courses[i].state=='Активный') {
            array.active.push(courses[i]);
            array.active[array.active.length-1].medicament = medicaments[index].title;
            array.active[array.active.length-1].dosageForm = medicaments[index].dosageForm;
        } else {
            array.inactive.push(courses[i]);
            array.inactive[array.inactive.length-1].medicament = medicaments[index].title;
            array.inactive[array.inactive.length-1].dosageForm = medicaments[index].dosageForm;
        }
    }
    return array;
}


export const dosageFormTo = (dosageForm) => {
    switch(dosageForm) {
        case "TABLET":
        case "Таблетки": return "табл.";
    }
}

export const updateTakes = async (course, oldEndDate, newEndDate, takes) => {
    oldEndDate = new Date(oldEndDate);
    newEndDate = new Date(newEndDate);
    if(newEndDate === oldEndDate) return [];
    console.debug('newDate',newEndDate.toUTCString());
    console.debug('oldDate',oldEndDate.toUTCString());
    const type = course.typeCourse;
    let daysOfWeek = [];
    let newTakes = [...takes];
    const schedule = course.schedule;
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
                            console.debug("СОЗДАЕМ");
                            const uniqueId = uuid.v4();  // Генерация UUID
                            console.debug(uniqueId);
                            let take = {id: uniqueId, courseId: course.id, datetime:dateForTake.toISOString(), state:false};
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
                        saveTakes(newTakes);
                    }
                }
            } else {
                const deletedTakes = [];
                for(let i = 0; i < takes.length; ++i) {
                    console.debug(new Date(takes[i].datetime));
                    if( (new Date(takes[i].datetime).getTime() > newEndDate.getTime() + 1000 * 3600 * 24 ) &&
                        takes[i].courseId === course.id) {
                            let tId = takes[i].id;
                            newTakes.splice(newTakes.findIndex(m => m.id === tId), 1);
                            deletedTakes.push(takes[i]);
                    }
                }
                addDeletedTakes(deletedTakes);
            }
            break;
        case '2':
            if(oldEndDate.getTime() < newEndDate.getTime()) {
                for(let i = new Date(oldEndDate.getTime() + 1000 * 3600 * 24).getTime();
                        i < new Date(newEndDate.getTime() + 1000 * 3600 * 24).getTime();
                        i += course.period * 1000 * 3600 * 24) {
                    for(let j = 0; j < schedule.length; ++j) {
                        const [hours, minutes, seconds] = schedule[j].split(':');
                        let dateForTake = new Date(i);
                        dateForTake.setHours(hours);
                        dateForTake.setMinutes(minutes);
                        dateForTake.setSeconds(seconds);
                        console.debug("СОЗДАЕМ");
                        const uniqueId = uuid.v4();  // Генерация UUID
                        console.debug(uniqueId);
                        let take = {id: uniqueId, courseId: course.id, datetime:dateForTake.toISOString(), state:false};
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
                    saveTakes(newTakes);
                }
            } else {
                const deletedTakes = [];
                for(let i = 0; i < takes.length; ++i) {
                    console.debug(new Date(takes[i].datetime));
                    if( (new Date(takes[i].datetime).getTime() > newEndDate.getTime() + 1000 * 3600 * 24 ) &&
                        takes[i].courseId === course.id) {
                            let tId = takes[i].id;
                            newTakes.splice(newTakes.findIndex(m => m.id === tId), 1);
                            deletedTakes.push(takes[i]);
                    }
                }
                addDeletedTakes(deletedTakes);
            }

            break;

    }
    return newTakes;
}

export const getTakesByDate = (date, takes, courses, medicaments) => {

    const takesForDate = [];
    for(let index in takes) {
        let take = takes[index];
        if(new Date(take.datetime).toLocaleDateString() === new Date(date).toLocaleDateString()) {
            let indexCourse = courses.findIndex(m => m.id === take.courseId);
            
            if(indexCourse != -1) {
                const mId = courses[indexCourse].medicamentId;
                let indexMedicament = medicaments.findIndex(m => m.id === mId);
                if(indexMedicament != -1) {
                    const title = medicaments[indexMedicament].title;
                    take.title = title;
                    takesForDate.push(take);
                }
            }
        }
    }
    return takesForDate;
}

export const updateCourseState = (id) => {

}
