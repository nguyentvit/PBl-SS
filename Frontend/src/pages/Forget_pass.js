import { useState } from "react";
import "./css/forget_pass.css";
function ForgetPass()

{
    const [email, sendEmail] = useState('');
    const [showmodal, setshowModal] = useState('');
    const handleSubmit  = (event) => {
        event.preventDefault();
        console.log('Send password recovery request for email : ', email);
        sendEmail('');
        setshowModal(true);

    };
    return (
    <div className="container_send">
        <h1 >
            Forgot Password
        </h1>
      <form className="container_input">
          <div className="form-input">
              <label for="email" className="email_lbl">Email Address</label>
              <input
                 id="email"
                name="email"
                type="email"
               className="txtEmail"
                placeholder="Enter your email"
              />
          </div>
          <button
             type="submit"
             className="btnSend">
             Send Reset Code
          </button>
      </form>
    </div>);
}
export default ForgetPass;