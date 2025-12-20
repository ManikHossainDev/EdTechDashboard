/* eslint-disable no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardHome from "../page/DashboardHome/DashboardHome";
import ForgetPassword from "../page/Auth/ForgetPassword/ForgetPassword";
import SignIn from "../page/Auth/SignIn/SignIn";
import Otp from "../page/Auth/Otp/Otp";
import NewPassword from "../page/Auth/NewPassword/NewPassword";
import PersonalInformationPage from "../page/PersonalInformation/PersonalInformationPage";
import SettingsPage from "../page/Settings/SettingsPage";
import AboutUsPage from "../page/AboutUs/AboutUsPage";
import EditAboutUs from "../page/EditAboutUs/EditAboutUs";
import PrivacyPolicyPage from "../page/PrivacyPolicy/PrivacyPolicyPage";
import EditPersonalInformationPage from "../page/EditPersonalInformationPage/EditPersonalInformationPage";
import EditPrivacyPolicy from "../page/EditPrivacyPolicy/EditPrivacyPolicy";
import TermsConditions from "../page/TermsConditions/TermsConditions";
import EditTermsConditions from "../page/EditTermsConditions/EditTermsConditions";
import Notification from "../component/Main/Notification/Notification";
import EarningsPage from "../page/EarningsPage/EarningsPage";
import UsersPage from "../page/Users/UsersPage";
import ContactUs from "../page/ContactUs/ContactUs";
import EditContactUs from "../page/EditContactUs/EditContactUs";
import ModulesPage from "../page/ModulesPage/ModulesPage";
import CreateModulesPage from "../page/CreateModulesPage/CreateModulesPage";
import FAQ from "../component/Main/FAQ/FAQ";
import AdminRoutes from "./AdminRoutes";
import Threemodules from "../component/Main/Modules/Threemodules";
import Fourmodules from "../component/Main/Modules/Fourmodules";
import Fivemodules from "../component/Main/Modules/Fivemodules";
import Sixmodules from "../component/Main/Modules/Sixmodules";
import Sevenmodules from "../component/Main/Modules/Sevenmodules";
import Eightmodules from "../component/Main/Modules/Eightmodules";
import Towmodules from "../component/Main/Modules/Towmodules";
import Onemodules from "../component/Main/Modules/Onemodules";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminRoutes>
        <MainLayout />
      </AdminRoutes>
    ),
    errorElement: <h1>Error</h1>,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "Parents",
        element: <UsersPage />,
      },
      {
        path: "CreateModules",
        element: <CreateModulesPage />
      },
      {
        path: "Modules",
        element: <ModulesPage />,
        children: [
          {
            index: true,
            element: <Onemodules />,
          },
          {
            path: "two",
            element: <Towmodules />,
          },
          {
            path: "three",
            element: <Threemodules />,
          },
          {
            path: "four",
            element: <Fourmodules />,
          },
           {
            path: "five",
            element: <Fivemodules/>
          },
          {
            path: "six",
            element: <Sixmodules />,
          },
          {
            path: "seven",
            element: <Sevenmodules />,
          },
          {
            path: "eight",
            element: <Eightmodules />,
          },
        ],
      },
      {
        path: "Earnings",
        element: <EarningsPage />,
      },   
      {
        path: "personal-info",
        element: <PersonalInformationPage />,
      },
      {
        path: "edit-personal-info",
        element: <EditPersonalInformationPage />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "settings/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/settings/edit-privacy-policy/:id",
        element: <EditPrivacyPolicy />,
      },
      {
        path: "settings/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/settings/edit-terms-conditions/:id",
        element: <EditTermsConditions />,
      },
      {
        path: "settings/about-us",
        element: <AboutUsPage />,
      },{
        path: "/settings/edit-about-us/:id",
        element: <EditAboutUs/>
      },
      {
        path: "settings/ContactUs",
        element: <ContactUs />,
      },
      {
        path: "/settings/ContactUs/:id",
        element: <EditContactUs />
      },
      {
        path: "/settings/FAQ",
        element: <FAQ />
      },
    ],
  },
  {
    path: "/auth",
    errorElement: <h1>Auth Error</h1>,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "otp/:email",
        element: <Otp />,
      },
      {
        path: "new-password/:email",
        element: <NewPassword />,
      },
    ],
  },
]);

export default router;
