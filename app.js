const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // package for dtabase
const date = require(__dirname + "/date.js"); //  external dat moudule
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB")// setting the database
const ItemSchema = new mongoose.Schema({ // creatingt data table or for mongoose it says documents format
  name : String
});
const Item = mongoose.model("Item", ItemSchema); // setting the data model

const hello = new Item({ // creating deafult data using data model
  name : "Name"
});
const welcome = new Item({ // creating deafult data using data model
  name : "Welcome"
});

const defaultitems= [hello, welcome];


app.get('/', function(req, res) {
    let day = date.getDay();

  Item.find({},function(err,result){
    if(err){
      console.log(err);
    }else if(result.length === 0){
      Item.insertMany(defaultitems,function(err,result){ // this else if block will prevebt repetaion database input
        if(err){
          console.log(err);
        }else{
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
app.post("/", function(req, res) {
  let item = req.body.user_input;

  if (req.body.List === "Worklist") {
    workitems.push(item);
    res.redirect("/work")
  } else {
    items.push(item);
    res.redirect("/")
  }

});
app.get("/work", function(req, res) {
  res.render("lists", {
    listtitle: "Worklist",
    item_names: workitems
  });

})
app.post("/work", function(req, res) {
  let item = req.body.user_input;

  res.redirect("/work")
})
app.post("/delete",function(req,res){
  console.log(req.body.delete_item);
})


app.listen(port, function() {
  console.log("server Started");
})
