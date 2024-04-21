import axios from 'axios';
import toast from 'react-hot-toast';

export const logout = async () => {


    const Authorization = `Bearer ${localStorage.getItem('token')}`

    try {

        await axios.get("/logout", {
            headers: {
                Authorization
            }
        });

        toast("Logged out successfully")

    }catch (err) {
        // do something
    }

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = '/';
    
}