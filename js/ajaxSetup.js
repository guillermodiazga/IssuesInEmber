$.ajaxSetup({
    beforeSend:function(xhr, settings){
      var token = sessionStorage['token'] ? sessionStorage['token'] : '';

      if(settings.url.indexOf("login") < 0){
        xhr.setRequestHeader("Authorization", "x-csrf-token="+token);
      }

      $.blockUI();
    },
    complete: function (){
      $.unblockUI();
    },
    error: function(e){
      alert('Error: '+e.status+" "+e.statusText);
    }
});