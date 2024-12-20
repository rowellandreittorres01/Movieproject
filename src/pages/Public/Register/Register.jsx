import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';
import './Register.css'

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const contactNoRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password, firstName, middleName, lastName, contactNo }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState("failed");
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);
    switch (type) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setContactNo(event.target.value);
        break;
      default:
        break;
    }
  };

  let apiEndpoint;

  if (window.location.pathname.includes('/admin')) {
    apiEndpoint = '/admin/register';
  } else {
    apiEndpoint = '/user/register';
  };

  const handleRegister = async () => {
    const data = { email, password, firstName, middleName, lastName, contactNo };
    setStatus('loading');
    await axios({
      method: 'post',
      url: apiEndpoint,
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);

        // Show the alert message
        setIsError("success");
        setAlertMessage(res.data.message);
        setTimeout(() => {
          navigate('/');
          setStatus('idle');
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setStatus('idle');

        setIsError("failed");
        setAlertMessage(e.response?.data?.message || e.message);
        setTimeout(() => setAlertMessage(''), 3000);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className='Register'>
      <div className='registermain-container'>
        <form>
          <div className='registerform-container'>
            <h3>Register</h3>
            <div>
              <div>
                {debounceState && isFieldsDirty && firstName === '' && (
                  <span className='errors'>*This field cannot be left empty</span>
                )}
                <div className='registerform-group'>
                  <label>First Name:</label>
                  <input
                    type='text'
                    name='firstName'
                    ref={firstNameRef}
                    onChange={(e) => handleOnChange(e, 'firstName')}
                    required
                  />
                </div>
              </div>
              <div>
                {debounceState && isFieldsDirty && middleName === '' && (
                  <span className='errors'>*This field cannot be left empty</span>
                )}
                <div className='registerform-group'>
                  <label>Middle Name:</label>
                  <input
                    type='text'
                    name='middleName'
                    ref={middleNameRef}
                    onChange={(e) => handleOnChange(e, 'middleName')}
                  />
                </div>
              </div>
              <div>
                {debounceState && isFieldsDirty && lastName === '' && (
                  <span className='errors'>*This field cannot be left empty</span>
                )}
                <div className='registerform-group'>
                  <label>Last Name:</label>
                  <input
                    type='text'
                    name='lastName'
                    ref={lastNameRef}
                    onChange={(e) => handleOnChange(e, 'lastName')}
                    required
                  />
                </div>
              </div>
              <div>
                {debounceState && isFieldsDirty && contactNo === '' && (
                  <span className='errors'>*This field cannot be left empty</span>
                )}
                <div className='registerform-group'>
                  <label>Contact Number:</label>
                  <input
                    type='text'
                    name='contactNo'
                    ref={contactNoRef}
                    onChange={(e) => handleOnChange(e, 'contactNo')}
                    required
                  />
                </div>
              </div>
              {debounceState && isFieldsDirty && email === '' && (
                <span className='errors'>*This field cannot be left empty</span>
              )}
              <div className='registerform-group'>
                <label>Email:</label>
                <input
                  type='text'
                  name='email'
                  ref={emailRef}
                  onChange={(e) => handleOnChange(e, 'email')}
                  required
                />
              </div>
            </div>
            <div>
              {debounceState && isFieldsDirty && email === '' && (
                <span className='errors'>*This field cannot be left empty</span>
              )}
              <div className='registerform-group'>
                <label>Password:</label>
                <div className='registerpassword-container'>
                  <input
                    type={isShowPassword ? 'text' : 'password'}
                    name='password'
                    ref={passwordRef}
                    onChange={(e) => handleOnChange(e, 'password')}
                    required
                  />
                  <div className='registershow-password'>
                    <input
                      type='checkbox'
                      checked={isShowPassword}
                      onChange={handleShowPassword}
                    />
                    <label>Show Password</label>
                  </div>
                </div>
              </div>
            </div>
            <div className='register-container'>
              <button
                type='button'
                disabled={status === 'loading'}
                onClick={() => {
                  if (email && password && firstName && middleName && lastName && contactNo) {
                    handleRegister();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') emailRef.current.focus();
                    if (password === '') passwordRef.current.focus();
                  }
                }}
              >
                {status === 'idle' ? 'Register' : 'Loading'}
              </button>
            </div>
            <div className='register-container'>
              <span><small>Already have an account? <a href='/'>Login</a></small></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
