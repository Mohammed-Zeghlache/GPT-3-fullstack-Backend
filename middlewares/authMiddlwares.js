const jwt =require('jsonwebtoken');

const authMiddlwares = (req,res,next)=>{
    let token = req.headers.authorization
    token = token?.split(" ")[1]

    if(!token){
        return res.status(401).json({message:"You have to login "})
    }
    try {
        const decodedToken = jwt.verify(token,"SECRET_jw_ssdsdsd")
        req.user = decodedToken
        next() //lazem nkhalo hadhi next

    } catch (error) {
        res.status(400).json({message:"Invalid token !"})
    }

}
module.exports = authMiddlwares;