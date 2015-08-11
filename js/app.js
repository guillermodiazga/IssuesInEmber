/*Init App*/
App = Ember.Application.create({
/*  LOG_TRANSITIONS: true*/
});


/*Router*/
App.Router.map(function () {
  this.resource('issues', function () {
      this.resource('issue', {path: 'issue/:issue_id'});
      this.route('new');
  });

  this.route('login');
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

App.LoginRoute = Ember.Route.extend({
  model: function() {
    return {username: '', password: '', rememberMe: false};
  }
});

App.ValidateSession = function (path,isLogin) {
  var url = path.router.location.location.hash;

  if(isLogin && url == '#/login'){
    location = "/emberFull/#/"
  }else if(!isLogin){
    path.transitionTo('login');
  }
}

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    var user = sessionStorage['userName'] ? sessionStorage['userName'] : '';

    return {name: user};
  },
  activate: function() {
    App.ValidateSession(this, this.controllerFor('application').isLogin);
  },
  actions: {
    willTransition: function(){
      App.ValidateSession(this, this.controllerFor('application').isLogin);
    }
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
    save() {
      var issue = this.get('model'),
          issues = this.get('issues').get('model');

          issues.unshiftObject(issue);

          this.transitionToRoute('issue', issue);
    }
  }
});

App.ApplicationController = Ember.Controller.extend({
  isLogin : sessionStorage['isLogin'] ? JSON.parse(sessionStorage['isLogin']) : false,
  actions: {
    SignOut(){
      var logout = confirm("You are about to finish your session into Emberracados");

      if (logout == true) {
          this.set('isLogin',false);
          sessionStorage['isLogin'] = false;
          this.transitionToRoute('login');
      }
    }
  }
});

App.LoginController = Ember.Controller.extend({
  application : Ember.inject.controller(),
  actions : {
    signIn : function () {
      var _this = this,
          _applicationController = this.get('application'),
          _values = this.get('model');

      $.post("https://10.3.8.131/login/action", {
        userOrMail: _values.username,
        password: _values.password,
        rememberMe: _values.rememberMe
      }).then(function(res) {
          if(res.login){
            sessionStorage['isLogin'] = res.login;
            _applicationController.set('isLogin',true);
            _user = res.person.name + ' ' + res.person.lastName;
            _applicationController.set('model.name', _user);
            sessionStorage['userName'] = _user;
            sessionStorage['token'] = res.message;
            _this.transitionToRoute('index');
          }else{
            alert(res.message);
          }
      });
    }
  }
});

/*New Handlebar Helper*/
var showdown = new Showdown.converter();

Em.Handlebars.helpers['markdown'] = function(value){
  return new Ember.Handlebars.SafeString(showdown.makeHtml(value));
}
