import logo from './logo.svg';
import './App.css';
import { HelloWorldComponent } from './HelloWorldComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <HelloWorldComponent />
      </header>
    </div>
  );
}

export default App;
