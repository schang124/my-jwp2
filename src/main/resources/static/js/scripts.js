var $answerForm =  $(".answer-write");
var $deleteForm =  $(".form-delete");
$answerForm.on('click', $answerForm.find('button'), addAnswer);
$deleteForm.on('click', $deleteForm.find('button[type=submit]'), deleteAnswer);

function addAnswer(e){
    e.preventDefault();

    var url = $answerForm.attr('action');
    console.log("url : ",  url);

    var queryString = $answerForm.serialize();
    console.log("queryString : ",  queryString);

    $.ajax({
        type : 'post',
        url : url,
        data : queryString,
        dataType : 'json',
        error: function(){
            console.log('fail!');
        },
        success : function(data, xhr, status){
            console.log("data", data);
            var answerTemplate = $("#answerTemplate").html();
            var template = answerTemplate.format(data.writer.userId, data.formattedCreateDate, data.contents, data.question.id,
                data.id);
            $(".qna-comment-slipp-articles").prepend(template);
            $("textarea[name=contents]").val("");
        },
    });

}

function deleteAnswer(e) {
    e.preventDefault();

    var $this = $(this);
    var questionId = $this.data("questionId");
    var answerId = $this.data("answerId");

    console.log("questionId", questionId);
    console.log("answerId", answerId);
    var data = {
        questionId : questionId,
        id : answerId,
    };

    var url = $this.parent().attr('action');
    console.log("url : ",  url);

    $.ajax({
        type: 'delete',
        url: url,
        data: data,
        dataType: 'json',
        error: function () {
            console.log('fail!');
        },
        success: function (data, xhr, status) {
            console.log("data", data);
            if(data.valid){
                $this.closest(".article").remove();
            } else{
                alert.(data.errorMessage);
            }
        },
    });

}



String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;
    });
};