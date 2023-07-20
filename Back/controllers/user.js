

const signUp = (req, res) => {
    res.status (200).json ({message:'Sign Up Complete'}) //need to do middleware!*
}
const login = (req, res) => {
    res.status (200).json ({userId:'urmom',token:'12345'})
}
module.exports = {signUp, login} //to be able to reference the signUp or login function in a different file