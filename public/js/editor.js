tinymce.init({
  selector: '#content',
  height: 400,
  plugins:
    'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
  toolbar:
    'undo redo | styleselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat | code fullscreen',
  menubar: 'file edit insert view format table tools help',
  content_style: 'body { font-family: Arial, sans-serif; font-size: 14px }',
  style_formats: [
    {
      title: 'Headings',
      items: [
        { title: 'Heading 1', block: 'h1' },
        { title: 'Heading 2', block: 'h2' },
        { title: 'Heading 3', block: 'h3' },
        { title: 'Heading 4', block: 'h4' },
        { title: 'Heading 5', block: 'h5' },
        { title: 'Heading 6', block: 'h6' }
      ]
    },
    { title: 'Paragraph', block: 'p' }
  ],
  font_formats:
    'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace; Georgia=georgia,times,serif',
  fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
  license_key: 'gpl',
  setup: function (editor) {
    editor.on('init', function () {
      console.log('TinyMCE initialized');
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('articleForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      const content = tinymce.get('content').getContent();
      console.log('Submitting form with content:', content);
      if (!content) {
        e.preventDefault();
        alert('Please enter content!');
      } else {
        document.getElementById('contentHidden').value = content;
        // Không can thiệp thêm để form gửi bình thường
      }
    });
  } else {
    console.error('Form with id "articleForm" not found');
  }
});
