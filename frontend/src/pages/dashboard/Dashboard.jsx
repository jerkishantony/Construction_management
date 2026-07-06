import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const roleId = Number(localStorage.getItem("role_id"));

  if (roleId === 1) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}