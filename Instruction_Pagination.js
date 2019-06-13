//you can just send to ajax request to complete the whole pagination if you want
//like this.....
$.ajax({
        url:'action to get total rows count of target data',
        type:'post',
        data:{info:JSON.stringify({/* your parameters... */})},
        dataType:'text',
        beforeSend:function(){
            
        },
        success:function(rows){
            var reportPage = new pagination({
                pagingBtnID:'the id of paging div on jsp',
                totalRows:rows,
                pagesize:10,
                oriParm:{/* your parameters... */},
                loadData:function(newPagingParm){
                    $.ajax({
                        url:'action to get data with paging param',
                        type:'post',
                        data:{info:JSON.stringify(newPagingParm)},
                        dataType:'json',
                        beforeSend:function(){
                   
                        },
                        success:function(result){
                  
                        }
                    });
                }
            });
        }
    });

/*-------------------------------this is for lazy guy-------------------------*/
    var pageMakerConfig ={
            getPageUrl:"action to get total rows count of target data",
            getDataUrl:"action to get data with paging params",
            pagingBtnID:"the id of paging div on jsp",
            pageSize:0,//number of records per page
            parmObj:{},//your parameters
            pageBeforeSend:function(){
                //do something before ajax start , such as showing a spinner ....
            },
            dataBeforeSend:function(){
                //do something before ajax start , such as showing a spinner ....
            },
            loadData:function(result){
                //process your result here , such as render a table with your result ....
            },
            ajaxDone:function(){
                //do something after you've done your render 
            },
            dataNotFound:function(){
                //do something when there's no record return from backend...
            }
    };
    var pageMaker = new PageMaker(pageMakerConfig);
    
    //you'll be able to reset your paging buttons after some event was triggered
    jQueryObj.on('event',function(){
        pageMaker.Page.reset();
    })
/*---------------------for lazy guy zone end -----------------------------*/    
    
    /* your jsp div will look like things below*/
    /*
    <div class="text-right ml-auto" id="Pagination">
        <span name="resultCount">0</span> records found:
        <button type="button" name="first"  class="btn"><i class="fas fa-angle-double-left"></i></button>
        <button type="button" name="previous"  class="btn"><i class="fas fa-angle-left"></i></button>
        Page: <select name = "pageSelector">
               <option>0</option>
               </select>
        /<span name="totalPageNum">0</span>
        <button type="button" name="next" class="btn"><i class="fas fa-angle-right"></i></button>
        <button type="button" name="last" class="btn"><i class="fas fa-angle-double-right"></i></button>
    </div>
    */
