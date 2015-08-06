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
  issues: Ember.inject.controller(),
  editing: false,
   actions: {
    edit() {
      this.set('editing', true);
    },
    doneEditing() {
      this.set('editing', false);
    },
    delete() {
      var issues = this.get('issues').get('model'),
          id = this.get('model').id,
          issue = issues.findBy('id', parseInt(id));

          issues.removeObject(issue);
          this.transitionToRoute('issues');

    }
  }
});

App.IssuesNewController = Ember.Controller.extend({
  issues : Ember.inject.controller(),
  actions: {
    save : function () {
      var issue = this.get('model'),
          issues = this.get('issues').get('model');

          issues.unshiftObject(issue);

          this.transitionToRoute('issue', issue);
    }
  }
});

var showdown = new Showdown.converter();

Em.Handlebars.helpers['markdown'] = function(value){
  return new Ember.Handlebars.SafeString(showdown.makeHtml(value));
}
