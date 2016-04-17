var express = require('express');
var router = express.Router();

var Comment = require('../models/comment.js');

/*Add one comment*/
router.post('/', function(req, res, next) {
	var newItem = new Comment(
	{user_name: req.body.user, 
	dish_name:req.body.dish,
	publish_time:req.body.time,
	score:req.body.score,
	comment_description:req.body.description
	});
	newItem.save(function(err, data){
		if (err) {
			res.json(err);
		}
		else {
			res.json(data);
		}
	});
});

/* GET comment by user_id, sort by time*/
router.get('/user/:user', function(req, res, next) {
	var query = Comment.find({user_name: req.params.user});
	query.sort('-publish_time');
 	query.exec(function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that name does not exist in this database.'});
		}
		else {
			res.json(data);
		}
	});
});

/*GET one comment by user and time period, sort by time */
router.get('/user', function(req, res, next) {
	var user = req.body.user;
	var topdate = req.body.topdate; 
	var buttomdate= req.body.buttomdate;
	var query = Comment.find(
		{user_name: user,
		 createdAt: {'$gte': new Date(buttomdate),'$lte':new Date(topdate)},
		}
		);
//db.comment.find({'createdAt' : {'$gte': ISODate('2016-04-15T18:39:00.000Z')}}) in MongoDB
	query.sort('createdAt');
 	query.exec(function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that name does not exist in this database.'});
		}
		else {
			res.json(data);
		}
	});
});



/*GET comment by user and dish*/
router.get('/:user/:dish', function(req, res, next) {
	Comment.find({user_name: req.params.user,dish_name:req.params.dish}, function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that name does not exist in this database.'});
		}
		else {
			res.json(data);
		}
	});
});


/*GET comment by dish, sort by time, return dish_name and score only*/
router.get('/dish', function(req, res, next) {
	var query = Comment.find({dish_name:req.body.dish});
	query.sort('-publish_time');
	query.select('dish_name score');
 	query.exec(function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that name does not exist in this database.'});
		}
		else {
			res.json(data);
		}
	});
});


/*GET comment by dish, sort by time, return detailed comment*/

router.get('/:dish', function(req, res, next) {
	var query = Comment.find({dish_name:req.params.dish});
	query.sort('-publish_time');
 	query.exec(function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that name does not exist in this database.'});
		}
		else {
			res.json(data);
		}
	});
});


//Return None, why?
/*router.get('/dish/:dish', function(req, res, next) {
	var query = Comment.find({dish_name:req.params.dish});
	query.sort('-publish_time');
 	query.exec(function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that name does not exist in this database.'});
		}
		else {
			res.json(data);
		}
	});
});*/

/* UPDATE one item */
router.put('/:id', function(req, res, next) {
	var id = {comment_id: req.params.id};
	var update = {comment_description: req.body.description};
	var options = {new: true};
	Comment.findOneAndUpdate(id, update, options, function(err, data){
		if (err) {
			res.json(err.message);
		}
		else {
			res.json(data);
		}
	});
});


/* DELETE one item */
router.delete('/:id', function(req, res, next) {
	Comment.findOneAndRemove({comment_id: req.params.id}, function(err, data){
		if (err) {
			res.json(err.message);
		}
		else if (data.length===0) {
			res.json({message: 'An item with that id does not exist in this database.'});
		}
		else {
			res.json({message: 'Success. Item deleted.'});
		}
	});
});


/* GET comments listing. */
router.get('/', function(req, res, next) {
  Comment.find(function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

module.exports = router;