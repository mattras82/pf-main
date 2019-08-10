import $ from 'jquery';
import file_upload from './file-upload';

function meta_upload() {
  let impflass = '.pf-metabox-image';
  let $images = $(impflass);
  if($images.length === 0)
    return false;

  $images.each(function() {
    let $image = $(this);
    let mediaType = $image.data('media-type');
    let mediaLabel = mediaType;
    let $btn = $image.find(impflass+'-change-or-remove');
    let uploader = file_upload.init();

    if (mediaType === 'media') {
      uploader.opts.title = 'Select Media';
      uploader.opts.button.text = 'Select Media';
      uploader.opts.library = null;
    } else {
      if (mediaLabel.indexOf('/') > 0) mediaLabel = mediaLabel.substr(mediaLabel.indexOf('/') + 1, mediaLabel.length).toUpperCase();
      uploader.opts.title = `Select ${mediaLabel}`;
      uploader.opts.button.text = `Select ${mediaLabel}`;
      uploader.opts.library.type = mediaType;
    }

    if ($image.data('frame-title'))
      uploader.opts.title = $image.data('frame-title');

    uploader.props.preview = $image.find(impflass+'-preview a');
    uploader.props.attachment_url = $image.find(impflass+'-url');
    uploader.props.attachment_id = $image.find(impflass+'-id');

    function changeImage() {
      file_upload.upload(uploader, function() {
        $image.addClass('has-image');
        $btn.text('Remove '+mediaLabel);
        $image.find(impflass+'-preview').show();
      });

      return false;
    }

    $image.find(impflass+'-change-image').on('click', function(e) {
      e.preventDefault();
      return changeImage();
    });

    $image.find(impflass+'-change-or-remove').on('click',  function(e) {
      e.preventDefault();

      // Remove image
      if($image.hasClass('has-image')) {
        uploader.props.attachment_url.val('');
        uploader.props.attachment_id.val('');
        $btn.text('Add '+mediaLabel);
        $image.removeClass('has-image').find(impflass+'-preview').hide();
        return false;
      }

      return changeImage();
    });
  });
}

$(document).ready(function() {
  meta_upload();
});

export default meta_upload;
