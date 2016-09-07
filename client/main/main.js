FlowRouter.route('/', {
  action: function(params) {
    FlowLayout.render('Layout', {content: 'directory'});
  }
});


FlowRouter.route('/addrMap', {
  action: function(params) {
    FlowLayout.render('Layout', {content: 'selectAddressMap'});
  }
});


Template.directory.events({
  "click .mapSelect": function(event, template){
     FlowRouter.go('/addrMap');
  }
});
