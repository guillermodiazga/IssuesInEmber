$.ajaxSetup({
    headers: {'X-CSRF-Token':  sessionStorage['token'] ? sessionStorage['token'] : ''},
    beforeSend:function(xhr, settings){
      $.blockUI();
    },
    complete: function (){
      $.unblockUI();
    },
    error: function(){
      alert('Connection failure');
    }
});
