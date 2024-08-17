import axios from 'axios';

const BACKEND_ORIGIN_URL = 'http://localhost:3000';

const login = async (email, password) => {
    try {
        const response = await axios.post(`${BACKEND_ORIGIN_URL}/user/login`, { email, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Error while Login");
        }
    }
}



const Register = async (name, email, password, confirmpassword) => {
    try {
        const response = await axios.post(`${BACKEND_ORIGIN_URL}/user/signup`, {
            name,
            email,
            password,
            confirmpassword
        });

        console.log("signup", response.data);  
        return response.data;  
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}



const userDetails = async (id) => {
    try {
        const userresponse = await axios.get(`${BACKEND_ORIGIN_URL}/user/userdetails/${id}`);
        return userresponse.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export { login, Register, userDetails };