const router = require('koa-router')();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();

/* var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo_db', { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  //console.log("we're connected!")
});

var tagSchema = mongoose.Schema({
  title: String,
  url: String,
  id: String,
});

var Tag = mongoose.model("Tag", tagSchema);

var todoSchema = mongoose.Schema({
  title: String,
  order: Number,
  completed: Boolean,
  url: String,
  tags: [tagSchema],
  id: String
});

var Todo = mongoose.model("Todo", todoSchema);

*/


router
  .get('/thingy_places/', thingy_places_list)
 
  /*
  //TODOS
  .get('/todos/', list)
  .del('/todos/', clear)
  .post('/todos/', add)
  .get('todo', '/todos/:id', show)
  .patch('/todos/:id', update)
  .del('/todos/:id', remove)
  // TAGS
  .get('/tags/', list_tags)
  .del('/tags/', clear_tags)
  .post('/tags/', add_tag)
  .get('tag', '/tags/:id', show_tag)
  .patch('/tags/:id', update_tag)
  .del('/tags/:id', remove_tag)
  // TODOS / TAGS
  .post('/todos/:id/tags/', add_tag_to_todo)
  .get('/todos/:id/tags/', show_tags_from_todo)
  .del('/todos/:id/tags/:tag_id', remove_tag_from_todo)
  .del('/todos/:id/tags/', remove_all_tag_from_todo)
  // TAGS / TODOS
  .get('/tags/:tag_id/todos/', show_todos_with_tag)
  */

  ;


async function thingy_places_list(ctx) {
  var thingy_places = await thingy_places.find().exec();
  ctx.body = thingy_places
}

/*
async function list(ctx) {
  var todos = await Todo.find().exec();
  ctx.body = todos
}
async function clear(ctx) {
  await Todo.deleteMany().exec();
  ctx.status = 204;
}
async function add(ctx) {
  const todo = ctx.request.body;
  if (!todo.title) ctx.throw(400, { 'error': '"title" is a required field' });
  const title = todo.title;
  if (!typeof data === 'string' || !title.length) ctx.throw(400, { 'error': '"title" must be a string with at least one character' });

  const todo_db = new Todo();
  todo_db.title = title
  todo_db.completed = todo['completed'] || false;
  todo_db.tags = todo['tags'] || [];
  todo_db.order = todo['order'] || 0;
  todo_db.id = "temp"
  await todo_db.save()
  todo_db.id = todo_db._id
  todo_db.url = 'http://' + ctx.host + router.url('todo', todo_db.id);
  await todo_db.save()
  ctx.status = 303;
  ctx.set('Location', todo_db.url);
}
async function show(ctx) {
  const id = ctx.params.id;
  var todo = await Todo.findOne({ 'id': id }).exec();
  if (!todo) ctx.throw(404, { 'error': 'Todo not found' });
  ctx.body = todo
}

async function update(ctx) {
  const id = ctx.params.id;
  var todo = await Todo.findOne({ 'id': id }).exec();
  Object.assign(todo, ctx.request.body);
  await todo.save()
  ctx.body = todo;
}
async function remove(ctx) {
  const id = ctx.params.id;
  await Todo.deleteOne({ 'id': id }).exec();
  ctx.status = 204;
}
async function show_tag(ctx) {
  const id = ctx.params.id;
  const tag = await Tag.findOne({ 'id': id }).exec();
  if (!tag) ctx.throw(404, { 'error': 'Tag not found' });
  todos_with_tag = await Todo.find({ "tags.id": id }).exec();
  return_tag = tag.toObject();
  return_tag['todos'] = todos_with_tag
  ctx.body = return_tag;
}
async function list_tags(ctx) {
  var tags = await Tag.find().exec();
  ctx.body = tags
}
async function clear_tags(ctx) {
  await Tag.deleteMany().exec();
  ctx.status = 204;
}

async function createTag(ctx, title) {
  const tag_db = new Tag();
  tag_db.title = title
  tag_db.id = "temp"
  tag_db.todos = []
  await tag_db.save()
  tag_db.id = tag_db._id
  tag_db.url = 'http://' + ctx.host + router.url('tag', tag_db.id);

  await tag_db.save()

  return tag_db
}
async function add_tag(ctx) {

  const tag = ctx.request.body;
  if (!tag.title) ctx.throw(400, { 'error': '"title" is a required field' });
  const title = tag.title;
  if (!typeof data === 'string' || !title.length) ctx.throw(400, { 'error': '"title" must be a string with at least one character' });
  tag_db = await createTag(ctx, title)
  ctx.status = 303;
  ctx.set('Location', tag_db.url);

}
async function update_tag(ctx) {
  const id = ctx.params.id;
  var tag = await Tag.findOne({ 'id': id }).exec();
  Object.assign(tag, ctx.request.body);
  await tag.save()
  ctx.body = tag;
}
async function remove_tag(ctx) {
  const id = ctx.params.id;
  await Tag.deleteOne({ 'id': id }).exec();
  ctx.status = 204;
}
async function add_tag_to_todo(ctx) {
  const id = ctx.params.id;
  const tag_info = ctx.request.body;

  const todo = await Todo.findOne({ 'id': id }).exec();
  if (!todo) ctx.throw(404, { 'error': 'Todo not found' });

  const tag = await Tag.findOne({ 'id': tag_info['id'] }).exec();
  if (!tag) ctx.throw(404, { 'error': 'Tag not found' });
  todo.tags.push(tag)
  await todo.save()
  ctx.body = todo;
}
async function show_tags_from_todo(ctx) {
  const id = ctx.params.id;
  const todo = await Todo.findOne({ 'id': id }).exec();
  if (!todo) ctx.throw(404, { 'error': 'Todo not found' });
  ctx.body = todo.tags
}

async function remove_tag_from_todo(ctx) {
  const id = ctx.params.id;
  const tag_id = ctx.params.tag_id
  var todo = await Todo.findOne({ 'id': id }).exec();
  if (!todo) ctx.throw(404, { 'error': 'Todo not found' });
  const tag = await Tag.findOne({ 'id': tag_id }).exec();
  if (!tag) ctx.throw(404, { 'error': 'Tag not found' });
  new_tags = todo.tags.filter(t => t.id !== tag.id)
  todo.tags = new_tags
  await todo.save()
  ctx.status = 204;
}
async function remove_all_tag_from_todo(ctx) {
  const id = ctx.params.id;
  var todo = await Todo.findOne({ 'id': id }).exec();
  if (!todo) ctx.throw(404, { 'error': 'Todo not found' });
  todo.tags = []
  await todo.save()
  ctx.status = 204;
}

async function show_todos_with_tag(ctx) {
  todos_with_tag = await Todo.find({ "tags.id": ctx.params.tag_id })
  ctx.body = todos_with_tag
}

*/

app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
