
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import { ToastContainer } from "react-toastify";


ReactDOM.render(
  <BrowserRouter>
    <ToastContainer limit={3}/>
    <Switch>
      <Route path={`/login`} component={AuthLayout} />
      <Route path={`/`} component={AdminLayout} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
