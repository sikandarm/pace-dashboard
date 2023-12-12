import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import SimpleLayout from "./layouts/simple";
//
// import BlogPage from './pages/BlogPage';
// import UserPage from './pages/UserPage';
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
// import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from "./pages/DashboardAppPage";
import Inventory from "./pages/Inventory/Inventory";
import Tasks from "./pages/Tasks/Tasks";
import Jobs from "./pages/Jobs/Jobs";
import DetailJob from "./pages/Jobs/Detail.jsx";
import Fabricateditemdetails from "./pages/Jobs/Fabricated_item_details.jsx";
import Roles from "./pages/Roles/Roles";
import Users from "./pages/Users/Users";
import Permissions from "./pages/Permissions/Permissions";
import Contacts from "./pages/Contactpage/Contacts";
import PurchaseOrder from "./pages/PurchaseOrder/PurchaseOrder";
import PurchaseOrderForm from "./pages/PurchaseOrder/PurchaseOrderForm.jsx";
import Details from "./pages/PurchaseOrder/Details";
import PurchaseOrderItems from "./pages/PurchaseOrder/PurchaseOrderItems";
import Company from "./pages/Company/company.jsx";
import Vendor from "./pages/vendor/vendor.jsx";
import CreateFabrecatedItems from "./pages/Jobs/CreateFabrecatedItems.jsx";
import Sequence from "./pages/Sequence/Sequence.jsx";
import SequenceDetail from "./pages/Sequence/Detail.jsx";
// ----------------------------------------------------------------------
import { useDispatch, useSelector } from "react-redux";
import PasswordResetPage from "./pages/PasswordResetPage";
import AuthLayout from "./layouts/AuthLayout";
export default function Router() {
  const dispatch = useDispatch();
  const { decodedToken } = useSelector((state) => state.userSlice.loginUser);
  const routes = useRoutes([
    {
      path: "/",
      element: decodedToken?.email ? (
        <DashboardLayout />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        // { element: <Navigate to="/users" />, index: true },
        { path: "/dashboard/app", element: <DashboardAppPage /> },
        { path: "users", element: <Users dispatch={dispatch} /> },
        { path: "roles", element: <Roles /> },
        { path: "jobs", element: <Jobs /> },
        { path: "/detail-Job/:id", element: <DetailJob /> },
        { path: "/create-items/:id", element: <CreateFabrecatedItems /> },
        {
          path: "/fabricated-item-details/:uniqueName",
          element: <Fabricateditemdetails />,
        },
        { path: "/update-items/:id", element: <CreateFabrecatedItems /> },
        { path: "contacts", element: <Contacts /> },
        { path: "vendors", element: <Vendor /> },
        { path: "purchaseorder", element: <PurchaseOrder /> },
        { path: "inventory", element: <Inventory /> },
        { path: "purchaseorderform", element: <PurchaseOrderForm /> },
        { path: "purchaseorderitem/:id", element: <PurchaseOrderItems /> },
        { path: "Details/:id", element: <Details /> },
        { path: "purchaseorderform/:id", element: <PurchaseOrderForm /> },
        { path: "companies", element: <Company /> },
        { path: "tasks", element: <Tasks /> },
        { path: "sequence", element: <Sequence /> },
        { path: "/sequence-detail/:id", element: <SequenceDetail /> },
        { path: "permissions", element: <Permissions dispatch={dispatch} /> },
      ],
    },
    // {
    //   path: 'login',
    //   element: <LoginPage />,
    // },
    // {
    //   path: 'reset-password',
    //   element: <PasswordResetForm />,
    // },
    {
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "reset-password", element: <PasswordResetPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: "404", element: <Page404 loginUser={decodedToken} /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
