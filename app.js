const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/todolistDB');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

const itemsSchema = {
  name: String,
};

const Item = mongoose.model('item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to todolist app',
});

const item2 = new Item({
  name: 'Hit the + button to add a new item',
});

const item3 = new Item({
  name: '<-- Hit this to delete an item',
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema);

app.get('/', function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Insert is succesfully');
        }
      });
      res.redirect('/');
    } else {
      res.render('list', { listTitle: 'Today', newListItems: foundItems });
    }
  });
});

app.get('/:customeListName', function (req, res) {
  const customeListName = req.params.customeListName;

  const list = new List({
    name: customeListName,
    items: defaultItems,
  });

  list.save();
});

app.post('/', function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });

  item.save();

  res.redirect('/');
});

app.post('/delete', function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log('Deleted successfully');
      res.redirect('/');
    }
  });
});

app.listen(3000, function () {
  console.log('The server is running in port 3000');
});
