Posts = new Meteor.Collection('posts');
Choices = new Meteor.Collection('choices');

if (Meteor.isClient) {

  Session.setDefault("counter", 2);

  var words = ["time", "issue", "year", "side", "people", "kind", "way", "head", "day", "house", "man", "service", "thing", "friend", "woman", "father", "life", "power", "child", "hour", "world", "game", "school", "line", "state", "end", "family", "member", "student", "law", "group", "car", "country", "city", "problem", "community", "hand", "name", "part", "president", "place", "team", "case", "minute", "week", "idea", "company", "kid", "system", "body", "program", "information", "question", "back", "work", "parent", "government", "face", "number", "others", "night", "level", "office", "point", "door", "home", "health", "water", "person", "room", "art", "mother", "war", "area", "history", "money", "party", "result", "fact", "change", "month", "morning", "lot", "reason", "right", "research", "study", "girl", "book", "guy", "eye", "food", "job", "moment", "word", "air", "business", "teacher"];

  Template.router.ishome = function () {
    return window.location.pathname == "/"
  };

  Template.home.events({
    'click .save': function (event, template) {
      var title = template.find(".title").value;
      var index = Math.floor(Math.random()*(words.length+1))
      var postId = Posts.insert({
        title: title,
        shoutkey: words[index]
      });
      for (var x = 0; x < Session.get("counter"); x++){
        var value = template.find(".choice" + x).value;
        Choices.insert({
          post_id: postId,
          value: value,
          score: 0
        });
      }
      $('.shoutkey').append("<h4>Your ShoutPoll name is " + words[index] + "</h4><a href='" + window.location.origin + "/" + words[index] + "'>Go there now</a>");
    },
    'click .addOne': function () {
      // increment the counter when button is clicked
      var count = Session.get("counter");
      var newInput = "<input type='text' class='choice" + count + "' placeholder='Option "+ (count+1)+"'>";
      $('.choices').append(newInput);
      Session.set("counter", count + 1);
    }
  });

  Template.view.post = function () {
    var post = Posts.findOne({shoutkey: window.location.pathname.substr(1, window.location.pathname.length)});
    if (post)
      Session.set("postId", post._id);
    return post;
  };

  Template.view.choices = function () {
    return Choices.find({post_id: Session.get("postId")});
  };

  Template.view.standings = function () {
    return Choices.find({post_id: Session.get("postId")}, {sort: {score: -1}});
  };

  Template.view.events({
    'click .option': function () {
      Choices.update(this._id, {$inc: {score: 1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
