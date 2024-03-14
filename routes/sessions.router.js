import express from 'express';
import passport from 'passport';
const router = express.Router();

router.get("/github",passport.authenticate("github",{scope:["_json:email"]}),async(req,res)=>{})

router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user = req.user;
    res.redirect("/api/products")
})

export default router;