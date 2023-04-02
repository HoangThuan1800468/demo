import { Injectable } from "@nestjs/common";
import { UserService } from "src/users/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ){}
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findUserForName(username);

        const password = `${pass}`;
        const oldPassword = `${user.password}`;

        const validPassword = await bcrypt.compare(password,oldPassword);

        if (user && validPassword) {
            const payload = { id: user._id,username: user.username, admin: user.admin };
            const token = this.jwtService.sign(payload);
            const data = {
                token: token
            }
            this.userService.updateUser(user._id,data);
            return {
                access_token: token,
            }
        }
        return 'Username or password is not validate';
    }
    async validateWallet(pass_rq: string, pass_db: string){
        const password = `${pass_rq}`;
        const oldPassword = `${pass_db}`;

        const validPassword = await bcrypt.compare(password,oldPassword);

        return validPassword;
    }
    async logoutUser(id: string): Promise<any> {
        const data = {
            token:'',
        }
        await this.userService.updateUser(id,data);
        return 'logout sucess!';
    }
}