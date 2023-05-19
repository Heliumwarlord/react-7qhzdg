import React,{useState} from "react";
import "./style.css";

export default function App() {
  const [color,setcolor] = useState("Blue")

  function Slave(){
    console.log("Slave indeed");
    
  }
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
    <button onClick={Slave}>Kilck</button>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}
