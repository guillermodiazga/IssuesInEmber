App = Ember.Application.create();

App.Router.map(function(){
    this.resource("issues",{},function(){
        this.route('new');
        this.resource("issue", {path: ':issue_id'});
    });
});

App.IssuesRoute = Ember.Route.extend({
    model: function(){
        return issues;
    }
});

App.IssuesController = Ember.ArrayController.extend({
    needs : ['issue'],
    actions: {
        init: function(){
            var issue = this.get('controllers.issue');
            issue.set('editing',false);
        }
    }
});

App.IssueRoute = Ember.Route.extend({
    model: function(params){
        return issues.findBy('id', parseInt(params.issue_id));
    }    
});


App.IssueController = Ember.ObjectController.extend({
    editing : false,
    needs : ['issues'],
    actions: {
        edit : function(){
            this.set('editing',true);
        },
        doneEdit : function(){
            this.set('editing',false);
        },
        delete : function(){
            var issues = this.get('controllers.issues').get('model');
            var id = this.get('id');
            var issue = issues.findBy('id', parseInt(id));
            issues.removeObject(issue);
            this.transitionToRoute('issues');
        },
    }
});



App.IssuesNewRoute = Ember.Route.extend({
    
                                        
    model: function(){
        
        var idNew = function (){
            return Math.floor(Math.random()*10000000);
        };
        
        return {
                id: idNew(),
                title : "",
                body: ""
               };
    }    
});

App.IssuesNewController = Ember.ObjectController.extend({
    needs : ['issues'],
    actions : {
        save : function () {
            var issue = this.get('model');
            issues = this.get('controllers.issues').get('model');
            issues.unshiftObject(issue);  
            
            this.transitionToRoute('issues');
        } 
    }
});