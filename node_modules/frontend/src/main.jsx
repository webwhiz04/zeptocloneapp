import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Admin from "./pages/admin.jsx";
import AdminDashboard from "./pages/admindashboard.jsx";
import AddProduct from "./pages/addproduct.jsx";
import ViewProduct from "./pages/viewproduct.jsx";
import AdminUserOrders from "./pages/adminuserorders.jsx";
import ManageUsers from "./pages/manageusers.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

const AdminWrapper = ({ children }) => (
    <AdminLayout>{children}</AdminLayout>
);

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/*" element={<App />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admindashboard" element={<AdminWrapper><AdminDashboard /></AdminWrapper>} />
            <Route path="/admindashboard/addproduct" element={<AdminWrapper><AddProduct /></AdminWrapper>} />
            <Route path="/admindashboard/viewproduct" element={<AdminWrapper><ViewProduct /></AdminWrapper>} />
            <Route path="/admindashboard/user" element={<AdminWrapper><AdminUserOrders /></AdminWrapper>} />
            <Route path="/admindashboard/manage-users" element={<AdminWrapper><ManageUsers /></AdminWrapper>} />
        </Routes>
    </BrowserRouter>
);
