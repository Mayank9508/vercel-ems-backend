import {UserModel} from "./models/user.model.js"
import bcrypt from "bcrypt"

export const userRegister = async () => {
    try {
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new UserModel({
            name: "admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin",
        })

        await newUser.save()
    } catch (error) {
        console.log(error);
    }
}

userRegister();