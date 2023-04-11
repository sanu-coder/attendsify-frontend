import jwtDecode from "jwt-decode";

export const decodeToken : any = (token : string) => {
    // console.log(token);
    const decodedToken = jwtDecode(token||"");
    // console.log(decodedToken);
    return decodedToken;
}

export const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
}

export const saveTokenToLocalStorage = (token : string) => {
    localStorage.setItem('token', token);
}

export const deleteToken = () => {
    localStorage.removeItem('token');
}


