// API Prefixed from where application starts pointing
export const API_PREFIXED = "/api";

/**
 * Module routes
 *
 */
export const moduleRoutes = {
  user: "/user",
  category: "/category",
  product: "/department",
  employee: "/employee"
 
};

/**
 * Generate User router routes
 *
 */
export const userRoutes = {
  login: {
    path: "/login",
  },
  logout: {
    path: "/logout",
  },
  create: {
    path: "/create",
  },
  changePassword: {
    path: "/change-password",
  },
  profile: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
      path: "/:id",
  },
  emp_profile: {
    path: "/emp/:id",
  },
  users: {
    path: "/",
  },
  /* category_list: {
    path: "/list",
  }, */
  status_change: {
    path: "/status/:id",
  },
};


export const categoryRoutes = {

  category_details: {
    path: "/",
  },
  category_list: {
    path: "/list",
  },
  stock:{
    path: "/stock"
  },
  profile: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
    path: "/:id",
  },
  multiple_delete: {
    path: "/",
  },
  create: {
    path: "/create",
  },
  status_change: {
    path: "/status/:id",
  },
 
};


export const departmentRoutes = {
  get: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
    path: "/:id",
  },
  create: {
    path: "/create",
  },
  allocation_details: {
    path: "/list",
  }

};
