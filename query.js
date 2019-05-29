//you'll need to create 2 controller to response a total count of record and the records that are seperated

 $.ajax({
        url:'*getting_row_count',
        type:'post',
        data:{info:JSON.stringify(*yourparams)},
        dataType:'text',
        success:function(rows){//return an int expected
            var reportPage = new pagination({
                pagingBtnID:'reportPagination',
                totalRows:rows,
                pagesize:10,
                oriParm:*yourparams,
                loadData:function(newPagingParm){
                    $.ajax({
                        url:'go_query',
                        type:'post',
                        data:{info:JSON.stringify(newPagingParm)},
                        dataType:'json',
                        success:function(result){
                           //dealing your result...
                        }
                    });
                }
            });
        }
    })
