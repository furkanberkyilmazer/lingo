import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f7f7f7;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #333;
  }

  button {
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      opacity: 0.9;
    }
  }

  input {
    padding: 10px;
    font-size: 1rem;
    border: 2px solid #ccc;
    border-radius: 5px;
    outline: none;

    &:focus {
      border-color: #007bff;
    }
  }
`;

export default GlobalStyle;