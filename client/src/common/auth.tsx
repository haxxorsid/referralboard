import React from "react";
import { loginType } from "../types";
import { loginUser, logoutUser } from "./apiService";

interface AuthContextType {
    loggedIn: boolean;
    signin: (loginValues: loginType, callback: VoidFunction, failureCallback: (error: any) => void) => void;
    signout: (callback: VoidFunction, failureCallback: (error: any) => void) => void;
    logInValidated: (value: boolean) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [loggedIn, setLoggedIn] = React.useState<boolean>(true);

    let signin = (loginValues: loginType, callback: VoidFunction, failureCallback: (error: any) => void) => {
        return loginUser(loginValues).then(() => {
            setLoggedIn(true);
            callback();
        }).catch((err) => {
            failureCallback(err);
        });
    };

    let signout = (callback: VoidFunction, failureCallback: (error: any) => void) => {
        return logoutUser().then(() => {
            setLoggedIn(false);
            callback();
        }).catch((err) => {
            failureCallback(err);
        });
    };

    let logInValidated = (value: boolean) => {
        setLoggedIn(value)
    }

    let value = { loggedIn, signin, signout, logInValidated };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}