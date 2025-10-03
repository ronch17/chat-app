import Navbar from "./components/Navbar.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import { useAuthStore } from "../store/useAuthStore.ts";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "../store/useThemeStore.ts";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth().then();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
