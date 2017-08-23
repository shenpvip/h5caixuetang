/**
 * Created by chencong on 2016-06-22.
 * 限制输入框输入字符的长度
 * @param max 字符长度限制
 * @param callback 回调
 */
;(function(factory){
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.maxLength = function(max,callback){
        this.each(function(){
            var type = this.tagName.toLowerCase();
            var inputType = this.type? this.type.toLowerCase() : null;
            if(type == "input" && inputType == "text" || inputType == "password"){
                this.maxLength = max;
            }else if(type == "textarea"){
                this.onkeypress = function(e){
                    var ob = e || event;
                    var keyCode = ob.keyCode;
                    var hasSelection = document.selection? document.selection.createRange().text.length > 0 : this.selectionStart != this.selectionEnd;
                    return !(this.value.length >= max && (keyCode > 50 || keyCode == 32 || keyCode == 0 || keyCode == 13) && !ob.ctrlKey && !ob.altKey && !hasSelection);
                };
                $(this).on('keyup change propertychange oninput',function(){
                    var len = this.value.length;
                    if(len > max){
                        this.value = this.value.substring(0,max);
                        return;
                    }
                    typeof callback === 'function' && callback.call(this,(max-len));
                });
            }
        });
    };
}));