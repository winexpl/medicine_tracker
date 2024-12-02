export const API_URL = 'http://172.20.10.9:7634';
export const API_URL_LOGIN = API_URL + '/login';
export const API_URL_REGISTRATION = API_URL + '/registration';
export const API_URL_COURSES = API_URL + '/courses';
export const API_URL_MEDICAMENTS = API_URL + '/medicaments';
export const API_URL_TAKES = API_URL + '/takeMedicine';

// courses
export const API_URL_GET_COURSES = API_URL_COURSES;
export const API_URL_POST_COURSES = API_URL_COURSES;

// medicaments
export const API_URL_GET_MEDICAMENTS = API_URL_MEDICAMENTS;
export const API_URL_GET_MEDICAMENT = API_URL_MEDICAMENTS + '/id=';
export const API_URL_GET_MEDICAMENTS_SEARCH = API_URL_MEDICAMENTS + '/title=';
export const API_URL_POST_MEDICAMENTS = API_URL_GET_MEDICAMENTS;

// takes
export const API_URL_GET_TAKES = API_URL_TAKES;
export const API_URL_POST_TAKES = API_URL_TAKES;
