var pagination = function(config){
    'use strict';
    this.newParm     = config.oriParm;
    this.totalRows   = config.totalRows;
    this.pagesize    = config.pagesize;
    this.loadData    = config.loadData;
    this.pagingBtnID = config.pagingBtnID;
    
    this.clone = $('#'+this.pagingBtnID).clone();
    
    this.pageCount   = parseInt(this.totalRows/this.pagesize) + ((this.totalRows % this.pagesize) !=0 ? 1 : 0);

    this.newParm['pagesize'] = this.pagesize;

    document.getElementById(config.pagingBtnID).style.display=((config.totalRows<config.pagesize)?'none':'');
    
    this.init(config.sort);

    this.genSelect();
    
    this.newParm['skip'] = 0
    
    this.output(this.newParm);
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
    },
    init:function(sort){
        document.querySelector('#'+this.pagingBtnID+' [name="totalPageNum"]').innerText=this.pageCount;
        document.querySelector('#'+this.pagingBtnID+' [name="resultCount"]').innerHTML=this.totalRows;
        
        var t = this;
        
        $('#'+t.pagingBtnID+' [name="pageSelector"]').off().change(function(e){
            t.moveTo(e);
        });
        $('#'+t.pagingBtnID+' [name="first"]').off().click(function(e){
            t.first(e);
        });
        $('#'+t.pagingBtnID+' [name="next"]').off().click(function(e){
            t.next(e);
        });
        $('#'+t.pagingBtnID+' [name="previous"]').off().click(function(e){
            t.prev(e);
        });
        $('#'+t.pagingBtnID+' [name="last"]').off().click(function(e){
            t.last(e);
        });
        if(sort){//sort
            $('th.sort').each(function(idx,ele){
                $(ele).find('a.sort-button').remove();
                $(ele).append('<a class="mr-auto sort-button"><i class="fas fa-sort-up"></i></a>');
                $(ele).off().click(function(){
                    var isUP = $(this).find('i').attr('class').indexOf('up')>0 ; 
                    $('.sort-button').html('<i class="fas fa-sort-up"></i>');
                    if(isUP){//如果現在是up asc就換成desc
                        t.sort($(this).attr('data-sort-name'),'D');
                        $(this).find('i').removeClass('fa-sort-up').addClass('fa-sort-down');
                    }else{//如果是down desc 就換成asc
                        t.sort($(this).attr('data-sort-name'),'A');
                        $(this).find('i').removeClass('fa-sort-down').addClass('fa-sort-up');
                    }
                })
            });
        }
    },
    sort:function(col,dir){
        this.newParm['sortCol']=col;
        this.newParm['sortDir']=dir;
        this.first();
        this.output(this.newParm);
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
                    sort:config.sort,
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
