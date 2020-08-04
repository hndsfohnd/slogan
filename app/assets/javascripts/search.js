$(function(){
  var search_list = $("#ajax_result");
  function appenddata(motto){
    var html = `
    <div id="motto_result">
      <table border="2">
        <td class="result__first"><a href="/searches/${motto.id}">${motto.id}</a></td>
        <td class="result__second">${motto.body}</td>
        <td class="result__third">${motto.year}</td>
      </tr>
    </tbody></table></div>`;
    search_list.append(html);

  };
  function appenNodata(nosearch){
    var html = `<p id="result"></p>
    <div class="nosearch">
    <p class="color">${ nosearch }</p></div>`
      search_list.append(html);
  };

  $("#q_body_cont_all").on("keyup", function() { 
    var input = $("#q_body_cont_all").val(); 
    $.ajax({
      type: 'GET',
      url: '/mottos/result',
      data: { q:{body_cont_all: input} },
      dataType: 'json'
    })

    .done(function(datas){
      $("#ajax_result").empty();
      $('#motto_result').addClass("plusclass");

      if (datas.length !== 0 ) { 
        $.each(datas, function(i, data) {
            // 配列fruitsがreg(正規化オブジェクト)とマッチしていたらappendListする
          appenddata(data);
        });
      }
      else {
        appenNodata("一致する検索はありません");
      }

    })
    .fail(function(){
      alert('検索に失敗しました')
    });
  });
});

$(function () {
  $(document).on("click", ".js-edit-comment-button", function () {
    const commentId = $(this).data('comment-id'); 
    const commentLabelArea = $('#js-comment-label-' + commentId);
    const commentTextArea = $('#js-textarea-comment-' + commentId);
    const commentButton = $('#js-comment-button-' + commentId);

    commentLabelArea.hide();
    commentTextArea.show();  
    commentButton.show(); 
  });
});

$(function () {
  $(document).on("click", ".comment-cancel-button", function () {
    const commentId = $(this).data('cancel-id');
    const commentLabelArea = $('#js-comment-label-' + commentId);
    const commentTextArea = $('#js-textarea-comment-' + commentId);
    const commentButton = $('#js-comment-button-' + commentId);
    const commentError = $('#js-comment-post-error-' + commentId);

    commentLabelArea.show();
    commentTextArea.hide();
    commentButton.hide();
    commentError.hide();
  });
});

$(function () {
  $(document).on("click", ".comment-update-button", function () {
    const commentId = $(this).data('update-id');
    const textField = $('#js-textarea-comment-' + commentId);
    const body = textField.val();                            

    $.ajax({                       
      url: '/mottos/' + commentId,
      type: 'PATCH',                 
      dataType: 'json',
      data: { q: {body: body}}
    })
      .done(function () { 
        const commentLabelArea = $('#js-comment-label-' + commentId);
        const commentTextArea = $('#js-textarea-comment-' + commentId);
        const commentButton = $('#js-comment-button-' + commentId);
        const commentError = $('#js-comment-post-error-' + commentId);

        commentLabelArea.show();
        commentLabelArea.text(body);
        commentTextArea.hide();
        commentButton.hide();
        commentError.hide();
    })
  });
});


$(function() {
  $('.js-trash-comment-button').on('click', function() {
    var commentId = $(this).data('comment-id'); 
    var commentBody = $('#js-comment-label-' + commentId).text();
    var allmotto = $("#js-comment-"+commentId)
    var commentdeleteid = $('#js-comment-label-' + commentId)
    var deleteConfirm = confirm( commentBody +'   を削除してよろしいでしょうか？');
        
    if(deleteConfirm == true) {
      $.ajax({
        url: '/mottos/' + commentId,
        type: 'DELETE',
        data: { q:{'id': commentId,
               '_method': 'DELETE'} }// DELETE リクエストだよ！と教えてあげる。
      })

     .done(function() {
        // 通信が成功した場合、クリックした要素の親要素の <tr> を削除
        commentdeleteid.remove();
        allmotto.addClass("displaynone");

      })

     .fail(function() {
        alert('エラー');
      });

    } else {
      (function(e) {
        e.preventDefault()
      });
    };
  });
});