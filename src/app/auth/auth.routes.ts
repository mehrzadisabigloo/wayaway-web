import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";

export const AuthRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login"
  },
  { path: 'login', component: LoginComponent, data: { title: 'ورود ' } },
]
