import jwt from 'jsonwebtoken';

// TO generate token
const generateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET);
    return token;
}

export {generateToken}