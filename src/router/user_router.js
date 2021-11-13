
const express = require('express')
const Users = require('../model/user')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../mail/account')
const router = new express.Router()

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return cb(new Error('please upload an Image'))
        }
        cb(undefined,true)
    }
})


router.get('/users/me',auth,async (req,res)=>{
    
   res.send(req.user)

})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/login',async (req,res)=>{
    try{
    const user = await Users.findByCred(req.body.Email,req.body.password)
    const token  = await user.generateAuthToken()
    res.send({user , token})
    }
    catch(e)
    {
        res.status(400).send()
    }
})
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/users/me',auth,async (req,res)=>{
    try{
    // const user =  await Users.findByIdAndDelete(req.params.id)
    // if(!user)
    // {
    //     return res.status(404).send()
    // }
    await req.user.remove()
    await sendCancelationEmail(req.user.Email, req.user.name)
    res.send(req.user)
    res.status(200).send(user)
}
catch(e)
{
    res.status(500).send()
}
})

router.post('/users',async (req,res)=>{
    const user = new Users(req.body)
        
    try{
        await user.save()
        await sendWelcomeEmail(user.Email, user.name)
        const token  = await user.generateAuthToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
    
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})


router.delete('/users/me/avatar',auth,async (req,res)=>{
req.user.avatar = undefined
await req.user.save()
res.status(200).send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router