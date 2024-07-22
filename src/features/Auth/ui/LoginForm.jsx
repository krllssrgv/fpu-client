import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TextInput, ConfirmButton, ErrorField, Loading } from 'widgets';
import { routes, url } from 'shared';
import styles from './LoginForm.module.scss';


function LoginForm(props) {
    const [localLoading, setLoading] = useState(false),
          [email, setEmail] = useState(''),
          [emailError, setEmailError] = useState(''),
          [password, setPassword] = useState(''),
          [passwordError, setPasswordError] = useState(''),
          { isLogin, setIsLogin, loading } = props,
          navigate = useNavigate();


    const login = () => {
        setEmailError('');
        setPasswordError('');
        setLoading(true);

        async function connect() {
            const response = await fetch(`${url}api/user/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                setLoading(false);
                setIsLogin(true);
                navigate(routes.main);
            } else {
                setLoading(false);
                if (response.status === 401) {
                    const json = await response.json();
                    if ('email' in json) setEmailError(json.email);
                    if ('password' in json) setPasswordError(json.password);
                    console.log();
                } else {
                    console.log(response.status);
                }
            }
        }
        
        connect();
    }


    const renderButton = () => {
        if (localLoading) {
            return(<Loading size={'min'} />);
        } else {
            return(<ConfirmButton text="Войти" func={login} />)
        }
    }


    const render = () => {
        if (!loading && !isLogin) {
            return(
                <>
                    <div className={styles.headline}>Авторизация</div>
                        
                    <div className={styles.input}>
                        <TextInput
                            type="text" 
                            value={email}
                            setValue={setEmail}
                            placeholder="Email"
                            error={emailError}
                        />
            
                        <ErrorField text={emailError} />
                    </div>
                            
                    <div className={styles.input}>
                        <TextInput
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="Пароль"
                            error={passwordError}
                        />
            
                        <ErrorField text={passwordError} />
                    </div>
            
                    <Link to={routes.register} className={styles.link}>Зарегистрироваться</Link>
            
                    { renderButton() }
                </>
            );
        } else {
            return(
                <>
                    <Loading size="max" />
                </>
            );
        }
    }


    return(
        <>
            { render() }
        </>
    );
}

export default LoginForm;