// AppRouter.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import Influencers from "./pages/influencers";
import { useDispatch } from "react-redux";
import { auth, firestore } from "./firebase/firebaseConfig";
import { loggedIn } from "./store/slice/authSlice";
import Profile from "./pages/profile";
import { doc, getDoc } from "firebase/firestore";
import Brands from "./pages/brands&projects";
import BrandReporting from "./pages/brand-reporting";
import TasksAndPayments from "./pages/task&payments";
import ErrorScreen from "./error_component";
import Loader from "./components/loader/Loader";

const AppRouter: React.FC = () => {
  const dispatch = useDispatch();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        const userDocRef = doc(firestore, "user", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
          setAdmin(user);
          const userData = userDocSnap.data();
          dispatch(loggedIn({ ...userData }));
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }

      // Set loading to false once the authentication check is complete
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    // Show a loading indicator while checking authentication
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={admin ? <Brands /> : <Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/influencers"
          element={admin ? <Influencers /> : <Navigate to="/" />}
        />
        <Route
          path="/brandreporting"
          element={admin ? <BrandReporting /> : <Navigate to="/" />}
        />
        <Route
          path="/tasks-payments"
          element={admin ? <TasksAndPayments /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={admin ? <Profile /> : <Navigate to="/" />}
        />
        <Route path="/not-found" element={<ErrorScreen />} />
        <Route path="/*" element={<Navigate to="/not-found" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default AppRouter;
