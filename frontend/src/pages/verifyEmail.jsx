import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const { handleVerifyEmail } = useContext(AuthContext);
    const [message, setMessage] = useState('Verifying your email...');

    const token = searchParams.get('token');
    console.log(token);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await handleVerifyEmail(token);
                console.log(res)
                if (res.status === 200) {
                    setMessage('✅ Email verified successfully!');
                } else {
                    setMessage('❌ Verification failed.');
                }
            } catch (err) {
                console.log(err)
                setMessage('❌ Verification failed. Token may be invalid or expired.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage('❌ No token found.');
        }
    }, [token]);

    return (
        <div>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;
