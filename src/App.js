import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = process.env.REACT_APP_PASSWORD; // Using an environment variable
    if (password === correctPassword) {
      navigate('/portal');
    } else {
      alert('Incorrect password! Try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Login</h1>
      <form className="form" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="password" className="label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default App;
