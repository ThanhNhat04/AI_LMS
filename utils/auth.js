export const getUserRole = () => {
  if (typeof window === "undefined") return null; // tránh lỗi khi SSR
  const storedRole = localStorage.getItem("role");
  return storedRole?.replace(/^"|"$/g, "") || null;
};

// Kiểm tra đúng một role
export const hasRole = (targetRole) => {
  return getUserRole() === targetRole;
};

// Kiểm tra thuộc 1 trong nhiều role
export const hasAnyRole = (roles = []) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};
aster
// Role cụ thể
export const isAdmin = () => hasRole("admin");
export const isTeacher = () => hasRole("teacher");
export const isStudent = () => hasRole("student");
