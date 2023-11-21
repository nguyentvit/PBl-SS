
import React from 'react';

import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';

import ForgetPass from './pages/Forget_pass';
import ResetPassword from './pages/Reset_pass';  // Giả sử bạn cũng đã tạo một component ForgetPass
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Login';
// import ForgetPass from './ForgetPass'; // Đây là tên file chứa component ForgetPass

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Route cho trang đăng nhập */}
        <Route path="/ForgetPass" element={<ForgetPass />} /> {/* Route cho trang quên mật khẩu */}
        {/* Thêm các Route khác nếu bạn có nhiều hơn 2 trang */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

