import axios from 'axios';
import React, { useEffect, useState } from 'react';



const Application = props => {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        console.log('Initiating SAML check.', 'SAML');

        axios({
            method: 'GET',
            url: 'http://localhost:1337/whoami',
            withCredentials: true
        })
            .then(response => {
                console.log(response.data.user, 'SAML');

                if (response.data.user.nameID) {
                    setEmail(response.data.user.nameID);
                    setLoading(false);
                }
                else {
                    RedirectToLogin();
                }
            })
            .catch(error => {
                console.log(error, 'SAML');
                RedirectToLogin();
            })
    }, []);

    const RedirectToLogin = () => {
        window.location.replace('http://localhost:1337/login');
    }

    if (loading)
        return <p>loading ...</p>

    return (
        <p>Hello {email}!</p>
    );
}

export default Application;