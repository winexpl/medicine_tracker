import { CourseContext } from "../contexts/CoursesContext"
import { MedicamentContext } from "../contexts/MedicamentContext"
import { TakeContext } from "../contexts/TakesContext";
import { useContext, useEffect } from "react";


export const getCourseInfo = (courses, medicaments) => {
    const array = {active:[], inactive:[]};
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

export const updateTakes = (course, oldEndDate, newEndDate) => {
    console.log(oldEndDate);
    oldEndDate = new Date(oldEndDate);
    newEndDate = new Date(newEndDate);
    if(oldEndDate < newEndDate) {
        console.lod('меньше');
    }
    for(; oldEndDate < newEndDate; oldEndDate ++);
    const type = course.typeCourse;
    
}
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
