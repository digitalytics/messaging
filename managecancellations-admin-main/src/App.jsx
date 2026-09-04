import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Spinner from "./Components/Spinner";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from "./Pages/Dashboard/Dashboard";

import Admin from "./Pages/Admin/Admin";
import AddAdmin from "./Pages/Admin/AddAdmin";
import EditAdmin from "./Pages/Admin/EditAdmin";

import PageNotFound from "./Pages/404/PageNotFound";

import SignIn from "./Pages/Signin/SignIn";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";

const Role = lazy(() => import( "./Pages/Roles/View"));
const AddRole = lazy(() => import( "./Pages/Roles/Add"));
const EditRole = lazy(() => import( "./Pages/Roles/Edit"));

const ViewModule = lazy(() => import( "./Pages/Module/View"));
const AddModule = lazy(() => import( "./Pages/Module/Add"));
const EditModule = lazy(() => import( "./Pages/Module/Edit"));
const ViewPermission = lazy(() => import( "./Pages/Permission/View"));

const ViewWaitlist = lazy(() => import( "./Pages/Waitlist/View"));
const ViewNotification = lazy(() => import( "./Pages/Notification/View"));

const PrivateRouteLayout = lazy(() =>
  import("../src/Layout/PrivateRouteLayout")
);

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<Spinner />}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            theme="dark"
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route exact path="/" element={<SignIn />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/reset-password/:id" element={<ResetPassword />} />
            <Route element={<PrivateRouteLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/admin" element={<Admin />} />
              <Route path="/add-admin" element={<AddAdmin />} />
              <Route path="/edit-admin/:id" element={<EditAdmin />} />
              
              <Route path="/roles" element={<Role />} />
              <Route path="/add-roles" element={<AddRole />} />
              <Route path="/edit-roles/:id" element={<EditRole />} />

              <Route path="/module" element={<ViewModule />} />
              <Route path="/add-module" element={<AddModule />} />
              <Route path="/edit-module/:id" element={<EditModule />} />
              <Route path="/permission" element={<ViewPermission />} />
                            
              <Route path="/wait-list" element={<ViewWaitlist />} />
              <Route path="/notification" element={<ViewNotification />} />
              
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
