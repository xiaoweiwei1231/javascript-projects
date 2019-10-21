//分模块
var initCourseTab = (function(doc){
    var oCourseTabLks = doc.getElementsByClassName('course-tab-lk'),
        oCourseCardList = doc.getElementsByClassName('course-card-list')[0],
        oSearchInput = doc.getElementById('js-search-input'),
        courseData = JSON.parse(doc.getElementById('j-course-data').innerHTML),
        cardItemTpl = doc.getElementById('js-card-item-tpl').innerHTML,
        oCourseTabLksLen = oCourseTabLks.length,

        field = 'all';
        
    return {
        searchCourse:function(e){
            var val = oSearchInput.value,
                len = val.length;
            if(len>=1){
                var data = this.searchData(courseData,val);
                oCourseCardList.innerHTML = data && data.length > 0 ?
                                                    this.makeList(data):
                                                    this.showTip('没有课程');
            }else{
                //清空还原
                this.restoreList();
            }
        },  
        searchData:function(data, keyword){
            //reduce 结果叠加到一个数组里面
            return data.reduce(function(prev,elem){
                var res = elem.course.indexOf(keyword);
                res !== -1 && prev.push(elem);
                return prev;
            },[])
        },
        showTip:function(text){
            return "<div class='course-list-tip'><span>"+text+"</span></div>";
        },
        restoreList:function(){
            oCourseCardList.innerHTML = this.makeList(courseData);
            
        },
        changeTabCurrent:function(currentDom){
            for(var i=0;i<oCourseTabLksLen;i++){
                item = oCourseTabLks[i];
                item.className = 'course-tab-lk';
            }
            currentDom.className += ' current';
        },
        tabClick:function(e){
            var e = e || window.event,
                tar = e.target || e.srcElement,
                className = tar.className,
                item;
            if(className == 'course-tab-lk'){
                var field = tar.getAttribute('data-field');
                this.changeTabCurrent(tar);
                oCourseCardList.innerHTML = this.makeList(this.filterData(field,courseData))
            }
        },

        initCourseList:function(){
            console.log(oCourseCardList)
            oCourseCardList.innerHTML = this.makeList(this.filterData('all',courseData))
        },

        makeList: function(data){
            var list = '';
            data.forEach(function(elem){
                list += cardItemTpl.replace(/{{(.*?)}}/img,function(node,key){
                    return {
                        img: elem.img,
                        courseName: elem.course,
                        isFree: elem.is_free === '1' ? 'free' : 'vip',
                        price: elem.is_free === '1' ? '免费' : ("RMB" + elem.price),
                        hours: elem.classes
                    }[key]
                })
            })
            return list;
        },

        filterData: function(field,data){
            //all不需要走filter
            // if(field === 'all'){
            //     return data;
            // }
            return data.filter(function(elem){
                // console.log(field,elem)
                switch(field){
                    case 'all':
                        return true;
                        break;
                    case 'free':
                        return elem.is_free === '1';
                        break;
                    case 'vip':
                        return elem.is_free === '0';
                        break;     
                    default:
                       return true;                               
                }
            })
        }

    }
})(document);

//主要的执行模块
;(function(doc){
    var oSearchInput = doc.getElementById('js-search-input'),
        oTabList = doc.getElementsByClassName('js-course-tab-list')[0];

    var init = function(){
        initCourseTab.initCourseList();
        bindEvent();
    }
    function bindEvent(){
        oSearchInput.addEventListener('input',initCourseTab.searchCourse.bind(initCourseTab));
        oTabList.addEventListener('click',initCourseTab.tabClick.bind(initCourseTab));
    }
    init();
})(document)