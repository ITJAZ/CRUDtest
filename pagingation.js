var pagination = function(config){
    'use strict';
    this.newParm     = config.oriParm;
    this.totalRows   = config.totalRows;
    this.pagesize    = config.pagesize;
    this.loadData    = config.loadData;
    this.pagingBtnID = config.pagingBtnID;
    
    this.clone = $('#'+this.pagingBtnID).clone();
    
    this.pageCount   = parseInt(this.totalRows/this.pagesize) + ((this.totalRows % this.pagesize) !=0 ? 1 : 0);
     
    document.querySelector('#'+config.pagingBtnID+' [name="totalPageNum"]').innerText=this.pageCount;
    document.querySelector('#'+config.pagingBtnID+' [name="resultCount"]').innerHTML=this.totalRows;
    var t = this;
    t.newParm['pagesize'] = t.pagesize;
    
    $('#'+config.pagingBtnID+' [name="pageSelector"]').off().change(function(e){
        t.moveTo(e);
    });
    $('#'+config.pagingBtnID+' [name="first"]').off().click(function(e){
        t.first(e);
    });
    $('#'+config.pagingBtnID+' [name="next"]').off().click(function(e){
        t.next(e);
    });
    $('#'+config.pagingBtnID+' [name="previous"]').off().click(function(e){
        t.prev(e);
    });
    $('#'+config.pagingBtnID+' [name="last"]').off().click(function(e){
        t.last(e);
    });

    document.getElementById(config.pagingBtnID).style.display=((config.totalRows<config.pagesize)?'none':'');
    this.genSelect();
    
    t.newParm['skip'] = 0
    t.output(t.newParm);
}
pagination.prototype={
    newParm:{},
    totalRows :0,
    pageCount :0,
    pagingBtnID:'',
    loadData:null,
    page:1,
    clone:null,
    output:function(pageObj){
        this.loadData(pageObj);
        document.querySelector('#'+this.pagingBtnID+' [name="pageSelector"]').selectedIndex =this.page-1;
    },
    genSelect:function(){
        var op = "";
        for(var i = 1 ; i <= this.pageCount ; i ++){
            op += "<option value='"+i+"'>"+i+"</option>";
        }
        document.querySelector('#'+this.pagingBtnID+' [name="pageSelector"]').innerHTML=op;
    },
    first:function(e){
        if(this.page!=1){
            this.page=1;
            this.newParm['skip'] = (this.page-1)*this.pagesize;
            this.output(this.newParm);   
        }
    },
    next:function(e){
        if(this.page<this.pageCount){
            this.page+=1;
            this.newParm['skip'] = (this.page-1)*this.pagesize;
            this.output(this.newParm);
        }
    },
    prev:function(e){
        if(this.page>1){
            this.page-=1;
            this.newParm['skip'] = (this.page-1)*this.pagesize;
            this.output(this.newParm);
        }
    },
    last:function(e){
        if(this.page!=this.pageCount){
            this.page=this.pageCount;
            this.newParm['skip'] = (this.page-1)*this.pagesize;
            this.output(this.newParm); 
        }  
    },
    moveTo:function(e){
        this.page = e.target.selectedIndex+1;
        if(this.page ==0){
            this.page =1;
        }else if(this.page >this.pageCount){
            this.page =this.pageCount;
        }else{
            this.newParm['skip'] = (this.page-1)*this.pagesize;
            this.output(this.newParm);
        }
    },
    reset:function(){
        $('#'+this.pagingBtnID).replaceWith(this.clone);
    }
}
var PageMaker = function(config){
    var pageMaker = this;
    var pageUrl = config.getPageUrl||"";
    var dataUrl = config.getDataUrl||"";
    var parm = config.parmObj;
    var pageBeforeSend = typeof config.pageBeforeSend == "function"?config.pageBeforeSend:function(){};
    var dataBeforeSend = typeof config.dataBeforeSend == "function"?config.dataBeforeSend:function(){};
    var dataNotFound = typeof config.dataNotFound == "function"?config.dataNotFound:function(){};
    var pagesize = config.pageSize||10;
    var pagingBtnID = config.pagingBtnID || "";
    var render = typeof config.loadData == "function"?config.loadData:function(){};
    var ajaxDone = typeof config.ajaxDone == "function"?config.ajaxDone:function(){};
    $.ajax({
        url:pageUrl,
        type:'POST',
        data:{info:JSON.stringify(parm)},
        beforeSend:pageBeforeSend,
        success:function(rows){
            if(rows>0){
                pageMaker.Page = new pagination({
                    pagingBtnID:pagingBtnID,
                    totalRows:rows,
                    pagesize:pagesize,
                    oriParm:parm,
                    loadData:function(newPagingParm){
                        $.ajax({
                            url:dataUrl,
                            type:'POST',
                            data:{info:JSON.stringify(newPagingParm)},
                            dataType:'JSON',
                            beforeSend:dataBeforeSend,
                            success:render
                        }).then(ajaxDone);
                    }
                }); 
            }else{
                dataNotFound();
            }
        }
    })
}
PageMaker.prototype={
        Page:null
}
