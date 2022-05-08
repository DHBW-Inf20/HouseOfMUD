import { Cert, TLS } from "./tls"

export interface Config {
    api: {
        origin: string;
        port: number;
    }
    hostLink: {
        hostAuthKey: string;
        port: number;
    }
    tls: TLS;
    auth: {
        salt: string;
        verifyLink: string;
        passwordResetLink: string;
        emailservice: string;
        emailadress: string;
        emailsecret: string;
        cookiehost: string;
    }
    mongodb: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    }
}