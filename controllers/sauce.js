const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.setOneSauce = (req,res,next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked : [],
        usersDisliked: []
     });
     sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));   
};

exports.setSauceLikeStatus = (req,res,next) => { 
    switch(req.body.like)
    {
        case 1:
            Sauce.updateOne({ _id: req.params.id }, {$addToSet:{usersLiked: req.body.userId},$inc:{likes: 1} })
                .then(() => res.status(200).json({message: 'Like enregistré !'}) )
                .catch(error => res.status(500).json({ error }));
            break;
        case -1:
            Sauce.updateOne({ _id: req.params.id }, {$addToSet:{usersDisliked: req.body.userId},$inc:{dislikes: 1}})
                .then(() => res.status(200).json({message: 'Dislike enregistré !'}))
                .catch(error => res.status(500).json({ error }));
            break;
        case 0:
            let likeOrDislike = 0;
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    likeOrDislike = sauce.usersLiked.indexOf(req.body.userId) === -1 ? 1 : 0;
                    Sauce.updateOne({ _id: req.params.id }, 
                        {
                            $inc:{likes: likeOrDislike === 0 ? -1 : 0, dislikes: likeOrDislike === 1 ? -1 : 0},
                            $pull:{usersLiked: req.body.userId,usersDisliked: req.body.userId}
                        })
                        .then(() => res.status(200).json({message: 'Like/Dislike annulé !'}) )
                        .catch(error => res.status(500).json({ error }));
                    
                })
                .catch(error => res.status(404).json({error}));
            break; 
        default:
            throw 'Cette valeur de "Like" n\' est pas acceptée !';      
    }      
};

exports.getAllSauces = (req,res,next) => {
    Sauce.find()
       .then(sauce => res.status(200).json(sauce))
       .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({_id: req.params.id })
       .then(sauce => res.status(200).json(sauce))
       .catch(error => res.status(404).json({ error }));   
};

exports.modifySauce = (req,res,next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
         .then(() => res.status(200).json({ message: 'Objet modifié !'}))
         .catch(error => res.status(400).json({ error })); 
};

exports.deleteSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }))      
};