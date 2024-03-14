import passport from "passport";
import GitHubStrategy from "passport-github2"
import UserManagerDAO from './../dao/users.dao.js';
import axios from "axios"

const initializePassport = () => {

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.6c4abe59efe863eb",
        clientSecret: "8d43e9bfda57f6ad48d1b849fcfe4500bfeafc06",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            const email = emailResponse.data[0].email;
            let user = await UserManagerDAO.findUserByEmail(email);
    
            if (!user) {
                console.log("Se registró un nuevo usuario")
                let result = await UserManagerDAO.registerUser(profile._json.login, email, profile._json.type);
                done(null, result);
            } else {
                console.log("Un usuario ha iniciado sesión")
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
    
    passport.serializeUser((user,done) => {
        done(null,user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserManagerDAO.findById(id);
        done(null,user);
    });
}

export default initializePassport