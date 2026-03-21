// Mock API utilities
export function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getDashboardPath(user) {
  if (!user) return "/";
  return user.user_type === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";
}

export function subscribeToAuthChanges(callback) {
  const handleStorageChange = () => {
    const user = getStoredUser();
    callback(user);
  };
  
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}
