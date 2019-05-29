var pagination = function(config){
    this.newParm     = config.oriParm;
    this.totalRows   = config.totalRows;
    this.pagesize    = config.pagesize;
    this.loadData    = config.loadData;
    this.pagingBtnID = config.pagingBtnID;
    
    this.pageCount   = parseInt(this.totalRows/this.pagesize) + ((this.totalRows % this.pagesize) !=0 ? 1 : 0);
    
    document.querySelector('#'+config.pagingBtnID+' [name="totalPageNum"]').innerText=this.pageCount;
    document.querySelector('#'+config.pagingBtnID+' [name="resultCount"]').innerHTML=this.totalRows;
    var t = this;
    t.newParm['pagesize'] = t.pagesize;
    var selector = document.querySelector('#'+config.pagingBtnID+' [name="pageSelector"]');
    var first = document.querySelector('#'+config.pagingBtnID+' [name="first"]');
    var next  = document.querySelector('#'+config.pagingBtnID+' [name="next"]');
    var prev  = document.querySelector('#'+config.pagingBtnID+' [name="previous"]');
    var last  = document.querySelector('#'+config.pagingBtnID+' [name="last"]');

    selector.removeEventListener('change',function(e){
        t.moveTo(e);
    });
    first.removeEventListener('click',function(e){
        t.first(e);
    });
    next.removeEventListener('click',function(e){
        t.next(e);
    });
    prev.removeEventListener('click',function(e){
        t.prev(e);
    });
    last.removeEventListener('click',function(e){
        t.last(e)
    });
    
    selector.addEventListener('change',function(e){
        t.moveTo(e);
    });
    first.addEventListener('click',function(e){
        t.first(e);
    });
    next.addEventListener('click',function(e){
        t.next(e);
    });
    prev.addEventListener('click',function(e){
        t.prev(e);
    });
    last.addEventListener('click',function(e){
        t.last(e)
    });
    
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
    output:function(pageObj){
        this.loadData(pageObj);
        document.querySelector('#'+this.pagingBtnID+' [name="pageSelector"]').selectedIndex =this.page-1;
    },
    genSelect:function(){
        document.querySelector('#'+this.pagingBtnID+' [name="pageSelector"]').innerHTML="";
        for(var i = 1 ; i <= this.pageCount ; i ++){
            var op = document.createElement('option');
            op.innerHTML = i;
            op.value = i;
            document.querySelector('#'+this.pagingBtnID+' [name="pageSelector"]').appendChild(op);
        }
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
        
    }
}
