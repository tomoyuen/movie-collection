var User = require('../models/user')

// signup
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册'
	})
}

// signin
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录'
	})
}

// signup
exports.signup = function(req, res) {
	var _user = req.body.user,
		user = new User(_user)

	User.findOne({name: _user.name}, function(err, user) {
		if (err) {
			console.log(err)
		}

		if (user) {
			return res.redirect('/signin')
		} else {
			user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				res.redirect('/')
			})
		}
	})
}

//signin
exports.signin = function(req, res) {
	var _user = req.body.user,
		name = _user.name,
		password = _user.password

	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err)
		}

		if (!user) {
			return res.redirect('/signup')
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}

			if (isMatch) {
				req.session.user = user
				return res.redirect('/')
			} else {
				return res.redirect('/signin')
			}
		})
	})
}

//logout
exports.logout = function(req, res) {
	delete req.session.user
	// delete app.locals.user

	res.redirect('/')
}

//userlist
exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if(err) {
			console.log(err)
		}
		res.render('userlist', {
			title: 'user list',
			users: users
		})
	})
}

// middware for user
exports.signinRequired = function(req, res, next) {
	var user = req.session.user

	if (!user) {
		return res.redirect('/signin')
	}

	next()
}

// middware for admin
exports.adminRequired = function(req, res, next) {
	var user = req.session.user

	if (user.role && user.role <= 10) {
		return res.redirect('/signin')
	}

	next()
}
