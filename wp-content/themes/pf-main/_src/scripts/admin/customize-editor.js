import $ from 'jquery';

$(window).load(function() {
  $('textarea.wp-editor-area').each(function(){
    let $textarea  = $( this );
    let id         = $textarea.attr( 'id' );
    let editor     = tinyMCE.get( id );
    let setChange;
    let content;

    if ( editor ) {
      if ( editor ) {
        editor.on('keyup input change', function() {
          editor.save();
          $textarea.trigger('change');
        });
      }
    }
  });
});
