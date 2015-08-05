/*Init App*/
App = Ember.Application.create();


/*Router*/

App.Router.map(function () {
  this.resource('issues', function () {
      this.resource('issue', {path: 'issue/:issue_id'});
      this.route('new');
  });
});


/*Models*/

App.IssuesRoute = Ember.Route.extend({
  model: function () {
    return issues;
  }
});

App.IssueRoute = Ember.Route.extend({
  model: function (params) {
    return issues.findBy('id', parseInt(params.issue_id));
  }
});

App.IssuesNewRoute = Ember.Route.extend({
  model: function() {
    var idNew = function (){
      return Math.floor(Math.random()*10000000);
    };

    return {id: idNew(), title: '', body: ''};
  }

});

/*Controllers*/

App.IssuesController = Ember.Controller.extend({
   issue: Ember.inject.controller(),
   actions: {
    init() {
      var issue = this.get('issue');
          issue.set('editing', false);
    }
  }
});

App.IssueController = Ember.Controller.extend({
  editing: false,
   actions: {
    edit() {
      this.set('editing', true);
    }
  }
});

