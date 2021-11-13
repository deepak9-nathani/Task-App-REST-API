const express = require('express')
const router = new express.Router()
const Tasks = require('../model/task')
const auth = require('../middleware/auth')



router.post('/tasks',auth,async (req,res)=>{
    // const task = new Tasks(req.body)
    const task = new Tasks({
        ...req.body,
        ownner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
    

})

router.get('/tasks',auth,async (req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
        
    }
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try{
        const task = await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(404).send()
    }
  
})
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const task = await Tasks.findOne({ _id, ownner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation)
    {
        return res.status(404).send({"error":'Invalid Updtes'})
    }
    try{
        // const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const task  = await Tasks.findOne({_id:req.params.id,ownner:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    }
    catch(e)
    {
        res.status(500).send()
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
    // const task =  await Tasks.findByIdAndDelete(req.params.id)
    const task = await Tasks.findOneAndDelete({_id:req.params.id,ownner:req.user._id})
    if(!task)
    {
        return res.status(404).send()
    }
    res.status(200).send(task)
}
catch(e)
{
    res.status(500).send()
}
})

module.exports = router