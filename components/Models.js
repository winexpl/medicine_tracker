import { CourseContext } from "../contexts/CoursesContext"
import { MedicamentContext } from "../contexts/MedicamentContext"
import { useContext } from "react";

export const getCourseInfo = () => {
    const { courses, setCourses } = useContext(CourseContext);
    const { medicaments, setMedicaments } = useContext(MedicamentContext);
    let array = {active:[], inactive:[]};
    for(let i in courses) {
        
        console.log('123', courses[i]);
        let index = medicaments.findIndex(m => m.id === courses[i].medicamentId);
        if(courses[i].state='Активный') {
            array.active.push(courses[i]);
            array.active[array.active.length-1].medicament = medicaments[index].title;
        } else {
            array.inactive.push(courses[i]);
            array.inactive[array[active].length-1].medicament = medicaments[index].title;
        }
    }
    console.log(array);
    return array;
}