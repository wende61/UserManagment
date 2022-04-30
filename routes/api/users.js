const express = require("express");
const router = express.Router();
const uuid = require("uuid");
let users = require("../../models/user/Users");
var validator = require('fluent-validator');

validator.throwError = function(errors) {
	new Error('Validation error. ' + errors.map(function(error) {
        console.log(error.message);
		return error.message;
	}));
}

router.get("/", (req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id));
    if (found) {
      res.json(users.filter(user => user.id === parseInt(req.params.id)));
    } else {
      res.sendStatus(400);
    }
  });
  
  router.post("/", (req, res) => {
    var validation = validator()
    .validate(req.body.name).isNotEmpty()
    .validate(req.body.email).isNotEmpty();
 
validation.throwOnError(); // Throws error if there are validation errors.
// Adding custom error thrower used in validation.throwOnError()
if(validation.hasErrors()){
    return res.json(validation.getErrors());
}
    const newUser = {
      id: uuid.v4(),
      name: req.body.name,
      email: req.body.email  
    };

    if (!newUser.name || !newUser.email) {
      return res.sendStatus(400);
    } 
    users.push(newUser);
    res.json(users);
  });
  //Update User

  router.put("/:id", (req, res) => {
      const found = users.some(user => user.id === parseInt(req.params.id));   
    if (found) {
      const updateUser = req.body;
      users.forEach(user => {
        if (user.id === parseInt(req.params.id)) {
          user.name = updateUser.name ? updateUser.name : user.name;
          user.email = updateUser.email ? updateUser.email : user.email;
          res.json({ msg: "User updated", user });
        }
      });
    } else {
      res.sendStatus(400);
    }
  });
    
  //Delete User
  router.delete("/:id", (req, res) => {
    const found = users.some(user => user.id === parseInt(req.params.id));
    if (found) {
      users = users.filter(user => user.id !== parseInt(req.params.id))
      res.json({
        msg: "User deleted",
        users
      });
    } else {
      res.sendStatus(400);
    }
  });
  
  module.exports = router;