import { Strategy } from 'passport-jwt';
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptions] | [opt: import("passport-jwt").StrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        email: any;
    }>;
}
export {};
