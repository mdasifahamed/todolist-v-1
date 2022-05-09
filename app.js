const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // package for dtabase
const date = require(__dirname + "/date.js"); //  external date moudule
const ObjectId = require('mongodb').ObjectID;
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
}); // setting the database
const ItemSchema = new mongoose.Schema({ // creatingt data table or for mongoose it says documents format
  name: String
});
const Item = mongoose.model("Item", ItemSchema); // setting the data model
const listSchema = { // mongoose schema for custom lists and gonna conta itemschema data
  name: String,
  item: [ItemSchema]
};
const List = mongoose.model("List", listSchema); // creating the model

const hello = new Item({ // creating deafult data using data model
  name: "Name"
});
const welcome = new Item({ // creating deafult data using data model
  name: "Welcome"
});
const yourtask = new Item({ // creating deafult data using data model
  name: "Your Task"
});
const input_here = new Item({ // creating deafult data using data model
  name: "Please Input Here"
});

const defaultitems = [hello, welcome, yourtask, input_here];


app.get('/', function(req, res) {
  let day = date.getDay();

  Item.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else if (result.length === 0) {
      Item.insertMany(defaultitems, function(err, result) { // this else if block will prevebt repetaion database input
        if (err) {
          console.log(err);
        } else {
          console.log("successfully items added");
        }
      });
      res.redirect("/")
    } else {
      res.render("lists", {
        listtitle: day,
        item_names: result

      });
    }

  })


});

app.get("/:listid", function(req, res) { // creating custom routs and customlists
  const customlistname = req.params.listid; // this line of ome from express routing save the value in a variable.
  const list = new List({ //initiating list model object for custom list
    name: customlistname,
    item: defaultitems
  })
  List.findOne({ // mongo findone method to check do we have same page or rout
    name: customlistname
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result) { // if we dont have requested route we will create new route and and page using ejs
      const newList = new List({
        name: customlistname,
        item: defaultitems
      })
      newList.save(); // the save the default data to data database
      res.redirect("/" + customlistname); // lastly redirect the page to user after adding the documents to the same page
    } else {
      res.render("lists", {
        listtitle: result.name,
        item_names: result.item
      })
    }
  })

})

app.post("/", function(req, res) {
  let day_0 = date.getDay();
  let item = req.body.user_input; // Catchin the the item from the user
  let listname = req.body.List // cathinh the url api name
  const items =new Item({ // initiatinthe item object.
    name: item // setting the item object attribute from the user input .
  })
  if (req.body.List === day_0 ) { //checking the condition for in which page the is currently visisint
    items.save(); // for the root page nothing willl happen only default items will be saved.
    res.redirect("/") // and it redirect to the home route
  } else {
    List.findOne({name:listname}, function(err,result){ // this model.findOne moongose method will add the new items to new collection accordint to the tittle name
      if(err){
        console.log(err);
      }else{
        result.item.push(items);
        result.save()
        res.redirect("/" + listname)
      }
    })
  }

});



app.post("/delete", function(req, res) {
  const item_to_be_deleted_by_checked_box = req.body.delete_item; // this line of code receive the id checked from ejs stos it
  Item.findByIdAndRemove(item_to_be_deleted_by_checked_box, function(err) { // mongoose method of deleting an item by its id.
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully Deleted");
    }
  })
  res.redirect("/");
});


app.listen(port, function() {
  console.log("server Started");
})
